import { z } from 'zod'
import prisma from '~/server/utils/db'

const updateCategorySchema = z.object({
  name: z.string().min(1, '分类名称不能为空').optional(),
  slug: z.string().min(1, '分类标识不能为空').optional(),
  icon: z.string().optional(),
  parentId: z.number().int().nullable().optional(),
  sortOrder: z.number().int().optional(),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少分类 ID',
    })
  }

  try {
    const body = await readBody(event)
    const validated = updateCategorySchema.parse(body)

    // 检查分类是否存在
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    })

    if (!existingCategory) {
      throw createError({
        statusCode: 404,
        message: '分类不存在',
      })
    }

    // 如果要更新 slug，检查是否与其他分类冲突
    if (validated.slug && validated.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: validated.slug },
      })

      if (slugExists) {
        throw createError({
          statusCode: 400,
          message: '该分类标识已存在',
        })
      }
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
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
      message: '更新失败：' + error.message,
    })
  }
})
