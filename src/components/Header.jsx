import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useStore } from '../lib/store'
import { CATEGORIES } from '../data/products'
import { IconCart, IconUser, IconMenu, IconX } from './icons'

export default function Header({ onCartOpen }) {
  const { cartCount, settings } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <>
      <a href="#main" className="sr-only">মূল কনটেন্টে যান</a>
      {/* Top red utility bar — no fake phone number; delivery promise instead */}
      <div className="w-full text-white text-center text-[13px] sm:text-sm font-medium py-2 px-3" style={{ background: '#DF2D4D' }}>
        সারাদেশে হোম ডেলিভারি &nbsp;•&nbsp; তাজা লিচু, সরাসরি বাগান থেকে
      </div>
      {/* White header — NOT sticky, as in the reference */}
      <header className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3 h-[72px]">
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="SP Lichu — হোম">
            <span className="w-10 h-10 rounded-full text-white flex items-center justify-center text-xl font-bold" style={{ background: '#DF2D4D' }}>লি</span>
            <span className="leading-tight">
              <span className="block text-[22px] font-bold" style={{ color: '#DF2D4D' }}>{settings.shopName}</span>
              <span className="block text-[11px] text-gray-500 font-medium -mt-1">তাজা লিচুর দোকান</span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-7 text-[15px] font-semibold text-gray-800" aria-label="ক্যাটাগরি">
            {CATEGORIES.map((c) => (
              <NavLink key={c.slug} to={`/category/${c.slug}`} className={({ isActive }) => (isActive ? 'text-[#DF2D4D]' : 'hover:text-[#DF2D4D]')}>
                {c.name}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={onCartOpen} aria-label="কার্ট খুলুন" className="relative w-10 h-10 rounded-full text-white flex items-center justify-center hover:brightness-110" style={{ background: '#DF2D4D' }}>
              <IconCart />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-gray-900 text-white text-[11px] font-bold flex items-center justify-center">{cartCount}</span>
              )}
            </button>
            <Link to="/my-account" aria-label="আমার অ্যাকাউন্ট" className="w-10 h-10 rounded-full text-white hidden sm:flex items-center justify-center hover:brightness-110" style={{ background: '#DF2D4D' }}>
              <IconUser />
            </Link>
            <Link to="/track-order" className="btn-red hidden md:inline-flex px-4 py-2.5 text-sm">অর্ডার ট্র্যাক করুন</Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="মেনু" className="lg:hidden w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700">
              {mobileOpen ? <IconX /> : <IconMenu />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="lg:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-1 bg-white" aria-label="মোবাইল মেনু">
            {CATEGORIES.map((c) => (
              <NavLink key={c.slug} to={`/category/${c.slug}`} onClick={() => setMobileOpen(false)} className="py-2.5 px-2 font-semibold text-gray-800 border-b border-gray-50 hover:text-[#DF2D4D]">
                {c.name}
              </NavLink>
            ))}
            <Link to="/shop" onClick={() => setMobileOpen(false)} className="py-2.5 px-2 font-semibold text-[#DF2D4D]">সব লিচু দেখুন</Link>
            <Link to="/track-order" onClick={() => setMobileOpen(false)} className="py-2.5 px-2 font-semibold text-gray-800">অর্ডার ট্র্যাক করুন</Link>
            <Link to="/my-account" onClick={() => setMobileOpen(false)} className="py-2.5 px-2 font-semibold text-gray-800">আমার অ্যাকাউন্ট</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="py-2.5 px-2 font-semibold text-gray-800">আমাদের সম্পর্কে</Link>
          </nav>
        )}
      </header>
    </>
  )
}
