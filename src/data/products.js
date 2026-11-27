// SP Lichu — seed catalogue (own Bengali content).
// Images: Wikimedia Commons litchi photos (public, verified 200). No images
// copied from the reference site.
export const IMAGES = [
  'https://upload.wikimedia.org/wikipedia/commons/5/5c/Lychee_fruits_and_seed.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/1/14/Plate_of_peeled_lychee_fruit_2019_10-32-11_PM.jpeg',
  'https://upload.wikimedia.org/wikipedia/commons/8/85/Lychee_fruits_at_a_market_in_West_Bengal%2C_India.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/4d/Image-Lychee_fruit_Hawaii.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/6/66/Lychee_fruit.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/3/32/Lychee_Fruit.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/0/0a/Lychee_%28Litchi_chinensis%29-01.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/4/46/Litchi_chinensis_fruits.JPG',
]

export const CATEGORIES = [
  { slug: 'dinajpur-lichu', name: 'দিনাজপুর লিচু', desc: 'দিনাজপুরের বাগান থেকে সংগ্রহ করা মিষ্টি ও রসালো লিচু।' },
  { slug: 'rajshahi-lichu', name: 'রাজশাহী লিচু', desc: 'রাজশাহীর বিখ্যাত লিচু — বড় আকার, গাঢ় মিষ্টি স্বাদ।' },
  { slug: 'bombay-lichu', name: 'বোম্বাই লিচু', desc: 'বোম্বাই জাতের লিচু — মৌসুমের শুরুর দিকে পাওয়া যায়।' },
  { slug: 'bedana-lichu', name: 'বেদানা লিচু', desc: 'বেদানা জাতের লিচু — ছোট বীজ, বেশি শাঁস।' },
  { slug: 'china-3-lichu', name: 'চায়না-৩ লিচু', desc: 'চায়না-৩ জাতের লিচু — বড় আকার ও লম্বা সংরক্ষণ।' },
  { slug: 'premium-lichu', name: 'প্রিমিয়াম লিচু', desc: 'বাছাই করা সেরা মানের প্রিমিয়াম লিচু — উপহারের জন্য উপযুক্ত।' },
]

const img = (i) => IMAGES[i % IMAGES.length]

// Variants: price per pack. price = variants[0].price (per 100 pcs).
function p(id, slug, name, category, base, rating, views, stock, desc, imageIdx) {
  return {
    id, slug, name, category, rating, views, stock, desc,
    image: img(imageIdx),
    variants: [
      { label: '১০০ পিস', pcs: 100, price: base },
      { label: '২০০ পিস', pcs: 200, price: Math.round(base * 1.95) },
      { label: '৫০০ পিস', pcs: 500, price: Math.round(base * 4.7) },
    ],
  }
}

export const SEED_PRODUCTS = [
  p(1, 'dinajpur-lichu-premium', 'দিনাজপুর লিচু — প্রিমিয়াম', 'dinajpur-lichu', 550, 4.9, 2841, 'স্টকে আছে', 'দিনাজপুরের বাগান থেকে সকালে তোলা তাজা লিচু। বড় আকার, গাঢ় লাল খোসা ও মিষ্টি রসালো শাঁস।', 0),
  p(2, 'dinajpur-lichu-regular', 'দিনাজপুর লিচু — রেগুলার', 'dinajpur-lichu', 450, 4.7, 1932, 'স্টকে আছে', 'দিনাজপুরের পরিচিত জাতের লিচু। প্রতিদিনের খাওয়ার জন্য মিষ্টি ও তাজা।', 2),
  p(3, 'dinajpur-lichu-family-pack', 'দিনাজপুর লিচু — ফ্যামিলি প্যাক', 'dinajpur-lichu', 480, 4.8, 1204, 'স্টকে আছে', 'পুরো পরিবারের জন্য বড় প্যাক। বাছাই করা মাঝারি-বড় আকারের লিচু।', 4),
  p(4, 'rajshahi-lichu-premium', 'রাজশাহী লিচু — প্রিমিয়াম', 'rajshahi-lichu', 600, 4.9, 3120, 'স্টকে আছে', 'রাজশাহীর বিখ্যাত লিচু। গাঢ় মিষ্টি স্বাদ ও ঘন শাঁসের জন্য পরিচিত।', 1),
  p(5, 'rajshahi-lichu-regular', 'রাজশাহী লিচু — রেগুলার', 'rajshahi-lichu', 500, 4.6, 1745, 'স্টকে আছে', 'রাজশাহীর বাগানের তাজা লিচু। মিষ্টি স্বাদ, সাশ্রয়ী দাম।', 5),
  p(6, 'rajshahi-lichu-gift-box', 'রাজশাহী লিচু — গিফট বক্স', 'rajshahi-lichu', 750, 5.0, 986, 'স্টকে আছে', 'উপহার দেওয়ার জন্য সাজানো বক্সে বাছাই করা সেরা লিচু।', 3),
  p(7, 'bombay-lichu-premium', 'বোম্বাই লিচু — প্রিমিয়াম', 'bombay-lichu', 520, 4.8, 2108, 'স্টকে আছে', 'বোম্বাই জাতের লিচু। মৌসুমের শুরুর দিকের তাজা ফল, হালকা টক-মিষ্টি স্বাদ।', 6),
  p(8, 'bombay-lichu-regular', 'বোম্বাই লিচু — রেগুলার', 'bombay-lichu', 420, 4.5, 1320, 'স্টকে আছে', 'বোম্বাই জাতের রেগুলার লিচু। প্রতিদিনের জন্য ভালো মানের ফল।', 7),
  p(9, 'bedana-lichu-premium', 'বেদানা লিচু — প্রিমিয়াম', 'bedana-lichu', 680, 4.9, 2544, 'স্টকে আছে', 'বেদানা জাতের লিচু। ছোট বীজ আর বেশি শাঁস — একবার খেলে মনে থাকবে।', 0),
  p(10, 'china-3-lichu-premium', 'চায়না-৩ লিচু — প্রিমিয়াম', 'china-3-lichu', 650, 4.8, 1876, 'স্টকে আছে', 'চায়না-৩ জাতের বড় আকারের লিচু। অন্য জাতের চেয়ে বেশিদিন তাজা থাকে।', 5),
  p(11, 'china-3-lichu-regular', 'চায়না-৩ লিচু — রেগুলার', 'china-3-lichu', 540, 4.6, 1102, 'স্টকে আছে', 'চায়না-৩ জাতের রেগুলার লিচু। বড় শাঁস, মিষ্টি স্বাদ।', 2),
  p(12, 'premium-lichu-royal', 'প্রিমিয়াম লিচু — রয়েল', 'premium-lichu', 950, 5.0, 4210, 'স্টকে আছে', 'আমাদের সবচেয়ে ভালো মানের লিচু। প্রতিটি ফল হাতে বাছাই করা।', 1),
  p(13, 'premium-lichu-gold', 'প্রিমিয়াম লিচু — গোল্ড', 'premium-lichu', 850, 4.9, 3650, 'স্টকে আছে', 'সোনালি-লাল খোসার বড় আকারের লিচু। মিষ্টি ও রসে ভরপুর।', 3),
  p(14, 'premium-lichu-silver', 'প্রিমিয়াম লিচু — সিলভার', 'premium-lichu', 780, 4.8, 2980, 'স্টকে আছে', 'বাছাই করা মাঝারি-বড় লিচু। পরিবারের সবার জন্য প্রিমিয়াম স্বাদ।', 4),
  p(15, 'premium-lichu-orchard', 'প্রিমিয়াম লিচু — অর্চার্ড সিলেক্ট', 'premium-lichu', 820, 4.9, 2760, 'স্টকে আছে', 'নিজস্ব বাগানের সেরা গাছ থেকে সংগ্রহ করা লিচু।', 6),
  p(16, 'premium-lichu-early', 'প্রিমিয়াম লিচু — আর্লি হারভেস্ট', 'premium-lichu', 900, 4.8, 2310, 'স্টকে আছে', 'মৌসুমের প্রথম তোলা লিচু। সীমিত পরিমাণে পাওয়া যায়।', 7),
  p(17, 'premium-lichu-jumbo', 'প্রিমিয়াম লিচু — জাম্বো', 'premium-lichu', 1050, 5.0, 1980, 'স্টকে আছে', 'অস্বাভাবিক বড় আকারের লিচু। এক পিসেই মন ভরে যাবে।', 0),
  p(18, 'premium-lichu-honey', 'প্রিমিয়াম লিচু — হানি সুইট', 'premium-lichu', 880, 4.9, 1740, 'স্টকে আছে', 'মধুর মতো মিষ্টি লিচু। যারা বেশি মিষ্টি পছন্দ করেন তাদের জন্য।', 2),
  p(19, 'premium-lichu-fresh', 'প্রিমিয়াম লিচু — ফ্রেশ পিক', 'premium-lichu', 720, 4.7, 1560, 'স্টকে আছে', 'অর্ডারের দিন সকালে তোলা একদম তাজা লিচু।', 5),
  p(20, 'premium-lichu-deluxe', 'প্রিমিয়াম লিচু — ডিলাক্স', 'premium-lichu', 980, 4.9, 1430, 'স্টকে আছে', 'ডিলাক্স মানের লিচু — বড়, মিষ্টি ও রসালো।', 1),
  p(21, 'premium-lichu-classic', 'প্রিমিয়াম লিচু — ক্লাসিক', 'premium-lichu', 700, 4.7, 1290, 'স্টকে আছে', 'ক্লাসিক স্বাদের প্রিমিয়াম লিচু। সব বয়সীদের পছন্দ।', 3),
  p(22, 'premium-lichu-supreme', 'প্রিমিয়াম লিচু — সুপ্রিম', 'premium-lichu', 1100, 5.0, 1120, 'সীমিত স্টক', 'সুপ্রিম মানের লিচু — আমাদের বাগানের সেরা ফল। স্টক সীমিত।', 4),
  p(23, 'premium-lichu-royal-box', 'প্রিমিয়াম লিচু — রয়েল বক্স', 'premium-lichu', 1250, 5.0, 940, 'স্টকে আছে', 'রয়েল বক্সে সাজানো সেরা লিচু। উপহার ও বিশেষ অনুষ্ঠানের জন্য।', 6),
  p(24, 'premium-lichu-eco', 'প্রিমিয়াম লিচু — ইকো প্যাক', 'premium-lichu', 640, 4.6, 870, 'স্টকে আছে', 'পরিবেশবান্ধব প্যাকে প্রিমিয়াম লিচু। তাজা ও মিষ্টি।', 7),
]

export const categoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug)
export const productBySlug = (products, slug) => products.find((pr) => pr.slug === slug)

// Bengali digits
const BN = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
export const bn = (n) => String(n).replace(/[0-9]/g, (d) => BN[+d])
export const taka = (n) => `৳${bn(Number(n).toLocaleString('en-US'))}`
export const priceRange = (pr) => {
  const prices = pr.variants.map((v) => v.price)
  const lo = Math.min(...prices)
  const hi = Math.max(...prices)
  return lo === hi ? taka(lo) : `${taka(lo)} – ${taka(hi)}`
}
