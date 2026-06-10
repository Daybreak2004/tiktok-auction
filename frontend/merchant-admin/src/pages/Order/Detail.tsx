import React from 'react'
import { Card, Descriptions, Button, Steps, Tag } from 'antd'
import { useParams } from 'react-router-dom'

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <Card title={`订单详情 - 订单ID: ${id}`}>
      <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
        <Descriptions.Item label="订单号">ORD-XXXX-XXXX</Descriptions.Item>
        <Descriptions.Item label="订单状态">
          <Tag color="blue">已支付</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="成交价格">¥0.00</Descriptions.Item>
        <Descriptions.Item label="创建时间">2024-01-01 00:00:00</Descriptions.Item>
      </Descriptions>
      <Card title="状态流转" style={{ marginBottom: 24 }}>
        <Steps current={1}>
          <Steps.Step title="待支付" description="竞拍结束" />
          <Steps.Step title="已支付" description="用户已付款" />
          <Steps.Step title="已发货" description="商家已发货" />
          <Steps.Step title="已完成" description="用户确认收货" />
        </Steps>
      </Card>
      <Button type="primary">标记发货</Button>
    </Card>
  )
}

export default OrderDetail
