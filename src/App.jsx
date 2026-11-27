import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { StoreProvider, useStore } from './lib/store'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Category from './pages/Category'
import ProductDetail from './pages/ProductDetail'
import TrackOrder from './pages/TrackOrder'
import Account from './pages/Account'
import About from './pages/About'
import Checkout from './pages/Checkout'
import Admin from './pages/Admin'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export function AppRoutes() {
  const { cartOpen, closeCart, openCart } = useStore()
  return (
    <>
      <ScrollToTop />
      <Header onCartOpen={openCart} />
      <main id="main" className="min-h-[60vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/my-account" element={<Account />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={closeCart} />
    </>
  )
}

function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-gray-900">পেজটি পাওয়া যায়নি</h1>
      <p className="text-gray-500 mt-2">আপনি যে পেজটি খুঁজছেন সেটি নেই বা সরিয়ে ফেলা হয়েছে।</p>
      <a href="/" className="btn-red px-5 py-2.5 text-sm mt-4 inline-flex">হোমে ফিরে যান</a>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </StoreProvider>
  )
}
