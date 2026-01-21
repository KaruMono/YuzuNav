import prisma from '~/server/utils/db'
import { submitSiteToIndexNow } from '~/server/utils/indexnow'

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
      data: { status: 'approved' },
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

    // 提交到 IndexNow
    const indexNowResult = await submitSiteToIndexNow(id)
    console.log('[Approve] IndexNow 提交结果:', indexNowResult)

    return {
      success: true,
      data: site,
      message: '已批准',
      indexNow: indexNowResult,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: '操作失败：' + error.message,
    })
  }
})
