import request from '@/utils/request'
import type { Order } from '@/types/order'

interface OrderListParams {
  page?: number
  pageSize?: number
  status?: string
}

interface OrderListResponse {
  list: Order[]
  total: number
}

export const getOrderList = (params?: OrderListParams) => {
  return request.get<OrderListResponse>('/merchant/orders', { params })
}

export const getOrderDetail = (id: number) => {
  return request.get<Order>(`/merchant/orders/${id}`)
}

export const updateOrderStatus = (id: number, status: string) => {
  return request.put<Order>(`/merchant/orders/${id}/status`, { status })
}
