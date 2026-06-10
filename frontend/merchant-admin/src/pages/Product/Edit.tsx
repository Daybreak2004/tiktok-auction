import React, { useState } from 'react'
import { Card, Form, Input, InputNumber, Button, Steps, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { createProduct, updateProduct, getProductDetail } from '@/services/product'
import type { CreateProductDto } from '@/types/product'

const { Step } = Steps
const { TextArea } = Input

const ProductEdit: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const isEdit = !!id

  React.useEffect(() => {
    if (isEdit) {
      getProductDetail(parseInt(id!)).then(data => {
        form.setFieldsValue(data)
      })
    }
  }, [isEdit, id, form])

  const onFinish = async (values: CreateProductDto) => {
    setLoading(true)
    try {
      if (isEdit) {
        await updateProduct(parseInt(id!), values)
        message.success('商品更新成功')
      } else {
        await createProduct(values)
        message.success('商品创建成功')
      }
      navigate('/products')
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title={isEdit ? '编辑商品' : '创建商品'}>
      <Steps current={currentStep} style={{ marginBottom: 32 }}>
        <Step title="基础信息" />
        <Step title="竞拍规则" />
        <Step title="确认提交" />
      </Steps>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          startPrice: 0,
          minIncrement: 1,
          durationSeconds: 60,
          autoExtendSeconds: 10,
          extendThresholdSeconds: 5,
          images: []
        }}
      >
        {currentStep === 0 && (
          <>
            <Form.Item label="商品名称" name="name" rules={[{ required: true }]}>
              <Input placeholder="请输入商品名称" />
            </Form.Item>
            <Form.Item label="商品描述" name="description">
              <TextArea rows={4} placeholder="请输入商品描述" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={() => setCurrentStep(1)}>下一步</Button>
            </Form.Item>
          </>
        )}
        {currentStep === 1 && (
          <>
            <Form.Item label="起拍价（元）" name="startPrice" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="最小加价幅度（元）" name="minIncrement" rules={[{ required: true }]}>
              <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="封顶价（元，可选）" name="maxPrice">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="不填表示无封顶" />
            </Form.Item>
            <Form.Item label="竞拍时长（秒）" name="durationSeconds" rules={[{ required: true }]}>
              <InputNumber min={10} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="自动延时时长（秒）" name="autoExtendSeconds" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="延时触发阈值（秒）" name="extendThresholdSeconds" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Button style={{ marginRight: 8 }} onClick={() => setCurrentStep(0)}>上一步</Button>
            <Button type="primary" onClick={() => setCurrentStep(2)}>下一步</Button>
          </>
        )}
        {currentStep === 2 && (
          <>
            <div style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
              <p>确认商品信息和竞拍规则无误后，点击提交保存</p>
            </div>
            <Button style={{ marginRight: 8 }} onClick={() => setCurrentStep(1)}>上一步</Button>
            <Button type="primary" htmlType="submit" loading={loading}>提交保存</Button>
          </>
        )}
      </Form>
    </Card>
  )
}

export default ProductEdit
