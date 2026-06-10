import { Module, OnModuleInit } from '@nestjs/common'
import { Queue, Worker, Job } from 'bullmq'
import { ConfigService } from '@nestjs/config'
import { AuctionStateService } from '@/modules/auction/auction-state.service'

@Module({
  providers: [],
  exports: []
})
export class BullMQModule implements OnModuleInit {
  private auctionQueue: Queue

  constructor(
    private configService: ConfigService,
    private auctionStateService: AuctionStateService
  ) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379'

    this.auctionQueue = new Queue('auction-tasks', {
      connection: {
        url: redisUrl
      }
    })

    new Worker('auction-tasks', async (job: Job) => {
      switch (job.name) {
        case 'end-auction':
          await this.auctionStateService.cancelAuction(BigInt(job.data.productId))
          break
      }
    }, {
      connection: {
        url: redisUrl
      }
    })

    console.log('BullMQ 定时任务队列已启动')
  }

  async addAuctionEndTask(productId: bigint, delayMs: number) {
    await this.auctionQueue.add('end-auction', { productId: productId.toString() }, {
      delay: delayMs,
      jobId: `auction-end-${productId.toString()}`
    })
  }

  async removeAuctionEndTask(productId: bigint) {
    await this.auctionQueue.remove(`auction-end-${productId.toString()}`)
  }
}
