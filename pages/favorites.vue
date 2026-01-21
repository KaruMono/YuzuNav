<template>
  <main class="max-w-6xl mx-auto px-4 py-6 sm:py-12">
    <div class="flex items-center space-x-3 mb-8">
      <i class="fas fa-star text-2xl text-yellow-500"></i>
      <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">我的收藏</h1>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-20">
      <i class="fas fa-spinner fa-spin text-2xl text-slate-400"></i>
    </div>

    <!-- 未登录 -->
    <div v-else-if="!isAuthenticated" class="text-center py-20">
      <i class="fas fa-lock text-6xl text-slate-300 dark:text-slate-600 mb-6"></i>
      <h2 class="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">请先登录</h2>
      <p class="text-slate-400 text-sm mb-6">登录后即可查看您收藏的网站</p>
      <NuxtLink
        to="/login"
        class="btn-primary text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider inline-block"
      >
        立即登录
      </NuxtLink>
    </div>

    <!-- 空状态 -->
    <div v-else-if="favorites.length === 0" class="text-center py-20">
      <i class="fas fa-star text-6xl text-slate-300 dark:text-slate-600 mb-6"></i>
      <h2 class="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">还没有收藏</h2>
      <p class="text-slate-400 text-sm mb-6">浏览网站并点击收藏按钮添加到这里</p>
      <NuxtLink
        to="/"
        class="btn-primary text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider inline-block"
      >
        浏览网站
      </NuxtLink>
    </div>

    <!-- 收藏列表 -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="site in favorites"
        :key="site.id"
        class="glass-card p-4 rounded-lg cursor-pointer hover:scale-105 transition-transform relative group"
        @click="navigateTo(`/site/${site.id}`)"
      >
        <!-- 取消收藏按钮 -->
        <button
          @click.stop="handleRemoveFavorite(site.id)"
          class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/30"
          title="取消收藏"
        >
          <i class="fas fa-times text-sm text-slate-400 hover:text-red-500"></i>
        </button>

        <div class="flex items-center space-x-4">
          <div class="w-14 h-14 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img
              v-if="site.logoUrl"
              :src="site.logoUrl"
              :alt="site.title"
              class="w-8 h-8 object-contain"
            />
            <i v-else class="fas fa-globe text-xl text-slate-400"></i>
          </div>
          <div class="overflow-hidden flex-1">
            <h3 class="font-bold text-slate-900 dark:text-white text-base truncate">{{ site.title }}</h3>
            <p class="text-xs text-slate-400 truncate mt-1">
              {{ site.description || getDomain(site.url) }}
            </p>
            <div class="flex items-center space-x-2 mt-2">
              <span class="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                {{ site.category?.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuth()
const { toggleFavorite } = useSites()
const { getSiteName, loadSettings } = useSiteSettings()

const favorites = ref<any[]>([])
const loading = ref(true)

// 加载网站设置
loadSettings()

// SEO
useHead(() => ({
  title: `我的收藏 - ${getSiteName.value}`,
  meta: [
    { name: 'description', content: '查看我收藏的网站列表' },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
}))

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

const loadFavorites = async () => {
  if (!isAuthenticated.value) {
    loading.value = false
    return
  }

  try {
    const response = await $fetch<{ success: boolean; data: any[] }>('/api/sites/favorites')
    favorites.value = response.data || []
  } catch (error) {
    console.error('Failed to load favorites:', error)
  } finally {
    loading.value = false
  }
}

const handleRemoveFavorite = async (siteId: string) => {
  const result = await toggleFavorite(siteId)
  if (result.success && !result.favorited) {
    favorites.value = favorites.value.filter(s => s.id !== siteId)
  }
}

onMounted(() => {
  loadFavorites()
})
</script>
