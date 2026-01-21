// NSFW 模式管理
// 模式: sfw (只显示SFW), nsfw (只显示NSFW), all (显示全部)
export type NsfwMode = 'sfw' | 'nsfw' | 'all'

const STORAGE_KEY = 'nsfw_mode'

// 全局状态
const nsfwMode = ref<NsfwMode>('sfw')
const isInitialized = ref(false)

export function useNsfwMode() {
  // 初始化模式（从 localStorage 读取）
  const initNsfwMode = () => {
    if (isInitialized.value) return
    
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as NsfwMode | null
      // 默认为 SFW 模式，保护新用户
      nsfwMode.value = stored && ['sfw', 'nsfw', 'all'].includes(stored) ? stored : 'sfw'
    }
    isInitialized.value = true
  }
  
  // 设置模式
  const setNsfwMode = (mode: NsfwMode) => {
    nsfwMode.value = mode
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, mode)
    }
  }
  
  // 切换到下一个模式
  const cycleNsfwMode = () => {
    const modes: NsfwMode[] = ['sfw', 'nsfw', 'all']
    const currentIndex = modes.indexOf(nsfwMode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    setNsfwMode(modes[nextIndex])
  }
  
  // 获取模式显示文本
  const getModeLabel = computed(() => {
    switch (nsfwMode.value) {
      case 'sfw':
        return 'SFW 模式'
      case 'nsfw':
        return 'NSFW 模式'
      case 'all':
        return '显示全部'
      default:
        return 'SFW 模式'
    }
  })
  
  // 获取模式图标
  const getModeIcon = computed(() => {
    switch (nsfwMode.value) {
      case 'sfw':
        return 'fas fa-eye-slash' // SFW 模式 - 隐藏 NSFW
      case 'nsfw':
        return 'fas fa-eye' // NSFW 模式 - 只看 NSFW
      case 'all':
        return 'fas fa-glasses' // 全部模式 - 眼镜
      default:
        return 'fas fa-eye-slash'
    }
  })
  
  // 检查网站是否应该显示
  const shouldShowSite = (isNsfw: boolean) => {
    switch (nsfwMode.value) {
      case 'sfw':
        return !isNsfw
      case 'nsfw':
        return isNsfw
      case 'all':
        return true
      default:
        return !isNsfw
    }
  }
  
  return {
    nsfwMode: readonly(nsfwMode),
    isInitialized: readonly(isInitialized),
    initNsfwMode,
    setNsfwMode,
    cycleNsfwMode,
    getModeLabel,
    getModeIcon,
    shouldShowSite,
  }
}
