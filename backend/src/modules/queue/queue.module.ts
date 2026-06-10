import { Module, forwardRef } from '@nestjs/common'
import { BullMQModule } from './bullmq.module'
import { AuctionModule } from '@/modules/auction/auction.module'

@Module({
  imports: [forwardRef(() => AuctionModule)],
  providers: [BullMQModule],
  exports: [BullMQModule]
})
export class QueueModule {}
