import { io, Socket } from 'socket.io-client'
import { getToken } from '@/utils/auth'

let socket: Socket | null = null

export const initSocket = () => {
  if (socket?.connected) return socket

  const wsUrl = import.meta.env.VITE_WS_URL || window.location.origin
  socket = io(wsUrl, {
    transports: ['websocket', 'polling'],
    auth: {
      token: getToken()
    }
  })

  socket.on('connect', () => {
    console.log('WebSocket connected')
  })

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected')
  })

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
