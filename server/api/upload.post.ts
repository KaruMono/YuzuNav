import { getCurrentUser } from '~/server/utils/jwt'
import { uploadImage } from '~/server/utils/image'

export default defineEventHandler(async (event) => {
  // 检查认证
  const user = getCurrentUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: '需要登录',
    })
  }

  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: '没有上传文件',
      })
    }

    const file = formData[0]
    if (!file.data || !file.filename) {
      throw createError({
        statusCode: 400,
        message: '无效的文件',
      })
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/x-icon']
    if (file.type && !allowedTypes.includes(file.type)) {
      throw createError({
        statusCode: 400,
        message: '不支持的文件类型，仅支持图片格式',
      })
    }

    // 检查文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.data.length > maxSize) {
      throw createError({
        statusCode: 400,
        message: '文件大小不能超过 5MB',
      })
    }

    // 获取用途类型（从查询参数或默认值）
    const query = getQuery(event)
    const usageType = (query.usageType as string) || 'other'
    const usageId = query.usageId as string | undefined

    // 上传图片（自动转换 PNG 为 WebP，并记录到数据库）
    const result = await uploadImage({
      file: file.data,
      filename: file.filename,
      contentType: file.type || 'application/octet-stream',
      usageType: usageType as any,
      usageId,
      userId: user.id,
    })

    return {
      success: true,
      url: result.url,
      filename: result.filename,
      size: result.size,
      mimeType: result.mimeType,
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: '上传失败：' + error.message,
    })
  }
})
