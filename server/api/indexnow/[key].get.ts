import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, 'key')
  
  if (!key) {
    throw createError({ statusCode: 404 })
  }

  // 移除 .txt 后缀（如果有的话）
  const cleanKey = key.replace(/\.txt$/, '')

  // 从数据库获取 IndexNow API Key
  const setting = await prisma.setting.findUnique({
    where: { key: 'indexnow_api_key' },
  })

  // 如果请求的 key 与配置的 API Key 匹配，返回该 key
  if (setting && setting.value === cleanKey) {
    setHeader(event, 'Content-Type', 'text/plain')
    return cleanKey
  }

  throw createError({ statusCode: 404, message: 'IndexNow 验证文件未找到' })
})
