export interface MerchantUser {
  id: number
  username: string
  nickname: string
  avatar?: string
  role: 'merchant' | 'admin'
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userInfo: MerchantUser
}
