import { Controller, Get, Param, Query, UseGuards, Request, Put, Body } from '@nestjs/common'
import { OrderService } from './order.service'
import { MerchantJwtAuthGuard } from '@/modules/auth/guards/merchant-jwt-auth.guard'
import { UserJwtAuthGuard } from '@/modules/auth/guards/user-jwt-auth.guard'

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/merchant/orders')
  @UseGuards(MerchantJwtAuthGuard)
  async getMerchantOrders(@Request() req, @Query() query) {
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 20
    return this.orderService.getMerchantOrders(BigInt(req.user.id), page, pageSize)
  }

  @Get('/merchant/orders/:id')
  @UseGuards(MerchantJwtAuthGuard)
  async getMerchantOrderDetail(@Param('id') id: string) {
    return this.orderService.getOrderDetail(BigInt(id))
  }

  @Put('/merchant/orders/:id/status')
  @UseGuards(MerchantJwtAuthGuard)
  async updateOrderStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.orderService.updateOrderStatus(BigInt(id), body.status)
  }

  @Get('/user/orders')
  @UseGuards(UserJwtAuthGuard)
  async getUserOrders(@Request() req, @Query() query) {
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 20
    return this.orderService.getUserOrders(BigInt(req.user.id), page, pageSize)
  }

  @Get('/user/orders/:id')
  @UseGuards(UserJwtAuthGuard)
  async getUserOrderDetail(@Param('id') id: string) {
    return this.orderService.getOrderDetail(BigInt(id))
  }
}
