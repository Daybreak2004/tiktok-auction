import request from '@/utils/request'
import type { LoginRequest, LoginResponse, User } from '@/types/user'

export const login = (data: LoginRequest) => {
  return request.post<LoginResponse>('/user/auth/login', data)
}

export const getProfile = () => {
  return request.get<User>('/user/auth/profile')
}
