import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import TabBarLayout from '@/components/Layout/TabBarLayout'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import LiveRoom from '@/pages/LiveRoom'
import AuctionDetail from '@/pages/AuctionDetail'
import My from '@/pages/My'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = !!localStorage.getItem('user_token')
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
        <TabBarLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />
      },
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'live-room',
        element: <LiveRoom />
      },
      {
        path: 'my',
        element: <My />
      }
    ]
  },
  {
    path: '/auction/:id',
    element: (
      <ProtectedRoute>
        <AuctionDetail />
      </ProtectedRoute>
    )
  }
])

export default router
