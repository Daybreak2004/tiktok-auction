import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from './common/prisma/prisma.module'
import { RedisModule } from './common/redis/redis.module'
import { AuthModule } from './modules/auth/auth.module'
import { ProductModule } from './modules/product/product.module'
import { BidModule } from './modules/bid/bid.module'
import { AuctionModule } from './modules/auction/auction.module'
import { OrderModule } from './modules/order/order.module'
import { QueueModule } from './modules/queue/queue.module'
import { WebsocketModule } from './modules/websocket/websocket.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100
      }
    ]),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'default_secret',
        signOptions: { expiresIn: '7d' }
      })
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    ProductModule,
    BidModule,
    AuctionModule,
    OrderModule,
    QueueModule,
    WebsocketModule
  ]
})
export class AppModule {}
