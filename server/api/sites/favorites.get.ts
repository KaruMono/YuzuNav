import prisma from '~/server/utils/db'
import { getCurrentUser } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const user = getCurrentUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: '需要登录',
    })
  }

  try {
    const favorites = await prisma.siteFavorite.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        site: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 提取网站数据
    const sites = favorites.map(f => f.site).filter(s => s && s.status === 'approved')

    return {
      success: true,
      data: sites,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: '获取收藏列表失败',
    })
  }
})
