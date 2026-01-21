import { z } from 'zod'
import { getCurrentUser } from '~/server/utils/jwt'
import prisma from '~/server/utils/db'

const createCommentSchema = z.object({
  siteId: z.string().min(1, '网站 ID 不能为空'),
  content: z.string().min(1, '评论内容不能为空'),
  parentId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const user = getCurrentUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: '需要登录',
    })
  }

  try {
    const body = await readBody(event)
    const validated = createCommentSchema.parse(body)

    // 检查网站是否存在
    const site = await prisma.site.findUnique({
      where: { id: validated.siteId },
    })

    if (!site) {
      throw createError({
        statusCode: 404,
        message: '网站不存在',
      })
    }

    // 检查评论是否启用
    if (!site.commentsEnabled) {
      throw createError({
        statusCode: 403,
        message: '该网站已关闭评论功能',
      })
    }

    // 如果是回复，检查父评论是否存在
    if (validated.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: validated.parentId },
      })

      if (!parentComment) {
        throw createError({
          statusCode: 404,
          message: '父评论不存在',
        })
      }

      if (parentComment.siteId !== validated.siteId) {
        throw createError({
          statusCode: 400,
          message: '父评论不属于该网站',
        })
      }
    }

    // 创建评论
    const comment = await prisma.comment.create({
      data: {
        siteId: validated.siteId,
        userId: user.userId,
        content: validated.content,
        parentId: validated.parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    })

    return {
      success: true,
      data: comment,
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: error.errors[0].message,
      })
    }
    throw createError({
      statusCode: 500,
      message: '创建评论失败：' + error.message,
    })
  }
})
