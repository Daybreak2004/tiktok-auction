import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { MerchantJwtAuthGuard } from './guards/merchant-jwt-auth.guard'
import { UserJwtAuthGuard } from './guards/user-jwt-auth.guard'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/merchant/auth/register')
  async merchantRegister(@Body() registerDto: RegisterDto) {
    return this.authService.merchantRegister(registerDto)
  }

  @Post('/user/auth/register')
  async userRegister(@Body() registerDto: RegisterDto) {
    return this.authService.userRegister(registerDto)
  }

  @Post('/merchant/auth/login')
  async merchantLogin(@Body() loginDto: LoginDto) {
    return this.authService.merchantLogin(loginDto)
  }

  @Post('/user/auth/login')
  async userLogin(@Body() loginDto: LoginDto) {
    return this.authService.userLogin(loginDto)
  }

  @Get('/merchant/auth/profile')
  @UseGuards(MerchantJwtAuthGuard)
  getMerchantProfile(@Request() req) {
    return req.user
  }

  @Get('/user/auth/profile')
  @UseGuards(UserJwtAuthGuard)
  getUserProfile(@Request() req) {
    return req.user
  }
}
