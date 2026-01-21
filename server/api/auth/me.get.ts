import { getCurrentUser } from '~/server/utils/jwt'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const currentUser = getCurrentUser(event)

  if (!currentUser) {
    throw createError({
      statusCode: 401,
      message: '未登录',
    })
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.userId },
    select: {
      id: true,
      email: true,
      username: true,
      avatarUrl: true,
      emailVerified: true,
      role: true,
      createdAt: true,
    },
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      message: '用户不存在',
    })
  }

  return {
    success: true,
    user,
  }
})
