import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const status = query.status as string
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 20
  const skip = (page - 1) * limit

  const where: any = {}
  if (status) {
    where.status = status
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
            email: true,
          },
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      skip,
      take: limit,
    }),
    prisma.site.count({ where }),
  ])

  return {
    success: true,
    data: sites,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
})
