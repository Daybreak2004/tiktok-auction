import { Controller, Post, Param, UseGuards, Get } from '@nestjs/common'
import { AuctionStateService } from './auction-state.service'
import { MerchantJwtAuthGuard } from '@/modules/auth/guards/merchant-jwt-auth.guard'

@Controller()
export class AuctionController {
  constructor(private readonly auctionStateService: AuctionStateService) {}

  @Post('/merchant/products/:productId/init')
  @UseGuards(MerchantJwtAuthGuard)
  async initializeAuction(@Param('productId') productId: string) {
    await this.auctionStateService.initializeAuction(BigInt(productId))
    return { success: true }
  }

  @Post('/merchant/products/:productId/start-auction')
  @UseGuards(MerchantJwtAuthGuard)
  async startAuction(@Param('productId') productId: string) {
    await this.auctionStateService.startAuction(BigInt(productId))
    return { success: true }
  }

  @Post('/merchant/products/:productId/cancel-auction')
  @UseGuards(MerchantJwtAuthGuard)
  async cancelAuction(@Param('productId') productId: string) {
    await this.auctionStateService.cancelAuction(BigInt(productId))
    return { success: true }
  }

  @Get('/user/products/:productId/auction-status')
  async getAuctionStatus(@Param('productId') productId: string) {
    return this.auctionStateService.getAuctionStatus(BigInt(productId))
  }
}
