<template>
  <header class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
    <div class="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
      <!-- 移动端：汉堡菜单按钮 -->
      <button
        v-if="isHomePage"
        @click="toggleMenu"
        class="lg:hidden w-10 h-10 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        aria-label="打开菜单"
      >
        <i class="fas fa-bars text-lg text-slate-700 dark:text-slate-300"></i>
      </button>
      
      <!-- 桌面端 & 非首页：网站图标和名称 -->
      <NuxtLink to="/" :class="['flex items-center space-x-2 sm:space-x-3 cursor-pointer min-w-0', isHomePage ? 'hidden lg:flex' : 'flex']">
        <!-- 图标 - 固定尺寸避免加载时位移 -->
        <div class="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0">
          <div
            v-if="siteSettings.siteIconType === 'image' && siteSettings.siteLogoUrl"
            class="w-full h-full rounded-md overflow-hidden shadow-md"
          >
            <img :src="siteSettings.siteLogoUrl" alt="Logo" class="w-full h-full object-cover" />
          </div>
          <div
            v-else
            class="w-full h-full rounded-md flex items-center justify-center text-white text-base sm:text-lg font-bold shadow-md"
            :style="{ backgroundColor: siteSettings.siteIconColor || '#1e293b' }"
          >
            <i v-if="siteSettings.siteIconType === 'fa' && siteSettings.siteIcon" :class="siteSettings.siteIcon"></i>
            <span v-else>{{ displayIcon }}</span>
          </div>
        </div>
        <!-- 名称 -->
        <span class="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase whitespace-nowrap">
          {{ siteSettings.siteName || 'YuzuNav' }}<span v-if="siteSettings.siteSubtitle" class="text-slate-400">{{ siteSettings.siteSubtitle }}</span>
        </span>
      </NuxtLink>

      <div class="flex-1 max-w-md mx-4 sm:mx-12 hidden lg:block">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索网站..."
            class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-md py-2 px-10 text-xs focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 transition-all outline-none"
            @keyup.enter="handleSearch"
          />
          <i class="fas fa-search absolute left-3.5 top-2.5 text-slate-400 text-xs"></i>
        </div>
      </div>

      <nav class="flex items-center space-x-1 sm:space-x-2">
        <!-- 收藏按钮 -->
        <NuxtLink
          v-if="isAuthenticated && siteSettings.enableFavorites"
          to="/favorites"
          class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          title="我的收藏"
        >
          <i class="fas fa-heart text-base text-pink-500"></i>
        </NuxtLink>

        <!-- NSFW 模式切换 -->
        <div class="relative" @mouseenter="showNsfwMenu = true" @mouseleave="showNsfwMenu = false">
          <button
            class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            :title="getModeLabel"
            :aria-label="getModeLabel"
          >
            <i :class="[getModeIcon, 'text-base', nsfwModeColors]"></i>
          </button>
          
          <!-- NSFW 模式下拉菜单 -->
          <Transition name="dropdown">
            <div
              v-if="showNsfwMenu"
              class="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
            >
              <div class="py-1">
                <button
                  @click="setNsfwMode('sfw'); showNsfwMenu = false"
                  :class="[
                    'w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors',
                    nsfwMode === 'sfw' 
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  ]"
                >
                  <i class="fas fa-eye-slash w-4 text-center"></i>
                  <span>SFW 模式</span>
                  <i v-if="nsfwMode === 'sfw'" class="fas fa-check ml-auto text-green-500"></i>
                </button>
                <button
                  @click="setNsfwMode('nsfw'); showNsfwMenu = false"
                  :class="[
                    'w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors',
                    nsfwMode === 'nsfw' 
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  ]"
                >
                  <i class="fas fa-eye w-4 text-center"></i>
                  <span>NSFW 模式</span>
                  <i v-if="nsfwMode === 'nsfw'" class="fas fa-check ml-auto text-red-500"></i>
                </button>
                <button
                  @click="setNsfwMode('all'); showNsfwMenu = false"
                  :class="[
                    'w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors',
                    nsfwMode === 'all' 
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  ]"
                >
                  <i class="fas fa-glasses w-4 text-center"></i>
                  <span>显示全部</span>
                  <i v-if="nsfwMode === 'all'" class="fas fa-check ml-auto text-purple-500"></i>
                </button>
              </div>
              <div class="px-4 py-2 border-t border-slate-100 dark:border-slate-700">
                <p class="text-xs text-slate-400">默认隐藏 NSFW 内容</p>
              </div>
            </div>
          </Transition>
        </div>

        <!-- 主题切换 -->
        <button
          @click="handleToggleTheme"
          class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors overflow-hidden"
        >
          <Transition name="theme-icon" mode="out-in">
            <i v-if="isDark" key="moon" class="fas fa-moon text-base text-indigo-400"></i>
            <i v-else key="sun" class="fas fa-sun text-base text-amber-500"></i>
          </Transition>
        </button>

        <template v-if="isAuthenticated">
          <!-- 移动端：简化按钮 -->
          <div class="lg:hidden flex items-center space-x-1">
            <NuxtLink
              v-if="isAdmin"
              to="/admin"
              class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="管理控制台"
            >
              <i class="fas fa-user-gear text-base text-slate-600 dark:text-slate-400"></i>
            </NuxtLink>
            <button
              @click="handleLogout"
              class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="退出登录"
            >
              <i class="fas fa-sign-out-alt text-base text-slate-600 dark:text-slate-400"></i>
            </button>
          </div>
          
          <!-- 桌面端：用户头像下拉菜单 -->
          <div class="hidden lg:block relative" @mouseenter="showUserMenu = true" @mouseleave="showUserMenu = false">
            <div class="flex items-center space-x-2 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <!-- 用户头像 -->
              <div class="w-8 h-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <img
                  v-if="userInfo.avatarUrl"
                  :src="userInfo.avatarUrl"
                  alt="头像"
                  class="w-full h-full object-cover"
                />
                <i v-else class="fas fa-user text-slate-400 dark:text-slate-500"></i>
              </div>
              <!-- 用户昵称 -->
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                {{ userInfo.username || userInfo.email?.split('@')[0] || '用户' }}
              </span>
              <i class="fas fa-chevron-down text-xs text-slate-400 transition-transform" :class="{ 'rotate-180': showUserMenu }"></i>
            </div>
            
            <!-- 下拉菜单 -->
            <Transition name="dropdown">
              <div
                v-if="showUserMenu"
                class="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
              >
                <!-- 用户信息 -->
                <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <img
                        v-if="userInfo.avatarUrl"
                        :src="userInfo.avatarUrl"
                        alt="头像"
                        class="w-full h-full object-cover"
                      />
                      <i v-else class="fas fa-user text-slate-400 dark:text-slate-500"></i>
                    </div>
                    <div class="min-w-0">
                      <div class="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {{ userInfo.username || '未设置昵称' }}
                      </div>
                      <div class="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {{ userInfo.email }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 菜单项 -->
                <div class="py-1">
                  <NuxtLink
                    v-if="isAdmin"
                    to="/admin"
                    class="flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <i class="fas fa-user-gear w-4 text-center text-slate-400"></i>
                    <span>管理控制台</span>
                  </NuxtLink>
                  <button
                    @click="handleLogout"
                    class="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <i class="fas fa-sign-out-alt w-4 text-center"></i>
                    <span>退出登录</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </template>
        <template v-else>
          <NuxtLink
            to="/login"
            class="btn-primary text-white px-3 sm:px-4 py-2 rounded-md font-bold text-[10px] sm:text-xs uppercase tracking-wider"
          >
            登录
          </NuxtLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const { isAuthenticated, isAdmin, logout, user } = useAuth()
const { toggleMenu } = useMobileMenu()
const { isDark, toggleTheme, initTheme } = useTheme()
const { nsfwMode, setNsfwMode, getModeLabel, getModeIcon, initNsfwMode } = useNsfwMode()
const searchQuery = ref('')
const showUserMenu = ref(false)
const showNsfwMenu = ref(false)

// NSFW 模式图标颜色
const nsfwModeColors = computed(() => {
  switch (nsfwMode.value) {
    case 'sfw':
      return 'text-green-500'
    case 'nsfw':
      return 'text-red-500'
    case 'all':
      return 'text-purple-500'
    default:
      return 'text-slate-500'
  }
})

// 判断是否在首页
const isHomePage = computed(() => route.path === '/')

// 用户信息
const userInfo = ref({
  username: '',
  email: '',
  avatarUrl: '',
})

const siteSettings = ref({
  siteName: 'YuzuNav',
  siteSubtitle: '',
  siteIcon: '',
  siteIconType: 'text',
  siteIconColor: '#1e293b',
  siteLogoUrl: '',
  enableFavorites: true,
})

// 计算显示的图标文字（取名称第一个字符）
const displayIcon = computed(() => {
  const name = siteSettings.value.siteName || 'Y'
  return name.charAt(0).toUpperCase()
})

const loadSiteSettings = async () => {
  try {
    const response = await $fetch<{ success: boolean; data: any }>('/api/settings/site')
    if (response.data) {
      siteSettings.value = { ...siteSettings.value, ...response.data }
    }
  } catch (error) {
    console.error('Failed to load site settings:', error)
  }
}

const loadUserInfo = async () => {
  if (!isAuthenticated.value) return
  try {
    const response = await $fetch<{ user: any }>('/api/auth/me')
    if (response.user) {
      userInfo.value = {
        username: response.user.username || '',
        email: response.user.email || '',
        avatarUrl: response.user.avatarUrl || '',
      }
    }
  } catch (error) {
    console.error('Failed to load user info:', error)
  }
}

const handleToggleTheme = () => {
  toggleTheme()
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/?search=${encodeURIComponent(searchQuery.value)}`)
  }
}

const handleLogout = async () => {
  showUserMenu.value = false
  await logout()
  navigateTo('/')
}

onMounted(() => {
  initTheme()
  initNsfwMode()
  loadSiteSettings()
  loadUserInfo()
})

// 监听登录状态变化
watch(isAuthenticated, (newVal) => {
  if (newVal) {
    loadUserInfo()
  } else {
    userInfo.value = { username: '', email: '', avatarUrl: '' }
  }
})
</script>
