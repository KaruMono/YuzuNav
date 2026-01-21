import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const token = query.token as string

  if (!token) {
    throw createError({
      statusCode: 400,
      message: '缺少验证令牌',
    })
  }

  // 查找验证记录
  const verification = await prisma.emailVerification.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!verification) {
    throw createError({
      statusCode: 400,
      message: '无效的验证令牌',
    })
  }

  // 检查是否过期
  if (verification.expiresAt < new Date()) {
    throw createError({
      statusCode: 400,
      message: '验证令牌已过期',
    })
  }

  // 更新用户邮箱验证状态
  await prisma.user.update({
    where: { id: verification.userId },
    data: { emailVerified: true },
  })

  // 删除验证记录
  await prisma.emailVerification.delete({
    where: { id: verification.id },
  })

  return {
    success: true,
    message: '邮箱验证成功',
  }
})
