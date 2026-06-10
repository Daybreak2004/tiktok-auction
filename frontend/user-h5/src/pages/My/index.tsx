import React from 'react'
import { Card, List, Avatar, Space } from 'antd-mobile'
import { OrderOutline, SettingOutline, LogoutOutline } from 'antd-mobile-icons'
import { useAuthStore } from '@/store/useAuthStore'
import { useNavigate } from 'react-router-dom'

const My: React.FC = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ padding: 16 }}>
      <Card style={{ marginBottom: 16, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
        <Space style={{ padding: 20 }}>
          <Avatar style={{ '--size': '64px' }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 'bold' }}>
              {user?.nickname || user?.username || '用户'}
            </div>
          </div>
        </Space>
      </Card>

      <Card>
        <List>
          <List.Item prefix={<OrderOutline />} onClick={() => {}}>
            我的订单
          </List.Item>
          <List.Item prefix={<SettingOutline />} onClick={() => {}}>
            设置
          </List.Item>
          <List.Item
            prefix={<LogoutOutline />}
            onClick={handleLogout}
            style={{ color: '#ff4d4f' }}
          >
            退出登录
          </List.Item>
        </List>
      </Card>
    </div>
  )
}

export default My
