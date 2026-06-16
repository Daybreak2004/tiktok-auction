import React, { useEffect, useState } from 'react'
import { Card, List, Avatar, Toast, FloatingBubble } from 'antd-mobile'
import { useParams } from 'react-router-dom'
import { submitBid, getBidHistory } from '@/services/product'
import { useProductStore } from '@/store/useProductStore'

const AuctionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [currentPrice, setCurrentPrice] = useState(0)
  const [countdown, setCountdown] = useState(300)
  const { bidHistory, setBidHistory } = useProductStore()

  useEffect(() => {
    if (id) {
      getBidHistory(parseInt(id)).then((data: any) => {
        setBidHistory(data)
      })
    }
  }, [id, setBidHistory])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleBid = async () => {
    if (!id) return
    try {
      const nextPrice = currentPrice + 1
      const res: any = await submitBid(parseInt(id), nextPrice)
      setCurrentPrice(res.currentPrice)
      Toast.show('出价成功！')
    } catch (error) {
      Toast.show('出价失败')
    }
  }

  return (
    <div>
      <div style={{ padding: 16 }}>
        <Card>
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 14, color: '#999', marginBottom: 8 }}>当前价格</div>
            <div style={{ fontSize: 48, fontWeight: 'bold', color: '#ff4d4f' }}>
              ¥{currentPrice.toFixed(2)}
            </div>
          </div>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <div style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 14, color: '#999', marginBottom: 8 }}>剩余时间</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: countdown <= 10 ? '#ff4d4f' : '#1677ff' }}>
              {countdown} 秒
            </div>
          </div>
        </Card>

        <Card title="实时排行榜" style={{ marginTop: 12 }}>
          <List>
            {bidHistory.map((item) => (
              <List.Item
                key={item.id}
                prefix={<Avatar src={item.avatar || 'https://via.placeholder.com/40'} />}
                description={`出价: ¥${item.price.toFixed(2)}`}
              >
                {item.nickname}
              </List.Item>
            ))}
          </List>
        </Card>
      </div>

      <FloatingBubble
        axis="y"
        style={{ '--background': '#ff4d4f' } as React.CSSProperties}
        onClick={handleBid}
      >
        立即出价
      </FloatingBubble>
    </div>
  )
}

export default AuctionDetail
