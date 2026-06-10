import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, Query } from '@nestjs/common'
import { PrismaService } from '@/common/prisma/prisma.service'
import { MerchantJwtAuthGuard } from '@/modules/auth/guards/merchant-jwt-auth.guard'
import { UserJwtAuthGuard } from '@/modules/auth/guards/user-jwt-auth.guard'
import { CreateProductDto } from './dto/create-product.dto'

@Controller()
export class ProductController {
  constructor(private prisma: PrismaService) {}

  @Get('/merchant/products')
  @UseGuards(MerchantJwtAuthGuard)
  async getMerchantProducts(@Request() req, @Query() query) {
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 20
    const skip = (page - 1) * pageSize

    const [list, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { merchantId: BigInt(req.user.id) },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.product.count({ where: { merchantId: BigInt(req.user.id) } })
    ])

    return { list, total }
  }

  @Post('/merchant/products')
  @UseGuards(MerchantJwtAuthGuard)
  async createProduct(@Request() req, @Body() createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        merchantId: BigInt(req.user.id)
      }
    })
  }

  @Get('/merchant/products/:id')
  @UseGuards(MerchantJwtAuthGuard)
  async getMerchantProductDetail(@Param('id') id: string) {
    return this.prisma.product.findUnique({ where: { id: BigInt(id) } })
  }

  @Post('/merchant/products/:id/start')
  @UseGuards(MerchantJwtAuthGuard)
  async startAuction(@Param('id') id: string) {
    await this.prisma.product.update({
      where: { id: BigInt(id) },
      data: { status: 'auctioning', startedAt: new Date() }
    })
    return { success: true }
  }

  @Post('/merchant/products/:id/cancel')
  @UseGuards(MerchantJwtAuthGuard)
  async cancelAuction(@Param('id') id: string) {
    await this.prisma.product.update({
      where: { id: BigInt(id) },
      data: { status: 'cancelled' }
    })
    return { success: true }
  }

  @Get('/user/products')
  @UseGuards(UserJwtAuthGuard)
  async getUserProducts(@Query() query) {
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 20
    const skip = (page - 1) * pageSize

    const [list, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.product.count()
    ])

    return { list, total }
  }

  @Get('/user/products/:id')
  @UseGuards(UserJwtAuthGuard)
  async getUserProductDetail(@Param('id') id: string) {
    return this.prisma.product.findUnique({ where: { id: BigInt(id) } })
  }
}
