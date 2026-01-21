import prisma from '~/server/utils/db'
import { z } from 'zod'

const createTagSchema = z.object({
  name: z.string().min(1, '标签名称不能为空'),
  slug: z.string().min(1, '标签标识不能为空'),
  color: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validated = createTagSchema.parse(body)

    // 检查是否已存在
    const existing = await prisma.tag.findFirst({
      where: {
        OR: [
          { name: validated.name },
          { slug: validated.slug },
        ],
      },
    })

    if (existing) {
      throw createError({
        statusCode: 400,
        message: '标签名称或标识已存在',
      })
    }

    const tag = await prisma.tag.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        color: validated.color || null,
      },
    })

    return {
      success: true,
      data: tag,
      message: '标签创建成功',
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
      message: '创建失败：' + error.message,
    })
  }
})
