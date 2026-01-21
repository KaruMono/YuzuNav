import { getCurrentUser } from '~/server/utils/jwt'
import { cleanupUnusedImages } from '~/server/utils/image'

export default defineEventHandler(async (event) => {
  const user = getCurrentUser(event)
  if (!user || user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: '需要管理员权限',
    })
  }

  try {
    const result = await cleanupUnusedImages()
    
    return {
      success: true,
      message: `已清理 ${result.deleted} 张未使用的图片`,
      deleted: result.deleted,
      errors: result.errors,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: '清理失败：' + error.message,
    })
  }
})
