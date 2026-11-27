// SP Lichu — Admin Panel (demo, localStorage-backed).
// Data layer is plain collections in src/lib/store.jsx, so Firebase can
// replace localStorage later without redesigning this panel.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore, ORDER_STATUSES, ORDER_STATUS_BN, ADMIN_EMAIL } from '../lib/store'
import { CATEGORIES, bn, taka, IMAGES } from '../data/products'
import { IconGrid, IconBox, IconChart, IconSettings, IconEdit, IconTrash, IconEye, IconEyeOff } from '../components/icons'

function Stat({ label, value, sub }) {
  return (
    <div className="bg-white border border-gray-100 shadow rounded-xl p-5">
      <p className="text-sm text-gray-500 font-semibold">{label}</p>
      <p className="text-3xl font-bold mt-1" style={{ color: '#DF2D4D' }}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function Admin() {
  const { user, login, logout, products, orders, settings, updateSettings, addProduct, updateProduct, deleteProduct, resetProducts, updateOrderStatus } = useStore()
  const [tab, setTab] = useState('dashboard')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [newForm, setNewForm] = useState({ name: '', category: 'dinajpur-lichu', base: 500, stock: 'স্টকে আছে', desc: '', image: IMAGES[0] })

  const revenue = useMemo(() => orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.total + o.deliveryCharge, 0), [orders])
  const pending = orders.filter((o) => o.status === 'Pending').length

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  if (!user || user.role !== 'admin') {
    return (
      <div className="fade-in max-w-md mx-auto px-4 py-14">
        <div className="bg-white rounded-2xl p-7 sm:p-8 border border-gray-100" style={{ boxShadow: '0 10px 40px rgba(223,45,77,.12)' }}>
          <h1 className="text-2xl font-bold text-center text-gray-900">অ্যাডমিন লগইন</h1>
          <p className="text-center text-sm text-gray-500 mt-1">শুধু দোকানের অ্যাডমিনের জন্য। ডেমো লগইন — লাইভে যাওয়ার আগে পাসওয়ার্ড বদলে নিন।</p>
          {user && <p className="mt-4 text-sm text-center text-gray-600">আপনি <b>{user.name}</b> হিসেবে লগইন করেছেন (কাস্টমার)। অ্যাডমিন প্যানেল দেখতে অ্যাডমিন অ্যাকাউন্টে লগ ইন করুন।</p>}
          <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setError(''); const r = login(email, password); if (!r.ok) setError(r.error); else if (r.user.role !== 'admin') setError('এই অ্যাকাউন্ট অ্যাডমিন নয়।') }}>
            <div>
              <label className="label-dark" htmlFor="ad-email">ইমেইল <span className="text-[#DF2D4D]">*</span></label>
              <input id="ad-email" type="email" className="input-mint" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@splichu.com" required />
            </div>
            <div>
              <label className="label-dark" htmlFor="ad-pass">পাসওয়ার্ড <span className="text-[#DF2D4D]">*</span></label>
              <div className="relative">
                <input id="ad-pass" type={showPw ? 'text' : 'password'} className="input-mint pr-11" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="পাসওয়ার্ড" required />
                <button type="button" onClick={() => setShowPw(!showPw)} aria-label="পাসওয়ার্ড দেখুন" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <IconEyeOff width={18} height={18} /> : <IconEye width={18} height={18} />}</button>
              </div>
            </div>
            {error && <p className="text-sm font-semibold text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" className="login-grad w-full py-3.5 rounded-full text-white font-bold">অ্যাডমিন প্যানেলে ঢুকুন</button>
          </form>
          <p className="mt-5 text-xs text-center text-gray-400">ডেমো: {ADMIN_EMAIL} / admin123</p>
          <p className="text-center text-sm mt-2"><Link to="/my-account" className="text-[#DF2D4D] font-bold">কাস্টমার অ্যাকাউন্টে ফিরে যান</Link></p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: IconChart },
    { id: 'products', label: 'পণ্য', icon: IconBox },
    { id: 'orders', label: `অর্ডার (${bn(orders.length)})`, icon: IconGrid },
    { id: 'settings', label: 'সেটিংস', icon: IconSettings },
  ]

  const startEdit = (pr) => { setEditing(pr.id); setEditForm({ name: pr.name, category: pr.category, base: pr.variants[0].price, stock: pr.stock, desc: pr.desc }) }
  const saveEdit = (pr) => {
    const variants = pr.variants.map((v, i) => i === 0 ? { ...v, price: Number(editForm.base) || v.price } : { ...v, price: Math.round((Number(editForm.base) || v.price) * (i === 1 ? 1.95 : 4.7)) })
    updateProduct(pr.id, { name: editForm.name, category: editForm.category, stock: editForm.stock, desc: editForm.desc, variants })
    setEditing(null)
    flash('পণ্য আপডেট হয়েছে।')
  }
  const submitNew = (e) => {
    e.preventDefault()
    if (!newForm.name.trim()) return
    const base = Number(newForm.base) || 500
    addProduct({
      name: newForm.name.trim(), category: newForm.category, stock: newForm.stock, desc: newForm.desc || 'তাজা লিচু — বাগান থেকে সরাসরি সংগ্রহ করা।',
      image: newForm.image,
      variants: [
        { label: '১০০ পিস', pcs: 100, price: base },
        { label: '২০০ পিস', pcs: 200, price: Math.round(base * 1.95) },
        { label: '৫০০ পিস', pcs: 500, price: Math.round(base * 4.7) },
      ],
    })
    setNewForm({ name: '', category: 'dinajpur-lichu', base: 500, stock: 'স্টকে আছে', desc: '', image: IMAGES[0] })
    flash('নতুন পণ্য যোগ হয়েছে।')
  }

  return (
    <div className="fade-in max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">অ্যাডমিন প্যানেল</h1>
          <p className="text-gray-500 text-sm mt-1">স্বাগতম, {user.name} ({user.email}) — ডেমো ডেটা আপনার ব্রাউজারে সংরক্ষিত হয়।</p>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="btn-outline-red px-4 py-2 text-sm">দোকান দেখুন</Link>
          <button onClick={logout} className="btn-red px-4 py-2 text-sm">লগ আউট</button>
        </div>
      </div>

      {msg && <p className="mt-4 text-sm font-semibold text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-2.5">{msg}</p>}

      <div className="flex gap-2 mt-6 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap border ${tab === t.id ? 'text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-[#DF2D4D] hover:text-[#DF2D4D]'}`} style={tab === t.id ? { background: '#DF2D4D' } : {}}>
            <t.icon width={16} height={16} />{t.label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat label="মোট পণ্য" value={bn(products.length)} sub="সব ক্যাটাগরি মিলিয়ে" />
            <Stat label="মোট অর্ডার" value={bn(orders.length)} sub="এই ব্রাউজারে সংরক্ষিত" />
            <Stat label="মোট আয় (বাতিল ছাড়া)" value={taka(revenue)} sub="ডেলিভারি চার্জসহ" />
            <Stat label="অপেক্ষমাণ অর্ডার" value={bn(pending)} sub="নিশ্চিত করা বাকি" />
          </div>
          <div className="bg-white border border-gray-100 shadow rounded-xl p-6">
            <h2 className="font-bold text-lg mb-4">সাম্প্রতিক অর্ডার</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500">এখনো কোনো অর্ডার আসেনি। দোকান থেকে একটি টেস্ট অর্ডার করে দেখুন।</p>
            ) : (
              <ul className="space-y-3">
                {orders.slice(0, 5).map((o) => (
                  <li key={o.id} className="flex flex-wrap justify-between gap-2 border border-gray-100 rounded-lg px-4 py-3">
                    <span><b>{o.id}</b> — {o.customer.name} ({o.customer.phone})</span>
                    <span className="font-bold text-[#DF2D4D]">{taka(o.total + o.deliveryCharge)}</span>
                    <span className="text-sm text-gray-500">{ORDER_STATUS_BN[o.status]}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className="mt-6 space-y-6">
          <form onSubmit={submitNew} className="bg-white border border-gray-100 shadow rounded-xl p-6">
            <h2 className="font-bold text-lg mb-4">নতুন পণ্য যোগ করুন</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><label className="label-dark">পণ্যের নাম *</label><input className="input-plain" value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} placeholder="যেমন: দিনাজপুর লিচু — স্পেশাল" required /></div>
              <div><label className="label-dark">ক্যাটাগরি</label><select className="input-plain" value={newForm.category} onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}>{CATEGORIES.map((c) => (<option key={c.slug} value={c.slug}>{c.name}</option>))}</select></div>
              <div><label className="label-dark">দাম (১০০ পিস, ৳)</label><input type="number" min="1" className="input-plain" value={newForm.base} onChange={(e) => setNewForm({ ...newForm, base: e.target.value })} /></div>
              <div><label className="label-dark">স্টক</label><input className="input-plain" value={newForm.stock} onChange={(e) => setNewForm({ ...newForm, stock: e.target.value })} /></div>
              <div className="sm:col-span-2 lg:col-span-3"><label className="label-dark">বিবরণ</label><input className="input-plain" value={newForm.desc} onChange={(e) => setNewForm({ ...newForm, desc: e.target.value })} placeholder="সংক্ষিপ্ত বিবরণ" /></div>
              <div><label className="label-dark">ছবি</label><select className="input-plain" value={newForm.image} onChange={(e) => setNewForm({ ...newForm, image: e.target.value })}>{IMAGES.map((u, i) => (<option key={u} value={u}>ছবি {bn(i + 1)}</option>))}</select></div>
            </div>
            <button type="submit" className="btn-red px-5 py-2.5 text-sm mt-4">পণ্য যোগ করুন</button>
          </form>

          <div className="bg-white border border-gray-100 shadow rounded-xl p-6">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
              <h2 className="font-bold text-lg">সব পণ্য ({bn(products.length)}টি)</h2>
              <button onClick={() => { if (window.confirm('সব পণ্য আগের অবস্থায় ফেরাতে চান? আপনার যোগ/বদল করা সব মুছে যাবে।')) { resetProducts(); flash('পণ্যের তালিকা আগের অবস্থায় ফেরানো হয়েছে।') } }} className="text-sm text-gray-500 hover:text-red-600 font-semibold">সব রিসেট করুন</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead><tr className="text-left text-gray-500 border-b"><th className="py-2 pr-2">পণ্য</th><th className="py-2 pr-2">ক্যাটাগরি</th><th className="py-2 pr-2">দাম (১০০ পিস)</th><th className="py-2 pr-2">স্টক</th><th className="py-2">কাজ</th></tr></thead>
                <tbody>
                  {products.map((pr) => (
                    <tr key={pr.id} className="border-b border-gray-50 align-top">
                      {editing === pr.id ? (
                        <>
                          <td className="py-3 pr-2"><input className="input-plain" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /><input className="input-plain mt-2" value={editForm.desc} onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })} placeholder="বিবরণ" /></td>
                          <td className="py-3 pr-2"><select className="input-plain" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>{CATEGORIES.map((c) => (<option key={c.slug} value={c.slug}>{c.name}</option>))}</select></td>
                          <td className="py-3 pr-2"><input type="number" className="input-plain w-28" value={editForm.base} onChange={(e) => setEditForm({ ...editForm, base: e.target.value })} /></td>
                          <td className="py-3 pr-2"><input className="input-plain w-28" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} /></td>
                          <td className="py-3 whitespace-nowrap">
                            <button onClick={() => saveEdit(pr)} className="btn-red px-3 py-1.5 text-xs mr-2">সেভ</button>
                            <button onClick={() => setEditing(null)} className="text-sm text-gray-500">বাতিল</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 pr-2"><span className="flex items-center gap-2"><img src={pr.image} alt="" className="w-10 h-10 rounded object-cover" /><span className="font-semibold">{pr.name}</span></span></td>
                          <td className="py-3 pr-2">{CATEGORIES.find((c) => c.slug === pr.category)?.name || pr.category}</td>
                          <td className="py-3 pr-2 font-bold text-[#DF2D4D]">{taka(pr.variants[0].price)}</td>
                          <td className="py-3 pr-2">{pr.stock}</td>
                          <td className="py-3 whitespace-nowrap">
                            <button onClick={() => startEdit(pr)} aria-label="এডিট" className="text-[#DF2D4D] mr-3"><IconEdit width={17} height={17} /></button>
                            <button onClick={() => { if (window.confirm(`"${pr.name}" মুছে ফেলতে চান?`)) { deleteProduct(pr.id); flash('পণ্য মুছে ফেলা হয়েছে।') } }} aria-label="মুছুন" className="text-red-500"><IconTrash width={17} height={17} /></button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="mt-6 bg-white border border-gray-100 shadow rounded-xl p-6">
          <h2 className="font-bold text-lg mb-4">সব অর্ডার ({bn(orders.length)}টি)</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">এখনো কোনো অর্ডার আসেনি।</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((o) => (
                <li key={o.id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <p className="font-bold">{o.id} <span className="text-gray-400 font-normal">• {new Date(o.createdAt).toLocaleString('bn-BD')}</span></p>
                      <p className="text-sm text-gray-600">{o.customer.name} • {o.customer.phone} • {o.customer.address}, {o.customer.district}</p>
                      <p className="text-sm text-gray-600">{o.items.map((i) => `${i.name} (${i.variant}) × ${bn(i.qty)}`).join(', ')}</p>
                      <p className="text-sm text-gray-500">পেমেন্ট: {o.payment === 'cod' ? 'ক্যাশ অন ডেলিভারি' : o.payment === 'bkash' ? `বিকাশ (Trx: ${o.transactionId || '—'})` : `নগদ (Trx: ${o.transactionId || '—'})`}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#DF2D4D]">{taka(o.total + o.deliveryCharge)}</p>
                      <select value={o.status} onChange={(e) => { updateOrderStatus(o.id, e.target.value); flash(`${o.id} — স্ট্যাটাস "${ORDER_STATUS_BN[e.target.value]}" করা হয়েছে।`) }} className="input-plain mt-2 w-44 py-2 text-sm" aria-label="অর্ডার স্ট্যাটাস">
                        {ORDER_STATUSES.map((s) => (<option key={s} value={s}>{ORDER_STATUS_BN[s]}</option>))}
                      </select>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === 'settings' && (
        <div className="mt-6 bg-white border border-gray-100 shadow rounded-xl p-6 max-w-2xl">
          <h2 className="font-bold text-lg mb-1">দোকানের সেটিংস</h2>
          <p className="text-sm text-gray-500 mb-5">এখানে বসানো নম্বরগুলো শুধু আপনার ব্রাউজারে সংরক্ষিত হয়। আসল নম্বর বসানোর আগে যাচাই করে নিন — কোনো আসল নম্বর আগে থেকে বসানো নেই।</p>
          <SettingsForm settings={settings} onSave={(patch) => { updateSettings(patch); flash('সেটিংস সংরক্ষিত হয়েছে।') }} />
        </div>
      )}
    </div>
  )
}

function SettingsForm({ settings, onSave }) {
  const [f, setF] = useState(settings)
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...f, deliveryCharge: Number(f.deliveryCharge) || 0, freeDeliveryAbove: Number(f.freeDeliveryAbove) || 0 }) }} className="space-y-4">
      <div><label className="label-dark">দোকানের নাম</label><input className="input-plain" value={f.shopName} onChange={(e) => set('shopName', e.target.value)} /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label-dark">ডেলিভারি চার্জ (৳)</label><input type="number" min="0" className="input-plain" value={f.deliveryCharge} onChange={(e) => set('deliveryCharge', e.target.value)} /></div>
        <div><label className="label-dark">এত টাকার উপরে ডেলিভারি ফ্রি (৳)</label><input type="number" min="0" className="input-plain" value={f.freeDeliveryAbove} onChange={(e) => set('freeDeliveryAbove', e.target.value)} /></div>
      </div>
      <div><label className="label-dark">বিকাশ নম্বর (পেমেন্টের জন্য)</label><input className="input-plain" value={f.bkashNumber} onChange={(e) => set('bkashNumber', e.target.value)} placeholder="যেমন: 01XXXXXXXXX — এখনো বসানো হয়নি" /></div>
      <div><label className="label-dark">নগদ নম্বর (পেমেন্টের জন্য)</label><input className="input-plain" value={f.nagadNumber} onChange={(e) => set('nagadNumber', e.target.value)} placeholder="যেমন: 01XXXXXXXXX — এখনো বসানো হয়নি" /></div>
      <div><label className="label-dark">WhatsApp নম্বর (আন্তর্জাতিক ফরম্যাটে, যেমন 8801XXXXXXXXX)</label><input className="input-plain" value={f.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} placeholder="খালি থাকলে WhatsApp বোতাম দেখাবে না" /></div>
      <button type="submit" className="btn-red px-6 py-2.5 text-sm">সেটিংস সংরক্ষণ করুন</button>
    </form>
  )
}
