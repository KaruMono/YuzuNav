import { z } from 'zod'
import { getCurrentUser } from '~/server/utils/jwt'
import prisma from '~/server/utils/db'

const updateSiteSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  richContent: z.string().optional(),
  url: z.string().url().optional(),
  secondUrl: z.string().url().optional().or(z.literal('')),
  logoUrl: z.string().optional().or(z.literal('')), // 支持相对路径和完整 URL
  tagIds: z.array(z.number()).optional(), // 标签ID数组
  categoryId: z.number().int().optional(),
  commentsEnabled: z.boolean().optional(),
  hasAndroidApp: z.boolean().optional(),
  hasIosApp: z.boolean().optional(),
  isNsfw: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

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
      message: '缺少网站 ID',
    })
  }

  try {
    // 检查网站是否存在及权限
    const existingSite = await prisma.site.findUnique({
      where: { id },
    })

    if (!existingSite) {
      throw createError({
        statusCode: 404,
        message: '网站不存在',
      })
    }

    // 只有创建者或管理员可以修改
    if (existingSite.userId !== user.userId && user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: '无权修改此网站',
      })
    }

    const body = await readBody(event)
    const validated = updateSiteSchema.parse(body)

    // 如果更新了分类，检查分类是否存在
    if (validated.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: validated.categoryId },
      })
      if (!category) {
        throw createError({
          statusCode: 400,
          message: '分类不存在',
        })
      }
    }

    // 处理更新数据
    const { tagIds, ...updateFields } = validated
    const updateData: any = { ...updateFields }
    
    if (updateData.logoUrl === '') {
      updateData.logoUrl = null
    }
    if (updateData.secondUrl === '') {
      updateData.secondUrl = null
    }

    // 更新网站基本信息
    const site = await prisma.site.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        tags: {
          include: { tag: true },
        },
      },
    })

    // 如果是管理员且提供了标签，更新标签关联
    if (user.role === 'admin' && tagIds !== undefined) {
      // 删除旧的标签关联
      await prisma.siteTag.deleteMany({
        where: { siteId: id },
      })

      // 创建新的标签关联
      if (tagIds.length > 0) {
        await prisma.siteTag.createMany({
          data: tagIds.map(tagId => ({
            siteId: id,
            tagId,
          })),
        })
      }

      // 重新获取更新后的网站信息
      const updatedSite = await prisma.site.findUnique({
        where: { id },
        include: {
          category: true,
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
          tags: {
            include: { tag: true },
          },
        },
      })

      return {
        success: true,
        data: {
          ...updatedSite,
          tags: updatedSite?.tags.map(t => t.tag) || [],
        },
      }
    }

    return {
      success: true,
      data: {
        ...site,
        tags: site.tags.map(t => t.tag),
      },
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
