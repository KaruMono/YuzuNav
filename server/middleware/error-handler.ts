export default defineEventHandler((event) => {
  // 这个中间件主要用于记录错误日志
  // 实际的错误处理由 Nuxt 的 error.vue 页面处理
  
  event.node.res.on('finish', () => {
    const statusCode = event.node.res.statusCode
    
    // 记录服务器错误
    if (statusCode >= 500) {
      console.error(`[Server Error] ${statusCode} - ${event.path}`)
    }
  })
})
