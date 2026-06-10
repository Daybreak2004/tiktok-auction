import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/common/prisma/prisma.service'

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async getMerchantOrders(merchantId: bigint, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize
    const [list, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { merchantId },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { id: true, name: true, coverImage: true } },
          user: { select: { id: true, nickname: true, avatar: true } }
        }
      }),
      this.prisma.order.count({ where: { merchantId } })
    ])
    return { list, total }
  }

  async getUserOrders(userId: bigint, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize
    const [list, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { id: true, name: true, coverImage: true } }
        }
      }),
      this.prisma.order.count({ where: { userId } })
    ])
    return { list, total }
  }

  async getOrderDetail(orderId: bigint) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: true,
        user: true,
        merchant: true
      }
    })
  }

  async updateOrderStatus(orderId: bigint, status: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status }
    })
  }

  async createOrderFromAuction(productId: bigint, winnerUserId: bigint, finalPrice: number, merchantId: bigint) {
    const orderNo = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    return this.prisma.order.create({
      data: {
        orderNo,
        productId,
        userId: winnerUserId,
        merchantId,
        finalPrice
      }
    })
  }
}
