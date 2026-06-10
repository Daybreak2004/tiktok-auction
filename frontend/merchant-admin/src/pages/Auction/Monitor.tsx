import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, List, Avatar, Button, message, Tag } from 'antd'
import { useParams } from 'react-router-dom'
import { DollarOutlined, ClockCircleOutlined, TrophyOutlined, StopOutlined } from '@ant-design/icons'

const AuctionMonitor: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [currentPrice, setCurrentPrice] = useState(0)
  const [countdown, setCountdown] = useState(300)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCancel = () => {
    message.warning('已取消竞拍')
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>竞拍监控 - 商品ID: {id}</h2>
      <Row gutter={24}>
        <Col span={6}>
          <Card>
            <Statistic
              title="当前价格"
              value={currentPrice}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#cf1322', fontSize: 32, fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="剩余时间"
              value={countdown}
              prefix={<ClockCircleOutlined />}
              suffix="秒"
              valueStyle={{ color: countdown <= 10 ? '#cf1322' : '#1890ff', fontSize: 32, fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="实时排行榜" extra={<TrophyOutlined />}>
            <List
              dataSource={[]}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar>{item.nickname?.[0]}</Avatar>}
                    title={item.nickname}
                    description={`出价: ¥${item.price}`}
                  />
                  {item.rank === 1 && <Tag color="gold">第一名</Tag>}
                </List.Item.Meta>
              )}
            />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 24 }}>
        <Button danger icon={<StopOutlined />} onClick={handleCancel}>
          取消竞拍
        </Button>
      </Card>
    </div>
  )
}

export default AuctionMonitor
