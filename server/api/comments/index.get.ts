import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const siteId = query.siteId as string

  if (!siteId) {
    throw createError({
      statusCode: 400,
      message: '缺少网站 ID',
    })
  }

  const comments = await prisma.comment.findMany({
    where: {
      siteId,
      parentId: null, // 只获取顶级评论
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
      replies: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return {
    success: true,
    data: comments,
  }
})
