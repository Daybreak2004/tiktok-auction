import { create } from 'zustand'
import { getToken, setToken, removeToken, isAuthenticated } from '@/utils/auth'
import { login, getProfile } from '@/services/auth'

interface AuthState {
  token: string | null
  user: any
  isLoggedIn: boolean
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  fetchProfile: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set: any, get: any) => ({
  token: getToken(),
  user: null,
  isLoggedIn: isAuthenticated(),
  loading: false,

  login: async (username: string, password: string) => {
    set({ loading: true })
    try {
      const res: any = await login({ username, password })
      setToken(res.token)
      set({
        token: res.token,
        user: res.userInfo,
        isLoggedIn: true,
        loading: false
      })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  fetchProfile: async () => {
    try {
      const userInfo: any = await getProfile()
      set({ user: userInfo })
    } catch (error) {
      get().logout()
    }
  },

  logout: () => {
    removeToken()
    set({
      token: null,
      user: null,
      isLoggedIn: false
    })
  }
}))
