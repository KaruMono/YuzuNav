import { getCurrentUser } from '~/server/utils/jwt'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const user = getCurrentUser(event)
  if (!user || user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: '需要管理员权限',
    })
  }

  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 20
  const usageType = query.usageType as string | undefined
  const storageType = query.storageType as string | undefined

  const where: any = {}
  if (usageType) {
    where.usageType = usageType
  }
  if (storageType) {
    where.storageType = storageType
  }

  const [images, total] = await Promise.all([
    prisma.image.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.image.count({ where }),
  ])

  // 计算总大小
  const totalSize = await prisma.image.aggregate({
    where,
    _sum: { size: true },
  })

  return {
    success: true,
    data: images,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    stats: {
      totalSize: totalSize._sum.size || 0,
    },
  }
})
