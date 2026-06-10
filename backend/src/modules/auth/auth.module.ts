import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { MerchantJwtStrategy } from './strategies/merchant-jwt.strategy'
import { UserJwtStrategy } from './strategies/user-jwt.strategy'
import { PrismaModule } from '@/common/prisma/prisma.module'

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default_secret',
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d' }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, MerchantJwtStrategy, UserJwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
