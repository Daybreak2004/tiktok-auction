import { create } from 'zustand'
import type { Product, BidRecord } from '@/types/product'
import { getProductList } from '@/services/product'

interface ProductState {
  productList: Product[]
  currentProduct: Product | null
  bidHistory: BidRecord[]
  loading: boolean
  total: number
  fetchProducts: (params?: any) => Promise<void>
  setCurrentProduct: (product: Product | null) => void
  setBidHistory: (records: BidRecord[]) => void
}

export const useProductStore = create<ProductState>((set) => ({
  productList: [],
  currentProduct: null,
  bidHistory: [],
  loading: false,
  total: 0,

  fetchProducts: async (params) => {
    set({ loading: true })
    try {
      const res = await getProductList(params)
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
  },

  setBidHistory: (records) => {
    set({ bidHistory: records })
  }
}))
