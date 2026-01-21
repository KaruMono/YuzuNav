<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- 加载中 -->
      <div v-if="loading" class="text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-slate-400 mb-4"></i>
        <p class="text-slate-500">加载中...</p>
      </div>
      
      <!-- 网站不存在 -->
      <div v-else-if="!site" class="glass-card rounded-xl p-8 text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <i class="fas fa-exclamation-triangle text-3xl text-red-500"></i>
        </div>
        <h1 class="text-xl font-black text-slate-900 dark:text-white mb-3">网站不存在</h1>
        <p class="text-slate-500 text-sm mb-6">您访问的网站可能已被删除或不存在</p>
        <NuxtLink
          to="/"
          class="inline-block px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-sm"
        >
          返回首页
        </NuxtLink>
      </div>
      
      <!-- 跳转页面 -->
      <div v-else class="glass-card rounded-xl p-8 text-center">
        <!-- 网站图标 -->
        <div class="w-20 h-20 mx-auto mb-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
          <img
            v-if="site.logoUrl"
            :src="site.logoUrl"
            :alt="site.title"
            class="w-12 h-12 object-contain"
          />
          <i v-else class="fas fa-globe text-3xl text-slate-400"></i>
        </div>
        
        <!-- 提示文字 -->
        <h1 class="text-xl font-black text-slate-900 dark:text-white mb-2">正在前往</h1>
        <p class="text-2xl font-black text-blue-600 dark:text-blue-400 mb-6">{{ site.title }}</p>
        
        <!-- 倒计时 -->
        <div class="mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-3">
            <span class="text-3xl font-black text-blue-600 dark:text-blue-400">{{ countdown }}</span>
          </div>
          <p class="text-slate-500 text-sm">秒后自动跳转...</p>
        </div>
        
        <!-- 进度条 -->
        <div class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
          <div 
            class="h-full bg-blue-500 transition-all duration-1000 ease-linear rounded-full"
            :style="{ width: `${(3 - countdown) / 3 * 100}%` }"
          ></div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex flex-col sm:flex-row gap-3">
          <a
            :href="site.url"
            rel="nofollow noopener noreferrer"
            class="flex-1 btn-primary flex items-center justify-center space-x-2 text-white py-3 rounded-lg font-bold text-sm"
          >
            <i class="fas fa-external-link-alt"></i>
            <span>立即跳转</span>
          </a>
          <NuxtLink
            to="/"
            class="flex-1 flex items-center justify-center space-x-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-lg font-bold text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            <i class="fas fa-home"></i>
            <span>返回首页</span>
          </NuxtLink>
        </div>
        
        <!-- 目标链接 -->
        <p class="mt-6 text-xs text-slate-400 break-all">
          <i class="fas fa-link mr-1"></i>{{ site.url }}
        </p>
      </div>
      
      <!-- 安全提示 -->
      <p class="text-center text-xs text-slate-400 mt-6">
        <i class="fas fa-shield-alt mr-1"></i>
        您即将离开本站，请注意保护个人信息安全
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { getSiteName, loadSettings } = useSiteSettings()

const site = ref<any>(null)
const loading = ref(true)
const countdown = ref(3)

// 加载网站设置
loadSettings()

// SEO - 不让搜索引擎索引跳转页
useHead(() => ({
  title: site.value ? `正在前往 ${site.value.title}` : '跳转中...',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'description', content: '页面跳转中...' },
  ],
}))

// 加载网站信息
const loadSite = async () => {
  const id = route.params.id as string
  try {
    const response = await $fetch<{ success: boolean; data: any }>(`/api/sites/${id}`)
    if (response.success && response.data) {
      site.value = response.data
    }
  } catch (error) {
    console.error('Failed to load site:', error)
  } finally {
    loading.value = false
  }
}

// 开始倒计时
const startCountdown = () => {
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      // 自动跳转
      if (site.value?.url) {
        window.location.href = site.value.url
      }
    }
  }, 1000)
  
  // 组件卸载时清除定时器
  onUnmounted(() => {
    clearInterval(timer)
  })
}

onMounted(async () => {
  await loadSite()
  if (site.value) {
    startCountdown()
  }
})
</script>
