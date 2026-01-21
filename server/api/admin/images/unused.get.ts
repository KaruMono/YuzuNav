import { getCurrentUser } from '~/server/utils/jwt'
import { getUnusedImages } from '~/server/utils/image'

export default defineEventHandler(async (event) => {
  const user = getCurrentUser(event)
  if (!user || user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: '需要管理员权限',
    })
  }

  try {
    const unusedImages = await getUnusedImages()
    
    // 计算总大小
    const totalSize = unusedImages.reduce((sum, img) => sum + img.size, 0)
    
    return {
      success: true,
      data: unusedImages,
      stats: {
        count: unusedImages.length,
        totalSize,
      },
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: '获取未使用图片失败：' + error.message,
    })
  }
})
