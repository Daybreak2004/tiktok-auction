import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator'

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?: string

  @IsArray()
  images: string[]

  @IsString()
  @IsOptional()
  coverImage?: string

  @IsNumber()
  startPrice: number

  @IsNumber()
  minIncrement: number

  @IsNumber()
  @IsOptional()
  maxPrice?: number

  @IsNumber()
  durationSeconds: number

  @IsNumber()
  autoExtendSeconds: number

  @IsNumber()
  extendThresholdSeconds: number
}
