import { Controller, Post, Body, Param, UseGuards, Request, Get } from '@nestjs/common'
import { BidService } from './bid.service'
import { UserJwtAuthGuard } from '@/modules/auth/guards/user-jwt-auth.guard'
import { SubmitBidDto } from './dto/submit-bid.dto'

@Controller()
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post('/user/products/:productId/bid')
  @UseGuards(UserJwtAuthGuard)
  async submitBid(
    @Request() req,
    @Param('productId') productId: string,
    @Body() submitBidDto: SubmitBidDto
  ) {
    return this.bidService.submitBid(
      BigInt(productId),
      BigInt(req.user.id),
      submitBidDto.price
    )
  }

  @Get('/user/products/:productId/bids')
  @UseGuards(UserJwtAuthGuard)
  async getBidHistory(@Param('productId') productId: string) {
    return this.bidService.getBidHistory(BigInt(productId))
  }
}
