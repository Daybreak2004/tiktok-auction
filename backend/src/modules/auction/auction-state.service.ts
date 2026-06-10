import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { PrismaService } from '@/common/prisma/prisma.service'
import { RedisService } from '@/common/redis/redis.service'
import { WebsocketGateway } from '@/modules/websocket/websocket.gateway'
import { BidService } from '@/modules/bid/bid.service'

@Injectable()
export class AuctionStateService implements OnModuleInit {
  private readonly logger = new Logger(AuctionStateService.name)
  private activeTimers = new Map<string, NodeJS.Timeout>()

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private websocketGateway: WebsocketGateway,
    private bidService: BidService
  ) {}

  onModuleInit() {
    this.logger.log('竞拍状态机服务已启动')
  }

  async initializeAuction(productId: bigint) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      throw new Error('商品不存在')
    }

    const productKey = `auction:product:${productId.toString()}`
    await this.redisService.hSet(productKey, 'current_price', product.startPrice.toString())
    await this.redisService.hSet(productKey, 'status', 'pending')
    await this.redisService.hSet(productKey, 'duration_seconds', product.durationSeconds.toString())

    this.logger.log(`商品 ${productId} 竞拍初始化完成，起拍价: ${product.startPrice}`)
  }

  async startAuction(productId: bigint) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      throw new Error('商品不存在')
    }

    if (product.status !== 'pending') {
      throw new Error('商品状态不允许开始竞拍')
    }

    const productKey = `auction:product:${productId.toString()}`
    await this.redisService.hSet(productKey, 'status', 'auctioning')
    await this.redisService.hSet(productKey, 'remaining_seconds', product.durationSeconds.toString())

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        status: 'auctioning',
        startedAt: new Date()
      }
    })

    this.startCountdownTimer(productId, Number(product.durationSeconds))

    this.websocketGateway.broadcastToRoom(`product:${productId.toString()}`, 'auction_started', {
      productId: Number(productId),
      startTime: new Date().toISOString(),
      durationSeconds: product.durationSeconds
    })

    this.logger.log(`商品 ${productId} 竞拍正式开始`)
  }

  private startCountdownTimer(productId: bigint, totalSeconds: number) {
    const productIdStr = productId.toString()
    let remainingSeconds = totalSeconds

    if (this.activeTimers.has(productIdStr)) {
      clearInterval(this.activeTimers.get(productIdStr)!)
    }

    const timer = setInterval(async () => {
      remainingSeconds--

      await this.redisService.hSet(
        `auction:product:${productIdStr}`,
        'remaining_seconds',
        remainingSeconds.toString()
      )

      this.websocketGateway.broadcastToRoom(`product:${productIdStr}`, 'countdown', {
        productId: Number(productId),
        remainingSeconds
      })

      if (remainingSeconds <= 0) {
        clearInterval(timer)
        this.activeTimers.delete(productIdStr)
        await this.bidService.endAuction(productId)
      }
    }, 1000)

    this.activeTimers.set(productIdStr, timer)
  }

  async handleAutoExtend(productId: bigint, currentRemainingSeconds: number) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } })
    if (!product) return

    if (currentRemainingSeconds <= product.extendThresholdSeconds) {
      const newRemainingSeconds = currentRemainingSeconds + product.autoExtendSeconds

      const productKey = `auction:product:${productId.toString()}`
      await this.redisService.hSet(
        productKey,
        'remaining_seconds',
        newRemainingSeconds.toString()
      )

      this.restartCountdownTimer(productId, newRemainingSeconds)

      this.websocketGateway.broadcastToRoom(`product:${productId.toString()}`, 'auction_extended', {
        productId: Number(productId),
        extendedSeconds: product.autoExtendSeconds,
        newRemainingSeconds
      })

      this.logger.log(`商品 ${productId} 竞拍自动延时 ${product.autoExtendSeconds} 秒`)
    }
  }

  private restartCountdownTimer(productId: bigint, newTotalSeconds: number) {
    const productIdStr = productId.toString()

    if (this.activeTimers.has(productIdStr)) {
      clearInterval(this.activeTimers.get(productIdStr)!)
    }

    this.startCountdownTimer(productId, newTotalSeconds)
  }

  async cancelAuction(productId: bigint) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } })
    if (!product) return

    const productIdStr = productId.toString()
    if (this.activeTimers.has(productIdStr)) {
      clearInterval(this.activeTimers.get(productIdStr)!)
      this.activeTimers.delete(productIdStr)
    }

    await this.prisma.product.update({
      where: { id: productId },
      data: { status: 'cancelled' }
    })

    this.websocketGateway.broadcastToRoom(`product:${productIdStr}`, 'auction_cancelled', {
      productId: Number(productId)
    })

    this.logger.log(`商品 ${productId} 竞拍已取消`)
  }

  async getAuctionStatus(productId: bigint) {
    const productKey = `auction:product:${productId.toString()}`
    return this.redisService.hGetAll(productKey)
  }
}
