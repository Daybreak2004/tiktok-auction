export interface User {
  id: number
  username: string
  nickname: string
  avatar?: string
  phone?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userInfo: User
}
