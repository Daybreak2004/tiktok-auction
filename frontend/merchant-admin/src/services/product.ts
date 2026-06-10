import request from '@/utils/request'
import type { Product, CreateProductDto, UpdateProductDto } from '@/types/product'

interface ProductListParams {
  page?: number
  pageSize?: number
  status?: string
  keyword?: string
}

interface ProductListResponse {
  list: Product[]
  total: number
}

export const getProductList = (params?: ProductListParams) => {
  return request.get<ProductListResponse>('/merchant/products', { params })
}

export const createProduct = (data: CreateProductDto) => {
  return request.post<Product>('/merchant/products', data)
}

export const getProductDetail = (id: number) => {
  return request.get<Product>(`/merchant/products/${id}`)
}

export const updateProduct = (id: number, data: UpdateProductDto) => {
  return request.put<Product>(`/merchant/products/${id}`, data)
}

export const startAuction = (id: number) => {
  return request.post(`/merchant/products/${id}/start`)
}

export const cancelAuction = (id: number) => {
  return request.post(`/merchant/products/${id}/cancel`)
}
