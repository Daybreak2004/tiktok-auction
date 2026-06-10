import request from '@/utils/request'
import type { LoginRequest, LoginResponse, MerchantUser } from '@/types/auth'

export const login = (data: LoginRequest) => {
  return request.post<LoginResponse>('/merchant/auth/login', data)
}

export const getProfile = () => {
  return request.get<MerchantUser>('/merchant/auth/profile')
}
