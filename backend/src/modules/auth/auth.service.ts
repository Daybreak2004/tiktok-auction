import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '@/common/prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async merchantRegister(registerDto: RegisterDto) {
    const { username, nickname, password } = registerDto
    
    const existing = await this.prisma.merchant.findUnique({ where: { username } })
    if (existing) {
      throw new ConflictException('用户名已存在')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const merchant = await this.prisma.merchant.create({
      data: {
        username,
        nickname,
        passwordHash
      }
    })

    const payload = { sub: Number(merchant.id), type: 'merchant' }
    return {
      token: this.jwtService.sign(payload),
      userInfo: {
        id: Number(merchant.id),
        username: merchant.username,
        nickname: merchant.nickname,
        avatar: merchant.avatar
      }
    }
  }

  async userRegister(registerDto: RegisterDto) {
    const { username, nickname, password } = registerDto
    
    const existing = await this.prisma.user.findUnique({ where: { username } })
    if (existing) {
      throw new ConflictException('用户名已存在')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await this.prisma.user.create({
      data: {
        username,
        nickname,
        passwordHash
      }
    })

    const payload = { sub: Number(user.id), type: 'user' }
    return {
      token: this.jwtService.sign(payload),
      userInfo: {
        id: Number(user.id),
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar
      }
    }
  }

  async merchantLogin(loginDto: LoginDto) {
    const { username, password } = loginDto
    const merchant = await this.prisma.merchant.findUnique({ where: { username } })
    
    if (!merchant) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    const isPasswordValid = await bcrypt.compare(password, merchant.passwordHash)
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    const payload = { sub: Number(merchant.id), type: 'merchant' }
    return {
      token: this.jwtService.sign(payload),
      userInfo: {
        id: Number(merchant.id),
        username: merchant.username,
        nickname: merchant.nickname,
        avatar: merchant.avatar
      }
    }
  }

  async userLogin(loginDto: LoginDto) {
    const { username, password } = loginDto
    const user = await this.prisma.user.findUnique({ where: { username } })
    
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    const payload = { sub: Number(user.id), type: 'user' }
    return {
      token: this.jwtService.sign(payload),
      userInfo: {
        id: Number(user.id),
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar
      }
    }
  }
}
