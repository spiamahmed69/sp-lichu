import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { productBySlug, bn, taka, categoryBySlug } from '../data/products'
import ProductCard, { ProductImage, Stars } from '../components/ProductCard'
import { IconPlus, IconMinus, IconWhatsApp } from '../components/icons'

export default function ProductDetail() {
  const { slug } = useParams()
  const { products, addToCart, openCart, settings } = useStore()
  const product = productBySlug(products, slug)
  const [variantIdx, setVariantIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">পণ্যটি পাওয়া যায়নি</h1>
        <Link to="/shop" className="btn-red px-5 py-2.5 text-sm mt-4 inline-flex">সব লিচু দেখুন</Link>
      </div>
    )
  }
  const variant = product.variants[variantIdx]
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)
  const relatedFill = related.length < 3 ? [...related, ...products.filter((p) => p.id !== product.id && !related.some((r) => r.id === p.id)).slice(0, 3 - related.length)] : related
  const cat = categoryBySlug(product.category)
  const wa = settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`আমি ${product.name} (${variant.label}) অর্ডার করতে চাই।`)}` : '#'

  const doAdd = () => {
    addToCart(product, variant, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="fade-in" style={{ background: '#f2fbf5' }}>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
        <p className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-[#DF2D4D]">হোম</Link> / <Link to="/shop" className="hover:text-[#DF2D4D]">দোকান</Link>
          {cat && <> / <Link to={`/category/${cat.slug}`} className="hover:text-[#DF2D4D]">{cat.name}</Link></>}
        </p>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden grid md:grid-cols-2">
          <ProductImage product={product} className="w-full aspect-square object-cover" />
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#DF2D4D' }}>{product.name}</h1>
            <div className="mt-2"><Stars rating={product.rating} /></div>
            <p className="mt-3 text-gray-600 leading-relaxed">{product.desc}</p>
            <p className="mt-4 text-3xl font-bold" style={{ color: '#DF2D4D' }}>{taka(variant.price)}</p>
            <p className="text-sm text-gray-500 mt-1">{variant.label} — {product.stock}</p>

            <p className="label-dark mt-6">প্যাক সাইজ বেছে নিন</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, i) => (
                <button key={v.label} onClick={() => setVariantIdx(i)} className={`px-4 py-2 rounded-full text-sm font-bold border ${i === variantIdx ? 'text-white' : 'bg-white text-[#DF2D4D] border-[#DF2D4D]'}`} style={i === variantIdx ? { background: '#DF2D4D', borderColor: '#DF2D4D' } : {}}>
                  {v.label} — {taka(v.price)}
                </button>
              ))}
            </div>

            <p className="label-dark mt-5">পরিমাণ</p>
            <span className="inline-flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="কমিয়ে দিন" className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"><IconMinus /></button>
              <span className="w-12 text-center font-bold">{bn(qty)}</span>
              <button onClick={() => setQty(qty + 1)} aria-label="বাড়িয়ে দিন" className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"><IconPlus /></button>
            </span>

            <div className="mt-6 space-y-2.5">
              <button onClick={doAdd} className="btn-red w-full py-3">{added ? 'কার্টে যোগ হয়েছে!' : 'কার্টে যোগ করুন'}</button>
              <button onClick={() => { addToCart(product, variant, qty); openCart() }} className="btn-red w-full py-3">এখনই কিনুন</button>
              {settings.whatsappNumber ? (
                <a href={wa} target="_blank" rel="noreferrer" className="w-full py-3 rounded-md bg-green-600 text-white font-bold inline-flex items-center justify-center gap-2 hover:bg-green-700">
                  <IconWhatsApp /> WhatsApp-এ অর্ডার করুন
                </a>
              ) : (
                <button onClick={doAdd} className="w-full py-3 rounded-md bg-green-600 text-white font-bold inline-flex items-center justify-center gap-2 hover:bg-green-700">
                  <IconWhatsApp /> WhatsApp-এ অর্ডার করুন
                </button>
              )}
              <button onClick={() => { if (navigator.share) navigator.share({ title: product.name, url: window.location.href }).catch(() => {}) }} className="text-sm font-semibold w-full text-center py-1" style={{ color: '#7c3aed' }}>শেয়ার করুন</button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl mt-6 p-6 sm:p-8">
          <h2 className="text-xl font-bold" style={{ color: '#DF2D4D' }}>বিবরণ</h2>
          <p className="mt-3 text-gray-600 leading-relaxed">{product.desc} অর্ডারের পর বাগান থেকে তাজা লিচু সংগ্রহ করে যত্নে প্যাক করে পাঠানো হয়। ডেলিভারির সময় ফলের মান ঠিক রাখতে শক্ত বাক্সে প্যাক করা হয়। কোনো সমস্যা হলে ডেলিভারির সময় জানালে ব্যবস্থা নেওয়া হবে।</p>
          <ul className="mt-4 space-y-1.5 text-gray-600 list-disc list-inside">
            <li>জাত: {cat?.name || product.category}</li>
            <li>প্যাক: {product.variants.map((v) => v.label).join(', ')}</li>
            <li>ডেলিভারি: সারাদেশে হোম ডেলিভারি, ক্যাশ অন ডেলিভারি সুবিধা</li>
          </ul>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-5" style={{ color: '#DF2D4D' }}>সম্পর্কিত পণ্য</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
          {relatedFill.map((p) => (<ProductCard key={p.id} product={p} />))}
        </div>
      </div>
    </div>
  )
}
