import { z } from 'zod'
import prisma from '~/server/utils/db'

const updateUserSchema = z.object({
  username: z.string().optional(),
  role: z.enum(['user', 'admin']).optional(),
  emailVerified: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少用户 ID',
    })
  }

  try {
    const body = await readBody(event)
    const validated = updateUserSchema.parse(body)

    const user = await prisma.user.update({
      where: { id },
      data: validated,
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

    return {
      success: true,
      data: user,
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
      message: '更新失败：' + error.message,
    })
  }
})
