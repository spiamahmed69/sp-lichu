import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { bn, taka } from '../data/products'
import { IconX, IconPlus, IconMinus } from './icons'

export default function CartDrawer({ open, onClose }) {
  const { cart, cartTotal, updateQty, removeFromCart, settings } = useStore()
  if (!open) return null
  const delivery = cartTotal >= settings.freeDeliveryAbove || cartTotal === 0 ? 0 : settings.deliveryCharge
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-label="কার্ট">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="drawer-slide absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900">আপনার কার্ট <span className="text-[#DF2D4D]">({bn(cart.length)}টি পণ্য)</span></h2>
          <button onClick={onClose} aria-label="বন্ধ করুন" className="w-9 h-9 rounded-full text-white flex items-center justify-center" style={{ background: '#DF2D4D' }}><IconX width={18} height={18} /></button>
        </div>
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-gray-500">আপনার কার্ট খালি।</p>
            <Link to="/shop" onClick={onClose} className="btn-red px-5 py-2.5 text-sm">কেনাকাটা শুরু করুন</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cart.map((item) => (
                <div key={item.key} className="flex gap-3 border border-gray-100 rounded-lg p-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 leading-snug">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="inline-flex items-center border border-gray-200 rounded-md overflow-hidden">
                        <button onClick={() => updateQty(item.key, item.qty - 1)} aria-label="কমিয়ে দিন" className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-50"><IconMinus width={14} height={14} /></button>
                        <span className="w-8 text-center text-sm font-bold">{bn(item.qty)}</span>
                        <button onClick={() => updateQty(item.key, item.qty + 1)} aria-label="বাড়িয়ে দিন" className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-50"><IconPlus width={14} height={14} /></button>
                      </span>
                      <span className="font-bold text-[#DF2D4D] text-sm">{taka(item.price * item.qty)}</span>
                    </div>
                    <button onClick={() => removeFromCart(item.key)} className="text-xs text-gray-400 hover:text-red-600 mt-1.5">সরিয়ে ফেলুন</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 px-5 py-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600"><span>সাবটোটাল</span><span>{taka(cartTotal)}</span></div>
              <div className="flex justify-between text-gray-600"><span>ডেলিভারি চার্জ</span><span>{delivery === 0 ? 'ফ্রি' : taka(delivery)}</span></div>
              {cartTotal < settings.freeDeliveryAbove && <p className="text-xs text-gray-400">আরও {taka(settings.freeDeliveryAbove - cartTotal)} টাকার কিনলে ডেলিভারি ফ্রি!</p>}
              <div className="flex justify-between font-bold text-base text-gray-900 pt-1"><span>মোট</span><span className="text-[#DF2D4D]">{taka(cartTotal + delivery)}</span></div>
              <Link to="/checkout" onClick={onClose} className="btn-red w-full py-3 mt-2">চেকআউট করুন</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
