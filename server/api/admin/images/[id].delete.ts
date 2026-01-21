import { getCurrentUser } from '~/server/utils/jwt'
import { deleteImage } from '~/server/utils/image'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const user = getCurrentUser(event)
  if (!user || user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: '需要管理员权限',
    })
  }

  const id = event.context.params?.id
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少图片 ID',
    })
  }

  const image = await prisma.image.findUnique({
    where: { id },
  })

  if (!image) {
    throw createError({
      statusCode: 404,
      message: '图片不存在',
    })
  }

  try {
    await deleteImage(image.url)
    return {
      success: true,
      message: '图片已删除',
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: '删除失败：' + error.message,
    })
  }
})
