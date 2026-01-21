import prisma from '~/server/utils/db'
import { z } from 'zod'

const updateTagSchema = z.object({
  name: z.string().min(1, '标签名称不能为空'),
  slug: z.string().min(1, '标签标识不能为空'),
  color: z.string().optional().nullable(),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: '缺少标签 ID' })
  }

  try {
    const body = await readBody(event)
    const validated = updateTagSchema.parse(body)

    // 检查是否已存在（排除自己）
    const existing = await prisma.tag.findFirst({
      where: {
        OR: [
          { name: validated.name },
          { slug: validated.slug },
        ],
        NOT: { id: parseInt(id) },
      },
    })

    if (existing) {
      throw createError({
        statusCode: 400,
        message: '标签名称或标识已存在',
      })
    }

    const tag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: {
        name: validated.name,
        slug: validated.slug,
        color: validated.color || null,
      },
    })

    return {
      success: true,
      data: tag,
      message: '标签更新成功',
    }
  } catch (error: any) {
    if (error.statusCode) throw error
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
