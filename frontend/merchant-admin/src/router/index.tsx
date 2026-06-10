import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '@/components/Layout/MainLayout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import ProductList from '@/pages/Product/List'
import ProductEdit from '@/pages/Product/Edit'
import OrderList from '@/pages/Order/List'
import OrderDetail from '@/pages/Order/Detail'
import AuctionMonitor from '@/pages/Auction/Monitor'
import LiveRoomManage from '@/pages/LiveRoom'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = !!localStorage.getItem('merchant_token')
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'products',
        element: <ProductList />
      },
      {
        path: 'products/create',
        element: <ProductEdit />
      },
      {
        path: 'products/edit/:id',
        element: <ProductEdit />
      },
      {
        path: 'auction/:id',
        element: <AuctionMonitor />
      },
      {
        path: 'orders',
        element: <OrderList />
      },
      {
        path: 'orders/:id',
        element: <OrderDetail />
      },
      {
        path: 'live-rooms',
        element: <LiveRoomManage />
      }
    ]
  }
])

export default router
