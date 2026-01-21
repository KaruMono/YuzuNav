import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categoryId = query.categoryId ? parseInt(query.categoryId as string) : undefined
  const status = query.status as string || 'approved'
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 20
  const skip = (page - 1) * limit

  const where: any = {
    status,
  }

  if (categoryId) {
    where.categoryId = categoryId
  }

  const [sites, total] = await Promise.all([
    prisma.site.findMany({
      where,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        tags: {
          include: { tag: true },
        },
        _count: {
          select: {
            comments: true,
            favorites: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.site.count({ where }),
  ])

  // 格式化标签数据
  const formattedSites = sites.map(site => ({
    ...site,
    tags: site.tags.map(t => t.tag),
  }))

  return {
    success: true,
    data: formattedSites,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
})
