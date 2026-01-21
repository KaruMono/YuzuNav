import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少网站 ID',
    })
  }

  try {
    const site = await prisma.site.update({
      where: { id },
      data: { status: 'rejected' },
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
    })

    return {
      success: true,
      data: site,
      message: '已拒绝',
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: '操作失败：' + error.message,
    })
  }
})
