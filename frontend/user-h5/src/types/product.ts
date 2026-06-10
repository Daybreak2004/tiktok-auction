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
  currentPrice: number
  startedAt?: string
  endedAt?: string
  finalPrice?: number
  winnerUserId?: number
  createdAt: string
}

export interface BidRequest {
  productId: number
  price: number
}

export interface BidRecord {
  id: number
  productId: number
  userId: number
  nickname: string
  avatar?: string
  price: number
  bidTime: string
}
