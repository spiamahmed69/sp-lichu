import { useState } from 'react'
import { useStore, ORDER_STATUS_BN } from '../lib/store'
import { taka, bn } from '../data/products'

const STEPS = ['Pending', 'Confirmed', 'Shipped', 'Delivered']

export default function TrackOrder() {
  const { findOrder } = useStore()
  const [orderId, setOrderId] = useState('')
  const [phone, setPhone] = useState('')
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const found = findOrder(orderId, phone)
    setResult(found || null)
    setSearched(true)
  }

  return (
    <div className="fade-in max-w-3xl mx-auto px-4 py-10">
      <div className="hero-grad rounded-xl px-6 py-10 sm:px-10 text-white text-center relative overflow-hidden">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/85">ট্র্যাক ইয়োর অর্ডার</p>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2">আপনার অর্ডার কোথায় আছে?</h1>
        <span className="inline-block mt-4 text-xs font-bold border border-white/70 rounded-full px-3 py-1">লাইভ স্ট্যাটাস</span>
      </div>

      <form onSubmit={submit} className="bg-white border border-gray-100 shadow-lg rounded-xl -mt-4 relative px-6 py-7 sm:px-8">
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          <div>
            <label className="label-red" htmlFor="oid">অর্ডার আইডি</label>
            <input id="oid" className="input-mint" placeholder="যেমন: SP-123456" value={orderId} onChange={(e) => setOrderId(e.target.value)} required />
          </div>
          <div>
            <label className="label-red" htmlFor="phone">মোবাইল নম্বর</label>
            <input id="phone" className="input-mint" placeholder="যেমন: 01XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <button type="submit" className="btn-red px-6 py-3 text-sm whitespace-nowrap">অর্ডার দেখুন</button>
        </div>
        <p className="text-xs text-gray-400 mt-3">অর্ডার করার পর যে অর্ডার আইডি পেয়েছেন, সেটি আর অর্ডারের সময় দেওয়া মোবাইল নম্বরটি দিন।</p>
      </form>

      {searched && !result && (
        <p className="mt-6 text-center text-red-600 font-semibold bg-red-50 border border-red-100 rounded-lg py-3 px-4">এই অর্ডার আইডি ও মোবাইল নম্বরের কোনো অর্ডার পাওয়া যায়নি। নম্বরটি ঠিক আছে কি না দেখে আবার চেষ্টা করুন।</p>
      )}

      {result && (
        <div className="mt-6 bg-white border border-gray-100 shadow rounded-xl p-6">
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <p className="text-sm text-gray-500">অর্ডার আইডি</p>
              <p className="font-bold text-lg">{result.id}</p>
            </div>
            <span className="px-3 py-1.5 rounded-full text-sm font-bold text-white self-start" style={{ background: '#DF2D4D' }}>{ORDER_STATUS_BN[result.status]}</span>
          </div>
          <div className="mt-6 flex items-center">
            {STEPS.map((s, i) => {
              const done = STEPS.indexOf(result.status) >= i && result.status !== 'Cancelled'
              const current = STEPS.indexOf(result.status) === i
              return (
                <div key={s} className="flex-1 flex flex-col items-center relative">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${done ? 'text-white' : 'bg-gray-100 text-gray-400'}`} style={done ? { background: '#DF2D4D' } : {}}>{done ? '✓' : bn(i + 1)}</span>
                  <span className={`text-[11px] sm:text-xs mt-1.5 text-center font-semibold ${current ? 'text-[#DF2D4D]' : 'text-gray-500'}`}>{ORDER_STATUS_BN[s]}</span>
                  {i < STEPS.length - 1 && <span className={`absolute top-4 left-1/2 w-full h-0.5 ${STEPS.indexOf(result.status) > i ? 'bg-[#DF2D4D]' : 'bg-gray-200'}`} />}
                </div>
              )
            })}
          </div>
          {result.status === 'Cancelled' && <p className="mt-4 text-center font-semibold text-red-600">এই অর্ডারটি বাতিল করা হয়েছে।</p>}
          <div className="mt-6 border-t border-gray-100 pt-4 space-y-1.5 text-sm">
            {result.items.map((it) => (
              <div key={it.key} className="flex justify-between text-gray-700"><span>{it.name} ({it.variant}) × {bn(it.qty)}</span><span>{taka(it.price * it.qty)}</span></div>
            ))}
            <div className="flex justify-between font-bold text-base pt-2"><span>মোট (ডেলিভারিসহ)</span><span className="text-[#DF2D4D]">{taka(result.total + result.deliveryCharge)}</span></div>
            <p className="text-gray-500">নাম: {result.customer.name} • ঠিকানা: {result.customer.address}, {result.customer.district}</p>
          </div>
        </div>
      )}
    </div>
  )
}
