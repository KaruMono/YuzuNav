export const useTheme = () => {
  // 初始化时从 DOM 读取当前状态
  const getInitialDark = () => {
    if (import.meta.client) {
      return document.documentElement.classList.contains('dark')
    }
    return false
  }
  
  const isDark = useState<boolean>('theme.isDark', getInitialDark)
  const isTransitioning = useState<boolean>('theme.transitioning', () => false)

  const applyTheme = (dark: boolean) => {
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', dark)
      document.body.classList.toggle('light-bg', !dark)
      document.body.classList.toggle('dark-bg', dark)
    }
  }

  const toggleTheme = () => {
    if (import.meta.client) {
      // 添加过渡动画类
      isTransitioning.value = true
      document.documentElement.classList.add('theme-transitioning')
      
      // 切换主题
      isDark.value = !isDark.value
      localStorage.setItem('color-mode', isDark.value ? 'dark' : 'light')
      applyTheme(isDark.value)
      
      // 动画结束后移除过渡类
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning')
        isTransitioning.value = false
      }, 500)
    }
  }

  const initTheme = () => {
    if (import.meta.client) {
      // 同步状态（插件已经应用了 DOM 类，这里只是同步 Vue 状态）
      isDark.value = document.documentElement.classList.contains('dark')
    }
  }

  return {
    isDark: readonly(isDark),
    isTransitioning: readonly(isTransitioning),
    toggleTheme,
    initTheme,
  }
}
