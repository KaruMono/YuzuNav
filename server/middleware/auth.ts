import { getCurrentUser } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  // 只保护需要认证的路由
  const path = event.node.req.url || ''
  
  // 需要管理员权限的路由
  const adminPaths = ['/api/admin']
  const isAdminPath = adminPaths.some(p => path.startsWith(p))
  
  if (isAdminPath) {
    const user = getCurrentUser(event)
    
    if (!user) {
      throw createError({
        statusCode: 401,
        message: '需要登录',
      })
    }
    
    if (user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: '需要管理员权限',
      })
    }
    
    // 将用户信息附加到 event context
    event.context.user = user
  }
})
