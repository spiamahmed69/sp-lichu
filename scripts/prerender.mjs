// Prerender every public route to static HTML (runs after vite build --ssr).
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { routes, SITE_URL } from './routes.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const template = readFileSync(join(dist, 'index.html'), 'utf8')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function setMeta(head, attr, name, content) {
  const re = new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`)
  if (re.test(head)) return head.replace(re, `$1${esc(content)}$2`)
  return head.replace('</head>', `    <meta ${attr}="${name}" content="${esc(content)}" />\n  </head>`)
}

function buildHead(route) {
  const url = route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`
  const fullTitle = route.path === '/' ? route.title : `${route.title} | SP Lichu`
  let head = template.slice(0, template.indexOf('</head>'))
  head = head.replace(/<title>[^<]*<\/title>/, `<title>${esc(fullTitle)}</title>`)
  head = setMeta(head, 'name', 'description', route.description)
  head = setMeta(head, 'property', 'og:title', fullTitle)
  head = setMeta(head, 'property', 'og:description', route.description)
  head = setMeta(head, 'property', 'og:url', url)
  head = head.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
  return head
}

function buildPage(route, html) {
  const head = buildHead(route)
  const body = template.slice(template.indexOf('</head>'))
  return head + body.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
}

let render
try {
  const serverDir = join(root, 'dist-server')
  const entry = readdirSync(serverDir).find((f) => f.startsWith('entry-server.') && f.endsWith('.js'))
  if (!entry) throw new Error('no entry-server bundle in dist-server')
  ;({ render } = await import(join(serverDir, entry)))
} catch (err) {
  console.error(`prerender: SSR bundle unavailable (${err.message}) — keeping the client shell`)
  process.exit(0)
}

let ok = 0
const failed = []
for (const route of routes) {
  try {
    const html = await render(route.path)
    if (!html || html.length < 1000) throw new Error(`rendered HTML suspiciously short (${html?.length ?? 0} chars)`)
    if (!/[\u0980-\u09FF]{3,}/.test(html)) throw new Error('rendered HTML has no Bengali content')
    const out = route.path === '/' ? join(dist, 'index.html') : join(dist, route.path, 'index.html')
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, buildPage(route, html))
    ok++
  } catch (err) {
    failed.push(route.path)
    console.error(`prerender FAIL ${route.path}: ${err.message}`)
  }
}
console.log(`prerender: ${ok}/${routes.length} routes prerendered`)
if (failed.length) console.log(`prerender: fell back to shell for: ${failed.join(', ')}`)
