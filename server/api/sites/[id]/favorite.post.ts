import { getCurrentUser } from '~/server/utils/jwt'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const user = getCurrentUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: '需要登录',
    })
  }

  const siteId = getRouterParam(event, 'id')
  if (!siteId) {
    throw createError({
      statusCode: 400,
      message: '缺少网站 ID',
    })
  }

  try {
    // 检查网站是否存在
    const site = await prisma.site.findUnique({
      where: { id: siteId },
    })

    if (!site) {
      throw createError({
        statusCode: 404,
        message: '网站不存在',
      })
    }

    // 检查是否已收藏
    const existing = await prisma.siteFavorite.findUnique({
      where: {
        userId_siteId: {
          userId: user.userId,
          siteId,
        },
      },
    })

    if (existing) {
      // 取消收藏
      await prisma.siteFavorite.delete({
        where: {
          userId_siteId: {
            userId: user.userId,
            siteId,
          },
        },
      })

      return {
        success: true,
        favorited: false,
        message: '已取消收藏',
      }
    } else {
      // 添加收藏
      await prisma.siteFavorite.create({
        data: {
          userId: user.userId,
          siteId,
        },
      })

      return {
        success: true,
        favorited: true,
        message: '已添加收藏',
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: '操作失败：' + error.message,
    })
  }
})
