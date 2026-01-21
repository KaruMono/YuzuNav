<template>
  <main class="max-w-6xl mx-auto px-4 py-6 sm:py-12">
    <!-- 返回按钮 -->
    <button
      @click="navigateTo('/')"
      class="mb-6 sm:mb-8 flex items-center text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition group text-[10px] sm:text-[11px] uppercase tracking-widest"
    >
      <i class="fas fa-chevron-left mr-2"></i> 返回首页
    </button>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-20">
      <i class="fas fa-spinner fa-spin text-2xl text-slate-400"></i>
    </div>

    <!-- 标签信息 -->
    <div v-else-if="tag" class="space-y-8">
      <!-- 标签头部 -->
      <div class="glass-card rounded-xl p-6 sm:p-8">
        <div class="flex items-center space-x-4">
          <div
            class="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
            :style="{ backgroundColor: tag.color || '#6366f1' }"
          >
            <i class="fas fa-tag"></i>
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {{ tag.name }}
            </h1>
            <p class="text-sm text-slate-500 mt-1">
              共 {{ sites.length }} 个网站
            </p>
          </div>
        </div>
      </div>

      <!-- 网站列表 -->
      <div v-if="sites.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="site in sites"
          :key="site.id"
          class="glass-card p-4 rounded-lg cursor-pointer hover:scale-105 transition-transform"
          @click="navigateTo(`/site/${site.id}`)"
        >
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
            </div>
          </div>
          <!-- 标签 -->
          <div v-if="site.tags && site.tags.length > 0" class="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <NuxtLink
              v-for="t in site.tags"
              :key="t.id"
              :to="`/tag/${t.slug}`"
              @click.stop
              class="px-2 py-0.5 text-xs font-medium rounded-full transition-colors"
              :class="t.slug === tag.slug ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'"
            >
              {{ t.name }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-20">
        <i class="fas fa-inbox text-6xl text-slate-300 dark:text-slate-600 mb-6"></i>
        <h2 class="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">暂无网站</h2>
        <p class="text-slate-400 text-sm">该标签下还没有网站</p>
      </div>
    </div>

    <!-- 标签不存在 -->
    <div v-else class="text-center py-20">
      <i class="fas fa-tag text-6xl text-slate-300 dark:text-slate-600 mb-6"></i>
      <h2 class="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">标签不存在</h2>
      <p class="text-slate-400 text-sm mb-6">您访问的标签不存在或已被删除</p>
      <NuxtLink
        to="/"
        class="btn-primary text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider inline-block"
      >
        返回首页
      </NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const { getSiteName, loadSettings } = useSiteSettings()

const loading = ref(true)
const tag = ref<any>(null)
const sites = ref<any[]>([])

// 加载网站设置
loadSettings()

// SEO - 动态设置页面标题和 meta 标签
useHead(() => {
  const siteName = getSiteName.value
  
  if (!tag.value) {
    return { title: `标签 - ${siteName}` }
  }
  
  const title = `${tag.value.name} - 标签 - ${siteName}`
  const description = `浏览 ${tag.value.name} 标签下的 ${sites.value.length} 个网站`
  
  return {
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: `${tag.value.name}, 网站导航, 资源导航` },
      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
  }
})

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

const loadTagSites = async () => {
  loading.value = true
  try {
    const response = await $fetch<{ success: boolean; data: { tag: any; sites: any[] } }>(`/api/tags/${slug}/sites`)
    if (response.success) {
      tag.value = response.data.tag
      sites.value = response.data.sites
    }
  } catch (error) {
    console.error('Failed to load tag sites:', error)
    tag.value = null
    sites.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTagSites()
})

// 监听路由变化
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    loadTagSites()
  }
})
</script>
