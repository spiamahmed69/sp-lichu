import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { bn, taka } from '../data/products'
import { IconCheck } from '../components/icons'

export default function Checkout() {
  const { cart, cartTotal, user, settings, placeOrder, clearCart } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: user?.name || '', phone: '', email: user?.email || '', address: '', district: '' })
  const [payment, setPayment] = useState('cod')
  const [txn, setTxn] = useState('')
  const [placed, setPlaced] = useState(null)
  const [error, setError] = useState('')

  const delivery = cartTotal >= settings.freeDeliveryAbove || cartTotal === 0 ? 0 : settings.deliveryCharge

  if (placed) {
    return (
      <div className="fade-in max-w-xl mx-auto px-4 py-16 text-center">
        <span className="w-16 h-16 rounded-full bg-green-100 text-green-600 inline-flex items-center justify-center"><IconCheck width={32} height={32} /></span>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">অর্ডার সম্পন্ন হয়েছে!</h1>
        <p className="text-gray-600 mt-2">আপনার অর্ডার আইডি</p>
        <p className="text-3xl font-bold mt-1" style={{ color: '#DF2D4D' }}>{placed.id}</p>
        <p className="text-gray-600 mt-3">মোট {taka(placed.total + placed.deliveryCharge)} — {payment === 'cod' ? 'ক্যাশ অন ডেলিভারি' : 'মোবাইল ব্যাংকিং (ম্যানুয়াল যাচাই)'}। অর্ডার আইডিটি সংরক্ষণ করে রাখুন।</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/track-order" className="btn-red px-5 py-2.5 text-sm">অর্ডার ট্র্যাক করুন</Link>
          <Link to="/shop" className="btn-outline-red px-5 py-2.5 text-sm">আরও কেনাকাটা করুন</Link>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">কার্ট খালি</h1>
        <p className="text-gray-500 mt-2">চেকআউট করতে প্রথমে কার্টে কিছু যোগ করুন।</p>
        <Link to="/shop" className="btn-red px-5 py-2.5 text-sm mt-4 inline-flex">কেনাকাটা করুন</Link>
      </div>
    )
  }

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.district.trim()) {
      return setError('নাম, মোবাইল, ঠিকানা ও জেলা — সবগুলো ঘর পূরণ করুন।')
    }
    if (payment !== 'cod' && !txn.trim()) {
      return setError('বিকাশ/নগদে পাঠানো টাকার ট্রানজাকশন আইডি দিন।')
    }
    const order = placeOrder({
      customer: { ...form, email: form.email || user?.email || '' },
      items: cart, total: cartTotal, deliveryCharge: delivery, payment, transactionId: txn,
    })
    setPlaced(order)
    window.scrollTo(0, 0)
  }
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="fade-in max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">চেকআউট</h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-6 mt-6 items-start">
        <form onSubmit={submit} className="bg-white border border-gray-100 shadow rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-lg">ডেলিভারির তথ্য</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label-dark" htmlFor="co-name">আপনার নাম *</label><input id="co-name" className="input-plain" value={form.name} onChange={(e) => set('name', e.target.value)} required /></div>
            <div><label className="label-dark" htmlFor="co-phone">মোবাইল নম্বর *</label><input id="co-phone" className="input-plain" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="01XXXXXXXXX" required /></div>
            <div><label className="label-dark" htmlFor="co-email">ইমেইল (ঐচ্ছিক)</label><input id="co-email" type="email" className="input-plain" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
            <div><label className="label-dark" htmlFor="co-district">জেলা *</label><input id="co-district" className="input-plain" value={form.district} onChange={(e) => set('district', e.target.value)} placeholder="যেমন: ঢাকা" required /></div>
            <div className="sm:col-span-2"><label className="label-dark" htmlFor="co-address">সম্পূর্ণ ঠিকানা *</label><textarea id="co-address" rows={3} className="input-plain" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="বাড়ি/হোল্ডিং, রোড, এলাকা" required /></div>
          </div>

          <h2 className="font-bold text-lg pt-2">পেমেন্ট মাধ্যম</h2>
          <div className="space-y-2.5">
            {[
              { id: 'cod', label: 'ক্যাশ অন ডেলিভারি (COD)', hint: 'পণ্য হাতে পেয়ে টাকা দিন' },
              { id: 'bkash', label: 'বিকাশ (ম্যানুয়াল)', hint: settings.bkashNumber ? `পাঠান: ${settings.bkashNumber}` : 'বিকাশ নম্বর এখনো বসানো হয়নি — অর্ডারের পর জানানো হবে' },
              { id: 'nagad', label: 'নগদ (ম্যানুয়াল)', hint: settings.nagadNumber ? `পাঠান: ${settings.nagadNumber}` : 'নগদ নম্বর এখনো বসানো হয়নি — অর্ডারের পর জানানো হবে' },
            ].map((m) => (
              <label key={m.id} className={`flex items-start gap-3 border rounded-lg px-4 py-3 cursor-pointer ${payment === m.id ? 'border-[#DF2D4D] bg-[#fdf2f4]' : 'border-gray-200'}`}>
                <input type="radio" name="payment" checked={payment === m.id} onChange={() => setPayment(m.id)} className="accent-[#DF2D4D] mt-1 w-4 h-4" />
                <span><span className="block font-bold text-sm">{m.label}</span><span className="block text-xs text-gray-500 mt-0.5">{m.hint}</span></span>
              </label>
            ))}
          </div>
          {payment !== 'cod' && (
            <div>
              <label className="label-dark" htmlFor="co-txn">ট্রানজাকশন আইডি *</label>
              <input id="co-txn" className="input-plain" value={txn} onChange={(e) => setTxn(e.target.value)} placeholder="যেমন: 9HX7..." required />
              <p className="text-xs text-gray-400 mt-1.5">টাকা পাঠানোর পর প্রাপ্ত ট্রানজাকশন আইডিটি দিন। পেমেন্ট ম্যানুয়ালি যাচাই করে অর্ডার নিশ্চিত করা হবে।</p>
            </div>
          )}
          {error && <p className="text-sm font-semibold text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" className="btn-red w-full py-3.5 text-base">অর্ডার করুন — {taka(cartTotal + delivery)}</button>
          <button type="button" onClick={() => { clearCart(); navigate('/shop') }} className="text-sm text-gray-400 hover:text-red-600 w-full text-center">কার্ট খালি করে ফিরে যান</button>
        </form>

        <aside className="bg-white border border-gray-100 shadow rounded-xl p-6 lg:sticky lg:top-6">
          <h2 className="font-bold text-lg">অর্ডার সারাংশ</h2>
          <ul className="mt-4 space-y-3">
            {cart.map((it) => (
              <li key={it.key} className="flex gap-3 items-center">
                <img src={it.image} alt={it.name} className="w-12 h-12 rounded-md object-cover" />
                <span className="flex-1 text-sm"><span className="block font-semibold text-gray-900 leading-snug">{it.name}</span><span className="text-gray-500">{it.variant} × {bn(it.qty)}</span></span>
                <span className="font-bold text-sm">{taka(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-100 mt-4 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600"><span>সাবটোটাল</span><span>{taka(cartTotal)}</span></div>
            <div className="flex justify-between text-gray-600"><span>ডেলিভারি চার্জ</span><span>{delivery === 0 ? 'ফ্রি' : taka(delivery)}</span></div>
            <div className="flex justify-between font-bold text-base pt-1"><span>মোট</span><span className="text-[#DF2D4D]">{taka(cartTotal + delivery)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  )
}
