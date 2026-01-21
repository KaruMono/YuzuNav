import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.appUrl || 'http://localhost:3000'

  // 获取所有已审核且非 NSFW 的网站（NSFW 网站不出现在 sitemap 中）
  const sites = await prisma.site.findMany({
    where: { 
      status: 'approved',
      isNsfw: false, // 排除 NSFW 网站
    },
    select: {
      id: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  // 获取所有分类
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // 获取所有标签
  const tags = await prisma.tag.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // 构建 XML
  const urls: string[] = []

  // 首页 - 最高优先级
  urls.push(`
    <url>
      <loc>${baseUrl}/</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>`)

  // 分类页面 - 高优先级
  for (const category of categories) {
    urls.push(`
    <url>
      <loc>${baseUrl}/?category=${category.slug}</loc>
      <lastmod>${category.updatedAt.toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`)
  }

  // 网站详情页 - 中等优先级
  for (const site of sites) {
    urls.push(`
    <url>
      <loc>${baseUrl}/site/${site.id}</loc>
      <lastmod>${site.updatedAt.toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
    </url>`)
  }

  // 标签页 - 中等优先级
  for (const tag of tags) {
    urls.push(`
    <url>
      <loc>${baseUrl}/tag/${tag.slug}</loc>
      <lastmod>${tag.updatedAt.toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.5</priority>
    </url>`)
  }

  // 静态页面 - 较低优先级
  const staticPages = [
    { path: '/submit', priority: '0.5', changefreq: 'monthly' },
  ]

  for (const page of staticPages) {
    urls.push(`
    <url>
      <loc>${baseUrl}${page.path}</loc>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`)
  }

  // 生成完整的 XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join('')}
</urlset>`

  // 设置响应头
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600') // 缓存1小时

  return sitemap
})
