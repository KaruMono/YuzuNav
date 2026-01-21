export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-token')
  return {
    success: true,
    message: '已退出登录',
  }
})
