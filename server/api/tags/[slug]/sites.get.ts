import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, message: '缺少标签标识' })
  }

  // 查找标签
  const tag = await prisma.tag.findUnique({
    where: { slug },
  })

  if (!tag) {
    throw createError({ statusCode: 404, message: '标签不存在' })
  }

  // 查找该标签下的所有网站
  const siteTags = await prisma.siteTag.findMany({
    where: { tagId: tag.id },
    include: {
      site: {
        include: {
          category: true,
          tags: {
            include: { tag: true },
          },
        },
      },
    },
  })

  // 只返回已通过审核的网站
  const sites = siteTags
    .map(st => st.site)
    .filter(site => site.status === 'approved')
    .map(site => ({
      ...site,
      tags: site.tags.map(t => t.tag),
    }))

  return {
    success: true,
    data: {
      tag,
      sites,
    },
  }
})
