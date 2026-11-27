import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import ProductCard, { ProductImage } from '../components/ProductCard'
import SectionHeader from '../components/SectionHeader'
import { IconTruck, IconShield, IconLeaf, IconArrow } from '../components/icons'

export default function Home() {
  const { products } = useStore()
  const best = products.slice(0, 10)
  const premium = [...products.filter((p) => p.category === 'premium-lichu'), ...products.filter((p) => p.category !== 'premium-lichu')].slice(0, 10)
  const heroProduct = products[11] || products[0]

  return (
    <div className="fade-in">
      {/* Hero — left text, right photo, single static banner */}
      <section className="max-w-7xl mx-auto px-4 pt-6 sm:pt-8 pb-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm font-bold tracking-wide text-gray-500">তাজা • খাঁটি • বাগান থেকে সরাসরি</p>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-[56px] leading-[1.15] font-bold" style={{ color: '#DF2D4D' }}>
              তাজা লিচু,<br />সরাসরি বাগান থেকে<br />আপনার দরজায়
            </h1>
            <p className="mt-4 text-lg text-gray-700 font-medium">দিনাজপুর, রাজশাহী, বোম্বাই, বেদানা ও চায়না-৩ — সেরা জাতের লিচু এখন অনলাইনে।</p>
            <p className="mt-1 text-gray-500">অর্ডার করুন আজই — সারাদেশে হোম ডেলিভারি।</p>
            <div className="mt-6">
              <Link to="/shop" className="btn-red-pill px-6 py-3.5 text-base">
                <span className="w-8 h-8 rounded-full bg-white text-[#DF2D4D] flex items-center justify-center"><IconArrow width={16} height={16} /></span>
                এখনই অর্ডার করুন
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-gray-700">
              <span className="inline-flex items-center gap-2"><span className="w-9 h-9 rounded-full border-2 border-[#DF2D4D] text-[#DF2D4D] flex items-center justify-center"><IconTruck width={17} height={17} /></span>দ্রুত ডেলিভারি</span>
              <span className="hidden sm:block w-px h-6 bg-gray-300" />
              <span className="inline-flex items-center gap-2"><span className="w-9 h-9 rounded-full border-2 border-[#DF2D4D] text-[#DF2D4D] flex items-center justify-center"><IconLeaf width={17} height={17} /></span>১০০% তাজা</span>
              <span className="hidden sm:block w-px h-6 bg-gray-300" />
              <span className="inline-flex items-center gap-2"><span className="w-9 h-9 rounded-full border-2 border-[#DF2D4D] text-[#DF2D4D] flex items-center justify-center"><IconShield width={17} height={17} /></span>ক্যাশ অন ডেলিভারি</span>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <ProductImage product={heroProduct} className="w-full aspect-[4/3] object-cover" />
          </div>
        </div>
      </section>

      {/* Section 1 — best sellers */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <SectionHeader title="সেরা লিচু" to="/shop" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {best.map((p) => (<ProductCard key={p.id} product={p} />))}
        </div>
      </section>

      {/* Section 2 — premium */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <SectionHeader title="প্রিমিয়াম লিচু" to="/category/premium-lichu" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {premium.map((p) => (<ProductCard key={p.id} product={p} />))}
        </div>
      </section>
    </div>
  )
}
