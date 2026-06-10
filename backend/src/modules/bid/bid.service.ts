import { Injectable, BadRequestException, Logger, forwardRef, Inject } from '@nestjs/common'
import { PrismaService } from '@/common/prisma/prisma.service'
import { RedisService } from '@/common/redis/redis.service'
import { WebsocketGateway } from '@/modules/websocket/websocket.gateway'
import { AuctionStateService } from '@/modules/auction/auction-state.service'
import { randomUUID } from 'crypto'

@Injectable()
export class BidService {
  private readonly logger = new Logger(BidService.name)

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private websocketGateway: WebsocketGateway,
    @Inject(forwardRef(() => AuctionStateService))
    private auctionStateService: AuctionStateService
  ) {}

  async submitBid(productId: bigint, userId: bigint, bidPrice: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      throw new BadRequestException('商品不存在')
    }

    if (product.status !== 'auctioning') {
      throw new BadRequestException('竞拍未开始或已结束')
    }

    const productKey = `auction:product:${productId.toString()}`
    const lockKey = `auction:lock:${productId.toString()}`
    const lockValue = randomUUID()
    const lockTtl = 10

    const acquired = await this.redisService.acquireLock(lockKey, lockValue, lockTtl)
    if (!acquired) {
      throw new BadRequestException('系统繁忙，请稍后重试')
    }

    try {
      const currentPriceStr = await this.redisService.hGet(productKey, 'current_price')
      const currentPrice = currentPriceStr ? parseFloat(currentPriceStr) : Number(product.startPrice)
      const expectedNextPrice = currentPrice + Number(product.minIncrement)

      if (Math.abs(bidPrice - expectedNextPrice) > 0.01) {
        throw new BadRequestException('出价金额必须等于当前价格加上最小加价幅度')
      }

      const result = await this.redisService.atomicBid(
        productKey,
        userId.toString(),
        bidPrice.toString(),
        Number(product.minIncrement).toString()
      )

      if (result !== 'OK') {
        throw new BadRequestException('出价失败')
      }

      const bidRecord = await this.prisma.bid.create({
        data: {
          productId,
          userId,
          price: bidPrice,
          isWinning: true
        },
        include: {
          user: {
            select: { id: true, nickname: true, avatar: true }
          }
        }
      })

      await this.redisService.zAdd(
        `auction:bids:${productId.toString()}`,
        bidPrice,
        JSON.stringify({
          id: Number(bidRecord.id),
          userId: Number(bidRecord.userId),
          nickname: bidRecord.user.nickname,
          avatar: bidRecord.user.avatar,
          price: bidPrice,
          bidTime: new Date().toISOString()
        })
      )

      this.websocketGateway.broadcastToRoom(`product:${productId.toString()}`, 'price_update', {
        productId: Number(productId),
        currentPrice: bidPrice,
        lastBidder: {
          id: Number(bidRecord.user.id),
          nickname: bidRecord.user.nickname,
          avatar: bidRecord.user.avatar
        }
      })

      this.websocketGateway.broadcastToRoom(`product:${productId.toString()}`, 'new_bid', {
        id: Number(bidRecord.id),
        userId: Number(bidRecord.userId),
        nickname: bidRecord.user.nickname,
        avatar: bidRecord.user.avatar,
        price: bidPrice,
        bidTime: new Date().toISOString()
      })

      const remainingSecondsStr = await this.redisService.hGet(productKey, 'remaining_seconds')
      const remainingSeconds = remainingSecondsStr ? parseInt(remainingSecondsStr) : Number(product.durationSeconds)
      await this.auctionStateService.handleAutoExtend(productId, remainingSeconds)

      if (product.maxPrice && bidPrice >= Number(product.maxPrice)) {
        await this.endAuction(productId)
      }

      this.logger.log(`用户 ${userId} 出价成功，商品 ${productId}，价格 ${bidPrice}`)

      return {
        success: true,
        currentPrice: bidPrice
      }
    } finally {
      await this.redisService.releaseLock(lockKey, lockValue)
    }
  }

  async endAuction(productId: bigint) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } })
    if (!product) return

    const productKey = `auction:product:${productId.toString()}`
    const lastBidderIdStr = await this.redisService.hGet(productKey, 'last_bidder')
    const currentPriceStr = await this.redisService.hGet(productKey, 'current_price')

    const lastBidderId = lastBidderIdStr ? BigInt(lastBidderIdStr) : null
    const currentPrice = currentPriceStr ? parseFloat(currentPriceStr) : 0

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        status: 'ended',
        endedAt: new Date(),
        finalPrice: currentPrice,
        winnerUserId: lastBidderId
      }
    })

    this.websocketGateway.broadcastToRoom(`product:${productId.toString()}`, 'auction_ended', {
      productId: Number(productId),
      finalPrice: currentPrice,
      winnerUserId: lastBidderId ? Number(lastBidderId) : null
    })

    this.logger.log(`竞拍结束，商品 ${productId}，最终价格 ${currentPrice}`)
  }

  async getBidHistory(productId: bigint) {
    const bidHistoryKey = `auction:bids:${productId.toString()}`
    const members = await this.redisService.zRevRange(bidHistoryKey, 0, 49)
    return members.map(member => JSON.parse(member))
  }
}
