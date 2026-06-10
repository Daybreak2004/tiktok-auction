export type ProductStatus = 'pending' | 'auctioning' | 'ended' | 'cancelled'

export interface Product {
  id: number
  merchantId: number
  name: string
  description?: string
  images: string[]
  coverImage?: string
  status: ProductStatus
  startPrice: number
  minIncrement: number
  maxPrice?: number
  durationSeconds: number
  autoExtendSeconds: number
  extendThresholdSeconds: number
  startedAt?: string
  endedAt?: string
  finalPrice?: number
  winnerUserId?: number
  createdAt: string
  updatedAt: string
}

export interface CreateProductDto {
  name: string
  description?: string
  images: string[]
  coverImage?: string
  startPrice: number
  minIncrement: number
  maxPrice?: number
  durationSeconds: number
  autoExtendSeconds: number
  extendThresholdSeconds: number
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
