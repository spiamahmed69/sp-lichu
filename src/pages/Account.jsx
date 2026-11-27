import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore, ADMIN_EMAIL, ORDER_STATUS_BN } from '../lib/store'
import { bn, taka } from '../data/products'
import { IconEye, IconEyeOff } from '../components/icons'

export default function Account() {
  const { user, login, register, logout, orders } = useStore()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [note, setNote] = useState('')

  if (user) {
    const myOrders = user.role === 'admin' ? orders : orders.filter((o) => o.customer.email === user.email)
    return (
      <div className="fade-in max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white border border-gray-100 shadow rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">আমার অ্যাকাউন্ট</h1>
          <p className="mt-2 text-gray-600">নাম: <b>{user.name}</b></p>
          <p className="text-gray-600">ইমেইল: {user.email}</p>
          {user.role === 'admin' && (
            <p className="mt-3 bg-red-50 border border-red-100 text-[#DF2D4D] font-semibold rounded-lg px-4 py-3 text-sm">
              আপনি অ্যাডমিন হিসেবে লগইন করেছেন। <Link to="/admin" className="underline font-bold">অ্যাডমিন প্যানেল খুলুন</Link>
            </p>
          )}
          <button onClick={logout} className="btn-outline-red px-5 py-2.5 text-sm mt-5">লগ আউট</button>

          <h2 className="text-lg font-bold mt-8 mb-3">আমার অর্ডার ({bn(myOrders.length)}টি)</h2>
          {myOrders.length === 0 ? (
            <p className="text-gray-500">এখনো কোনো অর্ডার নেই। <Link to="/shop" className="text-[#DF2D4D] font-bold">কেনাকাটা করুন</Link></p>
          ) : (
            <ul className="space-y-3">
              {myOrders.map((o) => (
                <li key={o.id} className="border border-gray-100 rounded-lg p-4 flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-bold">{o.id}</p>
                    <p className="text-sm text-gray-500">{o.items.map((i) => `${i.name} × ${bn(i.qty)}`).join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#DF2D4D]">{taka(o.total + o.deliveryCharge)}</p>
                    <p className="text-sm text-gray-500">{ORDER_STATUS_BN[o.status]}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  const submit = (e) => {
    e.preventDefault()
    setError('')
    setNote('')
    if (mode === 'login') {
      const r = login(email, password)
      if (!r.ok) setError(r.error)
      else if (r.user.role === 'admin') setNote('অ্যাডমিন হিসেবে লগইন হয়েছে।')
    } else {
      if (!name.trim()) return setError('আপনার নাম দিন।')
      if (password.length < 6) return setError('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।')
      const r = register(name, email, password)
      if (!r.ok) setError(r.error)
    }
    if (!remember) { /* demo: remember flag stored with session only */ }
  }

  return (
    <div className="fade-in max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl p-7 sm:p-8 border border-gray-100" style={{ boxShadow: '0 10px 40px rgba(34,197,94,.15)' }}>
        <h1 className="text-2xl font-bold text-center text-gray-900">{mode === 'login' ? 'লগ ইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}</h1>
        <p className="text-center text-sm text-gray-500 mt-1">ডেমো লগইন — তথ্য শুধু আপনার ব্রাউজারে সংরক্ষিত হয়।</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="label-dark" htmlFor="acc-name">আপনার নাম <span className="text-[#DF2D4D]">*</span></label>
              <input id="acc-name" className="input-mint" value={name} onChange={(e) => setName(e.target.value)} placeholder="আপনার নাম" required />
            </div>
          )}
          <div>
            <label className="label-dark" htmlFor="acc-email">ইমেইল <span className="text-[#DF2D4D]">*</span></label>
            <input id="acc-email" type="email" className="input-mint" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="আপনার ইমেইল" required />
          </div>
          <div>
            <label className="label-dark" htmlFor="acc-pass">পাসওয়ার্ড <span className="text-[#DF2D4D]">*</span></label>
            <div className="relative">
              <input id="acc-pass" type={showPw ? 'text' : 'password'} className="input-mint pr-11" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="পাসওয়ার্ড" required />
              <button type="button" onClick={() => setShowPw(!showPw)} aria-label="পাসওয়ার্ড দেখুন" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <IconEyeOff width={18} height={18} /> : <IconEye width={18} height={18} />}</button>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-[#DF2D4D] w-4 h-4" /> আমাকে মনে রাখুন
          </label>
          {error && <p className="text-sm font-semibold text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          {note && <p className="text-sm font-semibold text-green-700 bg-green-50 rounded-lg px-3 py-2">{note}</p>}
          <button type="submit" className="login-grad w-full py-3.5 rounded-full text-white font-bold tracking-wide hover:brightness-110">{mode === 'login' ? 'লগ ইন' : 'রেজিস্টার করুন'}</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          {mode === 'login' ? (<>পাসওয়ার্ড ভুলে গেছেন? <button onClick={() => setMode('register')} className="text-[#DF2D4D] font-bold">রেজিস্টার করুন</button></>) : (<>অ্যাকাউন্ট আছে? <button onClick={() => setMode('login')} className="text-[#DF2D4D] font-bold">লগ ইন করুন</button></>)}
        </p>
        <div className="mt-6 bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-500 leading-relaxed">
          ডেমো অ্যাডমিন: {ADMIN_EMAIL} / admin123 — লাইভে যাওয়ার আগে অবশ্যই বদলে নিন।
        </div>
      </div>
    </div>
  )
}
