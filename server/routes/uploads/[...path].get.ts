import { createReadStream, existsSync, statSync } from 'fs'
import { join } from 'path'
import { sendStream, setResponseHeaders, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  
  if (!path) {
    throw createError({
      statusCode: 400,
      message: 'Path is required',
    })
  }

  // 安全检查：防止路径遍历攻击
  if (path.includes('..') || path.includes('//')) {
    throw createError({
      statusCode: 400,
      message: 'Invalid path',
    })
  }

  // 构建文件路径
  const filePath = join(process.cwd(), 'uploads', path)

  // 检查文件是否存在
  if (!existsSync(filePath)) {
    throw createError({
      statusCode: 404,
      message: 'File not found',
    })
  }

  // 获取文件信息
  const stat = statSync(filePath)
  if (!stat.isFile()) {
    throw createError({
      statusCode: 404,
      message: 'Not a file',
    })
  }

  // 根据扩展名设置 Content-Type
  const ext = path.split('.').pop()?.toLowerCase() || ''
  const mimeTypes: Record<string, string> = {
    'ico': 'image/x-icon',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
  }

  const contentType = mimeTypes[ext] || 'application/octet-stream'

  // 设置响应头
  setResponseHeaders(event, {
    'Content-Type': contentType,
    'Content-Length': stat.size.toString(),
    'Cache-Control': 'public, max-age=604800', // 7天缓存
  })

  // 返回文件流
  return sendStream(event, createReadStream(filePath))
})
