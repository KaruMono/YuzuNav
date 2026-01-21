import prisma from '~/server/utils/db'

// 优化的 API - 一次性获取所有已审核网站，按分类分组
// 支持 NSFW 过滤：?nsfw=sfw (只SFW) | nsfw (只NSFW) | all (全部)
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const nsfwMode = (query.nsfw as string) || 'sfw' // 默认 SFW 模式
  
  // 设置缓存头 - 缓存 60 秒，根据 nsfw 参数变化
  setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=60')
  setResponseHeader(event, 'Vary', 'nsfw')
  
  // 构建 NSFW 过滤条件
  let nsfwFilter: any = {}
  if (nsfwMode === 'sfw') {
    nsfwFilter = { isNsfw: false }
  } else if (nsfwMode === 'nsfw') {
    nsfwFilter = { isNsfw: true }
  }
  // 'all' 模式不添加过滤条件
  
  // 一次性获取所有已审核的网站，按排序数字排序
  const sites = await prisma.site.findMany({
    where: {
      status: 'approved',
      ...nsfwFilter,
    },
    include: {
      category: true,
      tags: {
        include: { tag: true },
      },
    },
    orderBy: [
      { sortOrder: 'asc' },  // 先按排序数字升序
      { createdAt: 'desc' }, // 再按创建时间降序
    ],
  })

  // 格式化并按分类分组
  const sitesByCategory: Record<number, any[]> = {}
  
  for (const site of sites) {
    const categoryId = site.categoryId
    if (!sitesByCategory[categoryId]) {
      sitesByCategory[categoryId] = []
    }
    sitesByCategory[categoryId].push({
      id: site.id,
      title: site.title,
      description: site.description,
      url: site.url,
      logoUrl: site.logoUrl,
      hasAndroidApp: site.hasAndroidApp,
      hasIosApp: site.hasIosApp,
      isNsfw: site.isNsfw,
      viewCount: site.viewCount,
      tags: site.tags.map(t => ({
        id: t.tag.id,
        name: t.tag.name,
        slug: t.tag.slug,
      })),
    })
  }

  return {
    success: true,
    data: sitesByCategory,
  }
})
