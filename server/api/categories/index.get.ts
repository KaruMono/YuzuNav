import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // 设置缓存头 - 缓存 5 分钟
  setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=300')
  
  // 获取所有分类，包含子分类
  const categories = await prisma.category.findMany({
    where: {
      parentId: null, // 只获取顶级分类
    },
    include: {
      children: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
    },
    orderBy: {
      sortOrder: 'asc',
    },
  })

  return {
    success: true,
    data: categories,
  }
})
