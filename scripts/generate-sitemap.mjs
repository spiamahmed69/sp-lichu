// Generate sitemap.xml from the same route list as the prerenderer.
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { routes, SITE_URL } from './routes.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const today = new Date().toISOString().slice(0, 10)
const urls = routes.map((r) => {
  const loc = r.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${r.path}`
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq || 'weekly'}</changefreq>\n    <priority>${r.priority || '0.7'}</priority>\n  </url>`
}).join('\n')
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
writeFileSync(join(root, 'dist', 'sitemap.xml'), xml)
writeFileSync(join(root, 'public', 'sitemap.xml'), xml)
console.log(`sitemap: ${routes.length} URLs written`)
