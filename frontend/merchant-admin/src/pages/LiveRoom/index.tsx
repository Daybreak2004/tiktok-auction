import React from 'react'
import { Card, Table, Button, Space, Tag, Switch, message } from 'antd'
import { PlusOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons'

const LiveRoomManage: React.FC = () => {
  const mockRooms = []

  const columns = [
    {
      title: '直播间名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'living' ? 'green' : 'default'}>
          {status === 'living' ? '直播中' : '未开播'}
        </Tag>
      )
    },
    {
      title: '在线人数',
      dataIndex: 'onlineCount',
      key: 'onlineCount'
    },
    {
      title: '操作',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<PlayCircleOutlined />}>
            开始直播
          </Button>
          <Button type="link" size="small" danger icon={<PauseCircleOutlined />}>
            结束直播
          </Button>
        </Space>
      )
    }
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>直播间管理</h3>
        <Button type="primary" icon={<PlusOutlined />}>创建直播间</Button>
      </div>
      <Table
        columns={columns}
        dataSource={mockRooms}
        rowKey="id"
        pagination={{ total: 0 }}
      />
    </Card>
  )
}

export default LiveRoomManage
