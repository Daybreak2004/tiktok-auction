import request from '@/utils/request'
import type { Product, BidRecord } from '@/types/product'

interface ProductListParams {
  page?: number
  pageSize?: number
}

interface ProductListResponse {
  list: Product[]
  total: number
}

export const getProductList = (params?: ProductListParams) => {
  return request.get<ProductListResponse>('/user/products', { params })
}

export const getProductDetail = (id: number) => {
  return request.get<Product>(`/user/products/${id}`)
}

export const submitBid = (productId: number, price: number) => {
  return request.post(`/user/products/${productId}/bid`, { price })
}

export const getBidHistory = (productId: number) => {
  return request.get<BidRecord[]>(`/user/products/${productId}/bids`)
}
