import React, { useEffect, useState } from 'react'
import { Card, Button, Statistic, List, Avatar, Toast, FloatingBubble } from 'antd-mobile'
import { useParams } from 'react-router-dom'
import { DollarOutline, ClockOutline, TrophyOutline } from 'antd-mobile-icons'

const AuctionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [currentPrice, setCurrentPrice] = useState(0)
  const [countdown, setCountdown] = useState(300)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleBid = () => {
    Toast.show('出价成功！')
  }

  return (
    <div>
      <div style={{ padding: 16 }}>
        <Card>
          <div style={{ textAlign: 'center', padding: 20 }}>
            <Statistic
              title="当前价格"
              value={currentPrice}
              precision={2}
              suffix="元"
              valueStyle={{ color: '#ff4d4f', fontSize: 48, fontWeight: 'bold' }}
            />
          </div>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <div style={{ textAlign: 'center', padding: 16 }}>
            <Statistic
              title="剩余时间"
              value={countdown}
              suffix="秒"
              valueStyle={{ color: countdown <= 10 ? '#ff4d4f' : '#1677ff', fontSize: 36, fontWeight: 'bold' }}
            />
          </div>
        </Card>

        <Card title="实时排行榜" style={{ marginTop: 12 }}>
          <List>
            <List.Item
              prefix={<Avatar />}
              description="出价: ¥0.00"
            >
              用户昵称
            </List.Item>
          </List>
        </Card>
      </div>

      <FloatingBubble
        axis="y"
        style={{ '--background': '#ff4d4f', '--color': '#fff' }}
        onClick={handleBid}
      >
        立即出价
      </FloatingBubble>
    </div>
  )
}

export default AuctionDetail
