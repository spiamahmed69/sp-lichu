import { Link } from 'react-router-dom'

export default function SectionHeader({ title, to }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#DF2D4D' }}>{title}</h2>
        {to && (
          <Link to={to} className="btn-red-pill px-4 py-1.5 text-[13px] shrink-0">সব দেখুন</Link>
        )}
      </div>
      <div className="section-rule mt-3" />
    </div>
  )
}

export function ArchiveBanner({ title, subtitle }) {
  return (
    <div className="w-full py-12 sm:py-16 text-center text-white px-4" style={{ background: '#DF2D4D' }}>
      <h1 className="text-3xl sm:text-4xl font-bold">{title}</h1>
      {subtitle && <p className="mt-2 text-white/85 max-w-xl mx-auto">{subtitle}</p>}
    </div>
  )
}
