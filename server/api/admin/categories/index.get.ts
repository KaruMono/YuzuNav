import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // 获取所有分类（包括子分类）
  const categories = await prisma.category.findMany({
    include: {
      parent: {
        select: {
          id: true,
          name: true,
        },
      },
      children: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
      _count: {
        select: {
          sites: true,
        },
      },
    },
    orderBy: [
      { parentId: 'asc' },
      { sortOrder: 'asc' },
    ],
  })

  return {
    success: true,
    data: categories,
  }
})
