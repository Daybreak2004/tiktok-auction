import React, { useEffect } from 'react'
import { Table, Button, Space, Tag, Card, Input, Select, message } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, PlayCircleOutlined, StopOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useProductStore } from '@/store/useProductStore'
import type { Product, ProductStatus } from '@/types/product'
import { getProductList, startAuction, cancelAuction } from '@/services/product'

const { Search } = Input
const { Option } = Select

const ProductList: React.FC = () => {
  const navigate = useNavigate()
  const { productList, loading, total, fetchProducts } = useProductStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const getStatusColor = (status: ProductStatus) => {
    const colorMap: Record<ProductStatus, string> = {
      pending: 'default',
      auctioning: 'processing',
      ended: 'success',
      cancelled: 'error'
    }
    return colorMap[status]
  }

  const getStatusText = (status: ProductStatus) => {
    const textMap: Record<ProductStatus, string> = {
      pending: '待开始',
      auctioning: '竞拍中',
      ended: '已结束',
      cancelled: '已取消'
    }
    return textMap[status]
  }

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: ProductStatus) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      )
    },
    {
      title: '起拍价',
      dataIndex: 'startPrice',
      key: 'startPrice',
      render: (val: number) => `¥${val.toFixed(2)}`
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: Product) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/auction/${record.id}`)}>
            监控
          </Button>
          {record.status === 'pending' && (
            <>
              <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate(`/products/edit/${record.id}`)}>
                编辑
              </Button>
              <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => handleStart(record.id)}>
                开始竞拍
              </Button>
            </>
          )}
          {record.status === 'auctioning' && (
            <Button type="link" size="small" danger icon={<StopOutlined />} onClick={() => handleCancel(record.id)}>
              取消竞拍
            </Button>
          )}
        </Space>
      )
    }
  ]

  const handleStart = async (id: number) => {
    try {
      await startAuction(id)
      message.success('竞拍已开始')
      fetchProducts()
    } catch (error) {
      console.error(error)
    }
  }

  const handleCancel = async (id: number) => {
    try {
      await cancelAuction(id)
      message.success('竞拍已取消')
      fetchProducts()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Search placeholder="搜索商品名称" style={{ width: 250 }} />
          <Select placeholder="筛选状态" style={{ width: 150 }}>
            <Option value="">全部状态</Option>
            <Option value="pending">待开始</Option>
            <Option value="auctioning">竞拍中</Option>
            <Option value="ended">已结束</Option>
          </Select>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/products/create')}>
          创建商品
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={productList}
        rowKey="id"
        loading={loading}
        pagination={{ total }}
      />
    </Card>
  )
}

export default ProductList
