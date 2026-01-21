export default defineNuxtPlugin(() => {
  // 在客户端立即初始化主题（head script 已经设置了 html.dark 类）
  // 这里只需要设置 body 的背景类
  const isDark = document.documentElement.classList.contains('dark')
  
  // 设置 body 背景类
  document.body.classList.add(isDark ? 'dark-bg' : 'light-bg')
  document.body.classList.remove(isDark ? 'light-bg' : 'dark-bg')
})
