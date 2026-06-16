import { create } from 'zustand'
import { getProductList } from '@/services/product'

interface ProductState {
  productList: any[]
  currentProduct: any | null
  loading: boolean
  total: number
  fetchProducts: (params?: any) => Promise<void>
  setCurrentProduct: (product: any | null) => void
}

export const useProductStore = create<ProductState>((set: any) => ({
  productList: [],
  currentProduct: null,
  bidHistory: [],
  loading: false,
  total: 0,

  fetchProducts: async (params) => {
    set({ loading: true })
    try {
      const res: any = await getProductList(params)
      set({
        productList: res.list,
        total: res.total,
        loading: false
      })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  setCurrentProduct: (product) => {
    set({ currentProduct: product })
  }
}))
