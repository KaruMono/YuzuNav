import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少分类 ID',
    })
  }

  try {
    // 检查是否有网站使用此分类
    const siteCount = await prisma.site.count({
      where: { categoryId: id },
    })

    if (siteCount > 0) {
      throw createError({
        statusCode: 400,
        message: `无法删除，仍有 ${siteCount} 个网站使用此分类`,
      })
    }

    await prisma.category.delete({
      where: { id },
    })

    return {
      success: true,
      message: '删除成功',
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: '删除失败：' + error.message,
    })
  }
})
