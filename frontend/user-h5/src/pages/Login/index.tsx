import React, { useState } from 'react'
import { Form, Input, Button, Card, Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      await login(values.username, values.password)
      Toast.show('登录成功')
      navigate('/home')
    } catch (error: any) {
      Toast.show(error.response?.data?.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 20
    }}>
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32, fontSize: 24, fontWeight: 'bold' }}>
          直播竞拍
        </div>
        <Form
          onFinish={onFinish}
          footer={
            <Button block type="submit" color="primary" size="large" loading={loading}>
              登录
            </Button>
          }
        >
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input type="password" placeholder="请输入密码" />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
