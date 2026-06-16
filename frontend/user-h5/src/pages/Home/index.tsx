import React, { useEffect } from 'react'
import { Card, Grid, Image, Tag } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { useProductStore } from '@/store/useProductStore'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { productList, fetchProducts } = useProductStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 16 }}>热门竞拍</h2>
      <Grid columns={2} gap={12}>
        {productList.map((product) => (
          <Grid.Item key={product.id} onClick={() => navigate(`/auction/${product.id}`)}>
            <Card style={{ cursor: 'pointer' }}>
              <div style={{ position: 'relative' }}>
                <Image
                  src={'https://via.placeholder.com/300'}
                  alt={product.name}
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                />
                <Tag color="danger" style={{ position: 'absolute', top: 8, left: 8 }}>
                  竞拍中
                </Tag>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
                  {product.name}
                </div>
                <div style={{ fontSize: 18, color: '#ff4d4f', fontWeight: 'bold' }}>
                  ¥{product.startPrice.toFixed(2)}
                </div>
              </div>
            </Card>
          </Grid.Item>
        ))}
      </Grid>
    </div>
  )
}

export default Home
