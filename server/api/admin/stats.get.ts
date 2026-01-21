import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const [
    totalUsers,
    totalSites,
    pendingSites,
    totalComments,
    totalCategories,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.site.count({ where: { status: 'approved' } }),
    prisma.site.count({ where: { status: 'pending' } }),
    prisma.comment.count(),
    prisma.category.count(),
  ])

  return {
    success: true,
    data: {
      totalUsers,
      totalSites,
      pendingSites,
      totalComments,
      totalCategories,
    },
  }
})
