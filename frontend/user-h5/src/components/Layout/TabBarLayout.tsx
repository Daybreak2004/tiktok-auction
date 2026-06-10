import React from 'react'
import { TabBar } from 'antd-mobile'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { AppOutline, VideoOutline, UserOutline } from 'antd-mobile-icons'

const TabBarLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    {
      key: '/home',
      title: '首页',
      icon: <AppOutline />
    },
    {
      key: '/live-room',
      title: '直播间',
      icon: <VideoOutline />
    },
    {
      key: '/my',
      title: '我的',
      icon: <UserOutline />
    }
  ]

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 50 }}>
      <Outlet />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
        <TabBar
          activeKey={location.pathname}
          onChange={(key) => navigate(key)}
        >
          {tabs.map(item => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </div>
    </div>
  )
}

export default TabBarLayout
