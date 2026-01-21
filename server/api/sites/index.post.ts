import { z } from 'zod'
import { getCurrentUser } from '~/server/utils/jwt'
import prisma from '~/server/utils/db'
import { submitSiteToIndexNow } from '~/server/utils/indexnow'

const createSiteSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  richContent: z.string().optional(),
  url: z.string().url('无效的 URL'),
  secondUrl: z.string().url('无效的 URL').optional().or(z.literal('')),
  logoUrl: z.string().optional().or(z.literal('')), // 支持相对路径和完整 URL
  tagIds: z.array(z.number()).optional(), // 标签ID数组（仅管理员可用）
  categoryId: z.number().int('无效的分类 ID'),
  commentsEnabled: z.boolean().optional().default(true),
  hasAndroidApp: z.boolean().optional().default(false),
  hasIosApp: z.boolean().optional().default(false),
  isNsfw: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
})

export default defineEventHandler(async (event) => {
  const user = getCurrentUser(event)
  
  // 检查是否允许访客投稿
  if (!user) {
    const guestSubmitSetting = await prisma.setting.findUnique({
      where: { key: 'allowGuestSubmit' },
    })
    if (!guestSubmitSetting || guestSubmitSetting.value !== 'true') {
    throw createError({
      statusCode: 401,
        message: '需要登录才能投稿',
    })
    }
  }

  try {
    const body = await readBody(event)
    const validated = createSiteSchema.parse(body)

    // 检查分类是否存在
    const category = await prisma.category.findUnique({
      where: { id: validated.categoryId },
    })

    if (!category) {
      throw createError({
        statusCode: 400,
        message: '分类不存在',
      })
    }

    // 创建网站
    const site = await prisma.site.create({
      data: {
        title: validated.title,
        description: validated.description,
        richContent: validated.richContent || null,
        url: validated.url,
        secondUrl: validated.secondUrl || null,
        logoUrl: validated.logoUrl || null,
        categoryId: validated.categoryId,
        userId: user?.userId || null,
        status: user?.role === 'admin' ? 'approved' : 'pending', // 管理员直接通过，访客需审核
        commentsEnabled: validated.commentsEnabled ?? true,
        hasAndroidApp: validated.hasAndroidApp ?? false,
        hasIosApp: validated.hasIosApp ?? false,
        isNsfw: validated.isNsfw ?? false,
        sortOrder: validated.sortOrder ?? 0,
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    })

    // 如果是管理员且提供了标签，创建标签关联
    if (user?.role === 'admin' && validated.tagIds && validated.tagIds.length > 0) {
      await prisma.siteTag.createMany({
        data: validated.tagIds.map(tagId => ({
          siteId: site.id,
          tagId,
        })),
      })
    }

    // 如果是管理员创建的网站（直接通过）且不是 NSFW，提交到 IndexNow
    if (site.status === 'approved' && !site.isNsfw) {
      const indexNowResult = await submitSiteToIndexNow(site.id)
      console.log('[Create] IndexNow 提交结果:', indexNowResult)
    }

    return {
      success: true,
      data: site,
      message: site.status === 'approved' ? '网站创建成功' : '网站提交成功，等待审核',
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
