import { useParams, Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { categoryBySlug } from '../data/products'
import ProductCard from '../components/ProductCard'
import { ArchiveBanner } from '../components/SectionHeader'

export default function Category() {
  const { slug } = useParams()
  const { products } = useStore()
  const cat = categoryBySlug(slug)
  const list = products.filter((p) => p.category === slug)
  if (!cat) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">ক্যাটাগরি পাওয়া যায়নি</h1>
        <Link to="/shop" className="btn-red px-5 py-2.5 text-sm mt-4 inline-flex">সব লিচু দেখুন</Link>
      </div>
    )
  }
  return (
    <div className="fade-in">
      <ArchiveBanner title={cat.name} subtitle={cat.desc} />
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map((p) => (<ProductCard key={p.id} product={p} />))}
        </div>
        {list.length === 0 && <p className="text-center text-gray-500 py-16">এই ক্যাটাগরিতে এখন কোনো পণ্য নেই।</p>}
      </section>
    </div>
  )
}
