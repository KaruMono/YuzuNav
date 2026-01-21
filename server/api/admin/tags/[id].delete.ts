import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: '缺少标签 ID' })
  }

  try {
    await prisma.tag.delete({
      where: { id: parseInt(id) },
    })

    return {
      success: true,
      message: '标签删除成功',
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: '删除失败：' + error.message,
    })
  }
})
