import { IsNumber, IsNotEmpty } from 'class-validator'

export class SubmitBidDto {
  @IsNumber()
  @IsNotEmpty()
  price: number
}
