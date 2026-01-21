import { getCurrentUser } from '~/server/utils/jwt'
import prisma from '~/server/utils/db'
import { deleteFromS3 } from '~/server/utils/s3'

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
    const site = await prisma.site.findUnique({
      where: { id },
    })

    if (!site) {
      throw createError({
        statusCode: 404,
        message: '网站不存在',
      })
    }

    // 只有创建者或管理员可以删除
    if (site.userId !== user.userId && user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: '无权删除此网站',
      })
    }

    // 如果存在 logo，删除 S3 文件
    if (site.logoUrl) {
      try {
        await deleteFromS3(site.logoUrl)
      } catch (s3Error) {
        console.error('删除 S3 文件失败:', s3Error)
        // 继续删除数据库记录
      }
    }

    // 删除网站
    await prisma.site.delete({
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
