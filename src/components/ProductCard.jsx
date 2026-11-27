import { useState } from 'react'
import { Link } from 'react-router-dom'
import { bn, priceRange, taka } from '../data/products'
import { useStore } from '../lib/store'
import { IconCart, IconEye, IconStar } from './icons'

function ProductImage({ product, className }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className={`img-fallback ${className}`} role="img" aria-label={product.name}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" fill="#fff" stroke="none" opacity="0.7" /></svg>
      </div>
    )
  }
  return <img src={product.image} alt={product.name} loading="lazy" onError={() => setFailed(true)} className={className} />
}

export function Stars({ rating }) {
  const full = Math.round(rating)
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`রেটিং ${bn(rating)} / ৫`}>
      {[1, 2, 3, 4, 5].map((i) => (<IconStar key={i} filled={i <= full} width={15} height={15} />))}
      <span className="text-gray-500 text-xs ml-1">({bn(rating)})</span>
    </span>
  )
}

export default function ProductCard({ product }) {
  const { addToCart, onCartOpen } = useStore()
  const orderNow = () => {
    addToCart(product, product.variants[0], 1)
    onCartOpen?.()
  }
  return (
    <article className="card-product flex flex-col">
      <Link to={`/product/${product.slug}`} className="block overflow-hidden rounded-md">
        <ProductImage product={product} className="w-full aspect-square object-cover" />
      </Link>
      <h3 className="mt-3 font-semibold text-[15px] leading-snug text-gray-900">
        <Link to={`/product/${product.slug}`} className="hover:text-[#DF2D4D]">{product.name}</Link>
      </h3>
      <div className="mt-1.5"><Stars rating={product.rating} /></div>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="font-bold text-[#DF2D4D] text-[15px]">{priceRange(product)}</span>
        <span className="inline-flex items-center gap-1 text-gray-400 text-xs"><IconEye width={15} height={15} />{bn(product.views)}</span>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={orderNow} className="btn-red flex-1 py-2.5 text-sm">অর্ডার করুন</button>
        <button onClick={() => addToCart(product, product.variants[0], 1)} aria-label={`${product.name} কার্টে যোগ করুন`} className="w-11 shrink-0 border border-[#DF2D4D] text-[#DF2D4D] rounded-md flex items-center justify-center hover:bg-[#fdf2f4]">
          <IconCart width={18} height={18} />
        </button>
      </div>
    </article>
  )
}

export { ProductImage, taka }
