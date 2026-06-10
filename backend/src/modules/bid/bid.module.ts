import { Module, forwardRef } from '@nestjs/common'
import { BidService } from './bid.service'
import { BidController } from './bid.controller'
import { PrismaModule } from '@/common/prisma/prisma.module'
import { RedisModule } from '@/common/redis/redis.module'
import { WebsocketModule } from '@/modules/websocket/websocket.module'
import { AuctionModule } from '@/modules/auction/auction.module'

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    WebsocketModule,
    forwardRef(() => AuctionModule)
  ],
  controllers: [BidController],
  providers: [BidService],
  exports: [BidService]
})
export class BidModule {}
