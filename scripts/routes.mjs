// Single source of truth for prerender + sitemap routes.
import { SEED_PRODUCTS, CATEGORIES } from '../src/data/products.js'

export const SITE_URL = 'https://sp-lichu.vercel.app'

const STATIC = [
  { path: '/', title: 'SP Lichu — তাজা লিচু অনলাইনে', description: 'দিনাজপুর, রাজশাহী, বোম্বাই, বেদানা ও চায়না-৩ জাতের তাজা লিচু সরাসরি বাগান থেকে। সারাদেশে হোম ডেলিভারি, ক্যাশ অন ডেলিভারি।', priority: '1.0', changefreq: 'daily' },
  { path: '/shop', title: 'সব লিচু', description: 'SP Lichu-র সব জাতের তাজা লিচু এক জায়গায় — পছন্দমতো বেছে অর্ডার করুন।', priority: '0.9', changefreq: 'daily' },
  { path: '/track-order', title: 'অর্ডার ট্র্যাক করুন', description: 'অর্ডার আইডি ও মোবাইল নম্বর দিয়ে আপনার লিচুর অর্ডারের অবস্থা জানুন।', priority: '0.7', changefreq: 'weekly' },
  { path: '/about', title: 'আমাদের সম্পর্কে', description: 'SP Lichu — তাজা লিচুর অনলাইন দোকান। বাগান থেকে সরাসরি আপনার দরজায়।', priority: '0.6', changefreq: 'monthly' },
  { path: '/checkout', title: 'চেকআউট', description: 'SP Lichu চেকআউট — ক্যাশ অন ডেলিভারি, বিকাশ বা নগদে পেমেন্ট।', priority: '0.5', changefreq: 'monthly' },
]

export const routes = [
  ...STATIC,
  ...CATEGORIES.map((c) => ({
    path: `/category/${c.slug}`,
    title: c.name,
    description: `${c.name} — ${c.desc}`,
    priority: '0.8',
    changefreq: 'daily',
  })),
  ...SEED_PRODUCTS.map((p) => ({
    path: `/product/${p.slug}`,
    title: p.name,
    description: `${p.name} — ${p.desc}`,
    priority: '0.8',
    changefreq: 'weekly',
  })),
]
// Note: /my-account and /admin are app pages (login-gated) — intentionally NOT prerendered.
