import prisma from '~/server/utils/db'
import { getCurrentUser } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const user = getCurrentUser(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少网站 ID',
    })
  }

  const site = await prisma.site.findUnique({
    where: { id },
    include: {
      category: true,
      user: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
      tags: {
        include: { tag: true },
      },
      _count: {
        select: {
          comments: true,
          favorites: true,
        },
      },
    },
  })

  if (!site) {
    throw createError({
      statusCode: 404,
      message: '网站不存在',
    })
  }

  // 检查当前用户是否已收藏
  let isFavorited = false
  if (user) {
    const favorite = await prisma.siteFavorite.findUnique({
      where: {
        userId_siteId: {
          userId: user.userId,
          siteId: id,
        },
      },
    })
    isFavorited = !!favorite
  }

  // 增加访问量
  await prisma.site.update({
    where: { id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  })

  return {
    success: true,
    data: {
      ...site,
      tags: site.tags.map(t => t.tag),
      isFavorited,
    },
  }
})
