export type OrderStatus = 'pending_payment' | 'paid' | 'shipped' | 'completed' | 'cancelled'

export interface Order {
  id: number
  orderNo: string
  productId: number
  userId: number
  merchantId: number
  finalPrice: number
  status: OrderStatus
  paymentTime?: string
  shipTime?: string
  completeTime?: string
  address?: any
  remark?: string
  createdAt: string
}
