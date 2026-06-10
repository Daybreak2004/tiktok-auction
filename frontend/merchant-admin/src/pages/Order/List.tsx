import React, { useEffect } from 'react'
import { Table, Button, Space, Tag, Card, Input, Select } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { Order, OrderStatus } from '@/types/order'

const { Search } = Input
const { Option } = Select

const OrderList: React.FC = () => {
  const navigate = useNavigate()
  const mockOrders: Order[] = []

  const getStatusColor = (status: OrderStatus) => {
    const colorMap: Record<OrderStatus, string> = {
      pending_payment: 'orange',
      paid: 'blue',
      shipped: 'cyan',
      completed: 'green',
      cancelled: 'red'
    }
    return colorMap[status]
  }

  const getStatusText = (status: OrderStatus) => {
    const textMap: Record<OrderStatus, string> = {
      pending_payment: '待支付',
      paid: '已支付',
      shipped: '已发货',
      completed: '已完成',
      cancelled: '已取消'
    }
    return textMap[status]
  }

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo'
    },
    {
      title: '成交价格',
      dataIndex: 'finalPrice',
      key: 'finalPrice',
      render: (val: number) => `¥${val.toFixed(2)}`
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: Order) => (
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/orders/${record.id}`)}>
          查看详情
        </Button>
      )
    }
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Search placeholder="搜索订单号" style={{ width: 250 }} />
          <Select placeholder="筛选状态" style={{ width: 150 }}>
            <Option value="">全部状态</Option>
            <Option value="pending_payment">待支付</Option>
            <Option value="paid">已支付</Option>
            <Option value="shipped">已发货</Option>
            <Option value="completed">已完成</Option>
          </Select>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={mockOrders}
        rowKey="id"
        pagination={{ total: 0 }}
      />
    </Card>
  )
}

export default OrderList
