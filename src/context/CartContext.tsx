'use client'

import { createContext, useContext, useEffect, useReducer } from 'react'
import type { CartItem, Product } from '@/types'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD'; product: Product; qty: number }
  | { type: 'REMOVE'; productId: number }
  | { type: 'SET_QTY'; productId: number; qty: number }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; items: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.product.id === action.product.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, qty: Math.min(i.product.stock_qty, i.qty + action.qty) }
              : i
          ),
        }
      }
      return { items: [...state.items, { product: action.product, qty: action.qty }] }
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.product.id !== action.productId) }
    case 'SET_QTY':
      if (action.qty <= 0) {
        return { items: state.items.filter((i) => i.product.id !== action.productId) }
      }
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, qty: Math.min(i.product.stock_qty, action.qty) }
            : i
        ),
      }
    case 'CLEAR':
      return { items: [] }
    case 'HYDRATE':
      return { items: action.items }
    default:
      return state
  }
}

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (product: Product, qty?: number) => void
  removeItem: (productId: number) => void
  setQty: (productId: number, qty: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'ccrauto_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const items = JSON.parse(raw) as CartItem[]
        dispatch({ type: 'HYDRATE', items })
      }
    } catch {}
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {}
  }, [state.items])

  const itemCount = state.items.reduce((s, i) => s + i.qty, 0)
  const subtotal = state.items.reduce((s, i) => s + i.product.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        itemCount,
        subtotal,
        addItem: (product, qty = 1) => dispatch({ type: 'ADD', product, qty }),
        removeItem: (productId) => dispatch({ type: 'REMOVE', productId }),
        setQty: (productId, qty) => dispatch({ type: 'SET_QTY', productId, qty }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
