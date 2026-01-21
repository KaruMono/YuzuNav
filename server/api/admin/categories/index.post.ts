import { z } from 'zod'
import prisma from '~/server/utils/db'

const createCategorySchema = z.object({
  name: z.string().min(1, '分类名称不能为空'),
  slug: z.string().min(1, '分类标识不能为空'),
  icon: z.string().optional(),
  parentId: z.number().int().nullable().optional(),
  sortOrder: z.number().int().default(0),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validated = createCategorySchema.parse(body)

    // 检查 slug 是否已存在
    const existing = await prisma.category.findUnique({
      where: { slug: validated.slug },
    })

    if (existing) {
      throw createError({
        statusCode: 400,
        message: '该分类标识已存在',
      })
    }

    const category = await prisma.category.create({
      data: validated,
    })

    return {
      success: true,
      data: category,
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
      message: '创建失败：' + error.message,
    })
  }
})
