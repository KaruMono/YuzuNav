import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // 设置缓存头 - 不缓存，确保分类更新后能立即获取最新数据
  setResponseHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
  
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
