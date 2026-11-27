// SP Lichu — local store (localStorage-backed).
// Structure is deliberately Firebase-ready: products / orders / settings are
// plain collections with id keys, so swapping the storage layer later does
// not change the panel or shop components.
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { SEED_PRODUCTS } from '../data/products'

const LS = {
  cart: 'sp-lichu-cart',
  user: 'sp-lichu-user',
  users: 'sp-lichu-users',
  orders: 'sp-lichu-orders',
  products: 'sp-lichu-products',
  settings: 'sp-lichu-settings',
}

function load(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
function save(key, value) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch { /* storage full / private mode — ignore */ }
}

export const DEFAULT_SETTINGS = {
  shopName: 'SP Lichu',
  deliveryCharge: 60,
  freeDeliveryAbove: 2000,
  bkashNumber: '',
  nagadNumber: '',
  whatsappNumber: '',
}

export const ADMIN_EMAIL = 'admin@splichu.com'
export const ADMIN_PASSWORD = 'admin123' // DEMO ONLY — change before live use

const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load(LS.cart, []))
  const [user, setUser] = useState(() => load(LS.user, null))
  const [orders, setOrders] = useState(() => load(LS.orders, []))
  const [productOverrides, setProductOverrides] = useState(() => load(LS.products, null))
  const [settings, setSettings] = useState(() => load(LS.settings, DEFAULT_SETTINGS))
  const [cartOpen, setCartOpen] = useState(false)
  const openCart = () => setCartOpen(true)
  const closeCart = () => setCartOpen(false)

  useEffect(() => save(LS.cart, cart), [cart])
  useEffect(() => save(LS.user, user), [user])
  useEffect(() => save(LS.orders, orders), [orders])
  useEffect(() => { if (productOverrides) save(LS.products, productOverrides) }, [productOverrides])
  useEffect(() => save(LS.settings, settings), [settings])

  // Products: seed data, overridden by admin edits in localStorage.
  const products = useMemo(() => {
    if (!productOverrides) return SEED_PRODUCTS
    const map = new Map(productOverrides.map((pr) => [pr.id, pr]))
    const merged = SEED_PRODUCTS.map((pr) => map.get(pr.id) || pr)
    const added = productOverrides.filter((pr) => !SEED_PRODUCTS.some((s) => s.id === pr.id))
    return [...merged, ...added].filter((pr) => !pr._deleted)
  }, [productOverrides])

  const persistProducts = (next) => setProductOverrides(next)

  const addProduct = (data) => {
    const nextId = Math.max(0, ...products.map((pr) => pr.id)) + 1
    const slug = (data.slug || data.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + nextId
    const fresh = { ...data, id: nextId, slug, rating: 5.0, views: 0, stock: data.stock || 'স্টকে আছে' }
    const base = productOverrides || SEED_PRODUCTS
    persistProducts([...base.filter((pr) => pr.id !== nextId), fresh])
    return fresh
  }
  const updateProduct = (id, patch) => {
    const base = productOverrides || SEED_PRODUCTS
    persistProducts(base.map((pr) => (pr.id === id ? { ...pr, ...patch } : pr)))
  }
  const deleteProduct = (id) => {
    const base = productOverrides || SEED_PRODUCTS
    // Mark seed products deleted; drop admin-added ones entirely.
    if (SEED_PRODUCTS.some((s) => s.id === id)) {
      persistProducts(base.map((pr) => (pr.id === id ? { ...pr, _deleted: true } : pr)))
    } else {
      persistProducts(base.filter((pr) => pr.id !== id))
    }
  }
  const resetProducts = () => {
    setProductOverrides(null)
    if (typeof window !== 'undefined') window.localStorage.removeItem(LS.products)
  }

  const addToCart = (product, variant, qty = 1) => {
    setCart((prev) => {
      const key = `${product.id}:${variant.label}`
      const found = prev.find((i) => i.key === key)
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      return [...prev, { key, productId: product.id, name: product.name, image: product.image, variant: variant.label, price: variant.price, qty }]
    })
  }
  const updateQty = (key, qty) => {
    setCart((prev) => (qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i))))
  }
  const removeFromCart = (key) => setCart((prev) => prev.filter((i) => i.key !== key))
  const clearCart = () => setCart([])

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  // --- Auth (demo, local only) ---
  const login = (email, password) => {
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const admin = { name: 'অ্যাডমিন', email: ADMIN_EMAIL, role: 'admin' }
      setUser(admin)
      return { ok: true, user: admin }
    }
    const users = load(LS.users, [])
    const found = users.find((u) => u.email === email.trim().toLowerCase() && u.password === password)
    if (!found) return { ok: false, error: 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।' }
    const u = { name: found.name, email: found.email, role: 'customer' }
    setUser(u)
    return { ok: true, user: u }
  }
  const register = (name, email, password) => {
    const users = load(LS.users, [])
    const em = email.trim().toLowerCase()
    if (users.some((u) => u.email === em)) return { ok: false, error: 'এই ইমেইলে already অ্যাকাউন্ট আছে।' }
    users.push({ name, email: em, password })
    save(LS.users, users)
    const u = { name, email: em, role: 'customer' }
    setUser(u)
    return { ok: true, user: u }
  }
  const logout = () => setUser(null)

  // --- Orders (local only; Firebase can replace this later) ---
  const placeOrder = ({ customer, items, total, deliveryCharge, payment, transactionId }) => {
    const id = `SP-${Math.floor(100000 + Math.random() * 900000)}`
    const order = {
      id, customer, items, total, deliveryCharge, payment, transactionId: transactionId || '',
      status: 'Pending', createdAt: new Date().toISOString(),
    }
    setOrders((prev) => [order, ...prev])
    clearCart()
    return order
  }
  const updateOrderStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }
  const findOrder = (id, phone) => {
    const norm = (s) => String(s || '').replace(/[^0-9]/g, '').slice(-11)
    return orders.find((o) => o.id.toUpperCase() === String(id).trim().toUpperCase() && norm(o.customer.phone) === norm(phone))
  }

  const updateSettings = (patch) => setSettings((prev) => ({ ...prev, ...patch }))

  const value = {
    cart, cartCount, cartTotal, addToCart, updateQty, removeFromCart, clearCart,
    cartOpen, openCart, closeCart, onCartOpen: openCart,
    user, login, register, logout,
    orders, placeOrder, updateOrderStatus, findOrder,
    products, addProduct, updateProduct, deleteProduct, resetProducts,
    settings, updateSettings,
  }
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']
export const ORDER_STATUS_BN = {
  Pending: 'অপেক্ষমাণ',
  Confirmed: 'নিশ্চিত হয়েছে',
  Shipped: 'পাঠানো হয়েছে',
  Delivered: 'ডেলিভারি সম্পন্ন',
  Cancelled: 'বাতিল',
}
