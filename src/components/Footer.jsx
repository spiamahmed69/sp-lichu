import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/products'
import { useStore } from '../lib/store'
import { IconTruck, IconShield, IconLeaf, IconCash, IconFacebook, IconYoutube, IconInstagram } from './icons'

const TRUST = [
  { icon: IconTruck, title: 'দ্রুত ডেলিভারি', sub: 'সারাদেশে হোম ডেলিভারি' },
  { icon: IconLeaf, title: 'তাজা ও খাঁটি', sub: 'সরাসরি বাগান থেকে সংগ্রহ' },
  { icon: IconShield, title: 'মানসম্মত ফল', sub: 'বাছাই করা সেরা লিচু' },
  { icon: IconCash, title: 'ক্যাশ অন ডেলিভারি', sub: 'পণ্য পেয়ে টাকা দিন' },
]

export function TrustStrip() {
  return (
    <section className="w-full" style={{ background: '#DF2D4D' }} aria-label="আমাদের প্রতিশ্রুতি">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {TRUST.map((t) => (
          <div key={t.title} className="flex items-start gap-3 text-white lg:border-l lg:border-white/25 lg:first:border-l-0 lg:pl-6 lg:first:pl-0">
            <span className="w-11 h-11 shrink-0 border-2 border-white/80 rounded-md flex items-center justify-center"><t.icon width={22} height={22} /></span>
            <span>
              <span className="block font-bold text-[15px] sm:text-base leading-snug">{t.title}</span>
              <span className="block text-white/85 text-[13px] mt-0.5">{t.sub}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Footer() {
  const { settings, user } = useStore()
  return (
    <footer>
      <TrustStrip />
      <div className="footer-grad text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-10 h-10 rounded-full bg-white text-[#DF2D4D] flex items-center justify-center text-xl font-bold">লি</span>
              <span className="text-[22px] font-bold">{settings.shopName}</span>
            </div>
            <p className="mt-4 text-white/90 text-[15px] leading-relaxed">
              {settings.shopName} — তাজা লিচুর অনলাইন দোকান। দিনাজপুর, রাজশাহী, বোম্বাই, বেদানা ও চায়না-৩ জাতের লিচু সরাসরি বাগান থেকে সংগ্রহ করে আপনার দরজায় পৌঁছে দিই।
            </p>
            <div className="mt-5 flex gap-3">
              {[{ icon: IconFacebook, label: 'ফেসবুক' }, { icon: IconYoutube, label: 'ইউটিউব' }, { icon: IconInstagram, label: 'ইনস্টাগ্রাম' }].map((s) => (
                <a key={s.label} href="#" aria-label={s.label} onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-white text-[#DF2D4D] flex items-center justify-center hover:opacity-90">
                  <s.icon width={18} height={18} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg">আমাদের পণ্য</h3>
            <ul className="mt-4 space-y-2.5 text-white/90">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link to={`/category/${c.slug}`} className="hover:text-white inline-flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border border-white/70 inline-flex items-center justify-center text-[10px]">›</span>{c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/shop" className="hover:text-white inline-flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border border-white/70 inline-flex items-center justify-center text-[10px]">›</span>সব লিচু
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg">কাস্টমার সার্ভিস</h3>
            <ul className="mt-4 space-y-2.5 text-white/90">
              {[
                { to: '/my-account', label: 'আমার অ্যাকাউন্ট' },
                { to: '/about', label: 'আমাদের সম্পর্কে' },
                { to: '/track-order', label: 'অর্ডার ট্র্যাক করুন' },
                { to: '/shop', label: 'কেনাকাটা করুন' },
              ].map((l) => (
                <li key={l.to + l.label}>
                  <Link to={l.to} className="hover:text-white inline-flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border border-white/70 inline-flex items-center justify-center text-[10px]">›</span>{l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/admin" className="hover:text-white inline-flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border border-white/70 inline-flex items-center justify-center text-[10px]">›</span>অ্যাডমিন
                </Link>
              </li>
            </ul>
            {user?.role === 'admin' && (
              <p className="mt-4 text-sm bg-white/15 rounded-lg px-3 py-2">অ্যাডমিন হিসেবে লগইন করা আছে — <Link to="/admin" className="font-bold underline">প্যানেল খুলুন</Link></p>
            )}
          </div>
        </div>
        <div className="border-t border-white/20">
          <p className="text-center text-sm text-white/90 py-4 px-4">© {new Date().getFullYear()} {settings.shopName} — সর্বস্বত্ব সংরক্ষিত। <span className="text-amber-300 font-semibold">তাজা লিচু, সেরা স্বাদ।</span></p>
        </div>
      </div>
    </footer>
  )
}
