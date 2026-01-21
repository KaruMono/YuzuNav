export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()

  // 需要登录的页面
  const protectedRoutes = ['/admin']
  const isProtected = protectedRoutes.some(route => to.path.startsWith(route))

  if (isProtected && !isAuthenticated.value) {
    return navigateTo('/login')
  }
})
