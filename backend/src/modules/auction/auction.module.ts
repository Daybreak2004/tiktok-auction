import { Module, forwardRef } from '@nestjs/common'
import { AuctionStateService } from './auction-state.service'
import { AuctionController } from './auction.controller'
import { PrismaModule } from '@/common/prisma/prisma.module'
import { RedisModule } from '@/common/redis/redis.module'
import { WebsocketModule } from '@/modules/websocket/websocket.module'
import { BidModule } from '@/modules/bid/bid.module'

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    WebsocketModule,
    forwardRef(() => BidModule)
  ],
  controllers: [AuctionController],
  providers: [AuctionStateService],
  exports: [AuctionStateService]
})
export class AuctionModule {}
