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

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少评论 ID',
    })
  }

  try {
    // 检查评论是否存在及权限
    const comment = await prisma.comment.findUnique({
      where: { id },
    })

    if (!comment) {
      throw createError({
        statusCode: 404,
        message: '评论不存在',
      })
    }

    // 只有创建者或管理员可以删除
    if (comment.userId !== user.userId && user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: '无权删除此评论',
      })
    }

    // 删除评论（级联删除回复）
    await prisma.comment.delete({
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
