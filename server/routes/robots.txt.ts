export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.appUrl || 'http://localhost:3000'

  const robots = `# robots.txt for YuzuNav
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /go/
Disallow: /login
Disallow: /register
Disallow: /favorites
Disallow: /verify-email

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay (optional, for polite crawling)
Crawl-delay: 1
`

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=86400') // 缓存24小时

  return robots
})
