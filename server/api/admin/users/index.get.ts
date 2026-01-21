import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 20
  const skip = (page - 1) * limit

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        emailVerified: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            sites: true,
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
    prisma.user.count(),
  ])

  return {
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
})
