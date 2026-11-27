import { useStore } from '../lib/store'
import ProductCard from '../components/ProductCard'
import { ArchiveBanner } from '../components/SectionHeader'

export default function Shop() {
  const { products } = useStore()
  return (
    <div className="fade-in">
      <ArchiveBanner title="সব লিচু" subtitle="আমাদের বাগানের সব জাতের তাজা লিচু এক জায়গায় — পছন্দমতো বেছে অর্ডার করুন।" />
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (<ProductCard key={p.id} product={p} />))}
        </div>
        {products.length === 0 && <p className="text-center text-gray-500 py-16">এখন কোনো পণ্য নেই।</p>}
      </section>
    </div>
  )
}
