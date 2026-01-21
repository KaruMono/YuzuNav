<template>
  <main v-if="site" class="max-w-6xl mx-auto px-4 py-6 sm:py-12">
    <button
      @click="navigateTo('/')"
      class="mb-6 sm:mb-8 flex items-center text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition group text-[10px] sm:text-[11px] uppercase tracking-widest"
    >
      <i class="fas fa-chevron-left mr-2"></i> 返回列表
    </button>

    <!-- NSFW 内容保护提示 -->
    <div v-if="site.isNsfw && nsfwMode === 'sfw'" class="glass-card rounded-xl p-8 sm:p-12 text-center">
      <div class="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
        <i class="fas fa-eye-slash text-4xl text-red-500"></i>
      </div>
      <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-4">内容已隐藏</h2>
      <p class="text-slate-500 dark:text-slate-400 mb-2">
        该网站包含 <span class="text-red-500 font-bold">NSFW</span> 内容
      </p>
      <p class="text-slate-400 text-sm mb-8">
        当前处于 SFW（安全浏览）模式，NSFW 内容已被隐藏。<br>
        如需查看，请点击下方按钮切换到 NSFW 模式或全部模式。
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          @click="setNsfwMode('nsfw')"
          class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm uppercase tracking-wide transition-colors"
        >
          <i class="fas fa-eye mr-2"></i>切换到 NSFW 模式
        </button>
        <button
          @click="setNsfwMode('all')"
          class="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold text-sm uppercase tracking-wide transition-colors"
        >
          <i class="fas fa-glasses mr-2"></i>显示全部内容
        </button>
      </div>
      <p class="text-xs text-slate-400 mt-6">
        <i class="fas fa-info-circle mr-1"></i>
        您的偏好设置将保存在本地浏览器中
      </p>
    </div>

    <!-- 正常内容显示 -->
    <div v-else>
      <!-- NSFW 网站警告提示 -->
      <div v-if="site.isNsfw" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="flex items-center space-x-3">
          <i class="fas fa-exclamation-triangle text-red-500 text-lg"></i>
          <div>
            <p class="text-sm font-bold text-red-700 dark:text-red-400">此网站可能不适合在公共场合浏览</p>
            <p class="text-xs text-red-600 dark:text-red-500 mt-0.5">该网站包含 NSFW（Not Safe For Work）内容，请注意您的浏览环境</p>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col lg:flex-row gap-6 sm:gap-8">
      <!-- 移动端站点信息 -->
      <div class="lg:hidden flex flex-col items-center glass-card rounded-md p-6 text-center">
        <div class="w-20 h-20 bg-white rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center p-4 mb-4 shadow-sm">
          <img
            v-if="site.logoUrl"
            :src="site.logoUrl"
            :alt="site.title"
            class="w-full h-full object-contain"
          />
          <i v-else class="fas fa-globe text-3xl text-slate-400"></i>
        </div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter flex items-center justify-center gap-2">
          <span>{{ site.title }}</span>
          <span v-if="site.isNsfw" class="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold">NSFW</span>
        </h1>
        <div :class="['grid gap-3 w-full mt-6', isAuthenticated && globalFavoritesEnabled ? 'grid-cols-2' : 'grid-cols-1']">
          <NuxtLink
            :to="`/go/${site.id}`"
            class="btn-primary flex items-center justify-center space-x-2 text-white py-3.5 rounded-lg text-sm font-black uppercase tracking-widest"
          >
            <i class="fas fa-paper-plane"></i> <span>访问</span>
          </NuxtLink>
          <button
            v-if="isAuthenticated && globalFavoritesEnabled"
            @click="handleFavorite"
            class="flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white py-3.5 rounded-lg text-sm font-black uppercase tracking-widest"
          >
            <i class="fas fa-star" :class="isFavorited ? 'text-yellow-500' : ''"></i>
            <span>{{ isFavorited ? '已收藏' : '收藏' }}</span>
          </button>
        </div>
      </div>

      <!-- 左侧主内容栏 -->
      <div class="flex-1 space-y-6">
        <!-- 富文本内容区域 -->
        <div class="glass-card rounded-md p-6 sm:p-10">
          <div
            v-if="site.richContent"
            class="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed bbcode-content"
            v-html="parseBBCode(site.richContent)"
          ></div>
          <p v-else class="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            {{ site.description || '暂无详细介绍' }}
          </p>
        </div>

        <!-- 访问统计图表 -->
        <div class="glass-card rounded-md p-6 sm:p-8">
          <h3 class="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">
            最近7天访问统计
          </h3>
          <div class="h-64">
            <div v-if="visitsLoading" class="h-full flex items-center justify-center text-slate-400">
              <i class="fas fa-spinner fa-spin mr-2"></i> 加载中...
            </div>
            <div v-else-if="visitData.days.length === 0" class="h-full flex items-center justify-center text-slate-400">
              <span>暂无访问数据</span>
            </div>
            <div v-else class="h-full flex items-end justify-between gap-2">
              <div
                v-for="(day, index) in visitData.days"
                :key="day"
                class="flex-1 flex flex-col items-center"
              >
                <!-- 柱形图 -->
                <div class="w-full flex gap-1 items-end h-48">
                  <!-- PC 柱 -->
                  <div class="flex-1 relative group flex flex-col justify-end h-full">
                    <div
                      class="w-full bg-blue-500 rounded-t-sm transition-all duration-500 cursor-pointer hover:bg-blue-600"
                      :style="{ height: getBarHeight(visitData.pc[index]) }"
                    ></div>
                    <!-- PC 气泡 -->
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      PC端：{{ visitData.pc[index] }}次
                      <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700"></div>
                    </div>
                  </div>
                  <!-- 移动端柱 -->
                  <div class="flex-1 relative group flex flex-col justify-end h-full">
                    <div
                      class="w-full bg-green-500 rounded-t-sm transition-all duration-500 cursor-pointer hover:bg-green-600"
                      :style="{ height: getBarHeight(visitData.mobile[index]) }"
                    ></div>
                    <!-- 移动端气泡 -->
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      移动端：{{ visitData.mobile[index] }}次
                      <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700"></div>
                    </div>
                  </div>
                </div>
                <!-- 日期标签 -->
                <div class="text-xs text-slate-400 mt-2 font-medium">{{ day }}</div>
              </div>
            </div>
          </div>
          <!-- 图例 -->
          <div class="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-blue-500 rounded"></div>
              <span class="text-sm text-slate-600 dark:text-slate-400">PC端</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-green-500 rounded"></div>
              <span class="text-sm text-slate-600 dark:text-slate-400">移动端</span>
            </div>
          </div>
        </div>

        <!-- 评论区域 -->
        <div v-if="globalCommentsEnabled" class="glass-card rounded-md p-6 sm:p-8">
          <h3 class="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">
            评论 ({{ comments.length }})
          </h3>
          
          <!-- 评论表单 -->
          <div v-if="isAuthenticated && site.commentsEnabled" class="mb-6">
            <textarea
              v-model="newComment"
              class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-md py-3 px-4 text-sm focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 transition-all outline-none resize-none"
              rows="3"
              placeholder="写下你的评论..."
            ></textarea>
            <button
              @click="handleAddComment"
              :disabled="!newComment.trim() || commentLoading"
              class="mt-3 btn-primary text-white px-5 py-2.5 rounded-md font-bold text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {{ commentLoading ? '提交中...' : '发表评论' }}
            </button>
          </div>
          <div v-else-if="!site.commentsEnabled" class="mb-6 text-center text-sm text-slate-500">
            该网站已关闭评论功能
          </div>
          <div v-else class="mb-6 text-center text-sm text-slate-500">
            <NuxtLink to="/login" class="text-slate-900 dark:text-white font-bold hover:underline">
              登录
            </NuxtLink>
            后即可评论
          </div>
          
          <!-- 评论列表 -->
          <div v-if="comments.length === 0" class="text-center text-slate-400 text-sm py-8">
            暂无评论
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-0"
            >
              <div class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-user text-slate-400 text-sm"></i>
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <span class="font-bold text-base text-slate-900 dark:text-white">
                      {{ comment.user?.username || '匿名用户' }}
                    </span>
                    <span class="text-sm text-slate-400">
                      {{ formatDate(comment.createdAt) }}
                    </span>
                  </div>
                  <p class="text-base text-slate-600 dark:text-slate-300">
                    {{ comment.content }}
                  </p>
                  
                  <!-- 回复 -->
                  <div v-if="comment.replies && comment.replies.length > 0" class="mt-3 ml-4 space-y-3">
                    <div
                      v-for="reply in comment.replies"
                      :key="reply.id"
                      class="border-l-2 border-slate-200 dark:border-slate-700 pl-3"
                    >
                      <div class="flex items-center space-x-2 mb-1">
                        <span class="font-bold text-sm text-slate-900 dark:text-white">
                          {{ reply.user?.username || '匿名用户' }}
                        </span>
                        <span class="text-xs text-slate-400">
                          {{ formatDate(reply.createdAt) }}
                        </span>
                      </div>
                      <p class="text-sm text-slate-600 dark:text-slate-300">
                        {{ reply.content }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧栏 (桌面端) -->
      <aside class="w-full lg:w-80 flex-shrink-0 space-y-6">
        <div class="hidden lg:block glass-card rounded-md p-8 text-center">
          <div class="w-24 h-24 mx-auto bg-white rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center p-5 mb-5 shadow-sm">
            <img
              v-if="site.logoUrl"
              :src="site.logoUrl"
              :alt="site.title"
              class="w-full h-full object-contain"
            />
            <i v-else class="fas fa-globe text-4xl text-slate-400"></i>
          </div>
          <h1 class="text-2xl font-black text-slate-900 dark:text-white mb-5 tracking-tighter flex items-center justify-center gap-2">
            <span>{{ site.title }}</span>
            <span v-if="site.isNsfw" class="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold">NSFW</span>
          </h1>
          <div class="space-y-3">
            <NuxtLink
              :to="`/go/${site.id}`"
              class="btn-primary flex items-center justify-center space-x-2 w-full text-white py-3.5 rounded-lg text-sm font-black uppercase tracking-widest shadow-lg"
            >
              <i class="fas fa-paper-plane"></i>
              <span>立即访问</span>
            </NuxtLink>
            <button
              v-if="isAuthenticated && globalFavoritesEnabled"
              @click="handleFavorite"
              class="flex items-center justify-center space-x-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white py-3.5 rounded-lg text-sm font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              <i class="fas fa-star" :class="isFavorited ? 'text-yellow-500' : ''"></i>
              <span>{{ isFavorited ? '已收藏' : '添加收藏' }}</span>
            </button>
          </div>
          <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-left space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm font-bold text-slate-500 uppercase tracking-wide">访问量</span>
              <span class="text-base font-bold text-slate-900 dark:text-slate-200">{{ site.viewCount }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-bold text-slate-500 uppercase tracking-wide">分类</span>
              <span class="text-base font-bold text-slate-900 dark:text-slate-200">{{ site.category?.name }}</span>
            </div>
            <div v-if="site.tags && site.tags.length > 0" class="pt-2">
              <span class="text-sm font-bold text-slate-500 uppercase tracking-wide block mb-2">标签</span>
              <div class="flex flex-wrap gap-2">
                <NuxtLink
                  v-for="tag in site.tags"
                  :key="tag.id"
                  :to="`/tag/${tag.slug}`"
                  class="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {{ tag.name }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
    </div>
  </main>
  <div v-else class="max-w-6xl mx-auto px-4 py-12 text-center">
    <p class="text-slate-400">加载中...</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { isAuthenticated } = useAuth()
const { fetchSite } = useSites()
const { comments, fetchComments, createComment, loading: commentLoading } = useComments()
const { getSiteName, loadSettings } = useSiteSettings()
const { nsfwMode, setNsfwMode, initNsfwMode } = useNsfwMode()

const site = ref<any>(null)

// 加载网站设置
loadSettings()

// SEO - 动态设置页面标题和 meta 标签
// NSFW 网站不输出详细 meta 信息，防止搜索引擎抓取敏感内容
useHead(() => {
  const siteName = getSiteName.value
  
  if (!site.value) {
    return { title: `加载中... - ${siteName}` }
  }
  
  // NSFW 网站使用通用的 meta 信息，不泄露具体内容
  if (site.value.isNsfw) {
    return {
      title: `内容已隐藏 - ${siteName}`,
      meta: [
        { name: 'robots', content: 'noindex, nofollow' }, // 禁止搜索引擎索引
        { name: 'description', content: '该内容需要切换到 NSFW 模式查看' },
      ],
    }
  }
  
  const title = `${site.value.title} - ${siteName}`
  const description = site.value.description || `${site.value.title} - 网站详情与介绍`
  const image = site.value.logoUrl || ''
  const url = site.value.url || ''
  
  return {
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: site.value.tags?.map((t: any) => t.name).join(', ') || site.value.title },
      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      // Twitter Card
      { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ].filter(m => m.content),
  }
})
const newComment = ref('')
const isFavorited = ref(false)
const visitsLoading = ref(true)
const visitData = ref<{ days: string[]; pc: number[]; mobile: number[] }>({
  days: [],
  pc: [],
  mobile: [],
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// BBCode 解析函数
const parseBBCode = (text: string): string => {
  if (!text) return ''
  
  let result = text
    // 转义 HTML 特殊字符（安全处理）
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  // 标题 - 减少间距
  result = result.replace(/\[h1\](.*?)\[\/h1\]/gi, '<h1 class="text-xl font-black mt-4 mb-2">$1</h1>')
  result = result.replace(/\[h2\](.*?)\[\/h2\]/gi, '<h2 class="text-lg font-bold mt-3 mb-1.5">$1</h2>')
  result = result.replace(/\[h3\](.*?)\[\/h3\]/gi, '<h3 class="text-base font-bold mt-2 mb-1">$1</h3>')
  
  // 文字样式
  result = result.replace(/\[b\](.*?)\[\/b\]/gi, '<strong>$1</strong>')
  result = result.replace(/\[i\](.*?)\[\/i\]/gi, '<em>$1</em>')
  result = result.replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>')
  result = result.replace(/\[s\](.*?)\[\/s\]/gi, '<del>$1</del>')
  
  // 颜色和字号
  result = result.replace(/\[color=(#?[a-zA-Z0-9]+)\](.*?)\[\/color\]/gi, '<span style="color: $1">$2</span>')
  result = result.replace(/\[size=(\d+)\](.*?)\[\/size\]/gi, '<span style="font-size: $1px">$2</span>')
  
  // 链接 - 支持各种格式
  result = result.replace(/\[url=([^\]]+)\](.*?)\[\/url\]/gi, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$2</a>')
  result = result.replace(/\[url\]([^\[]+)\[\/url\]/gi, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>')
  
  // 图片
  result = result.replace(/\[img\](https?:\/\/[^\[]+)\[\/img\]/gi, '<img src="$1" alt="image" class="max-w-full h-auto rounded-lg my-4" loading="lazy" />')
  
  // 引用
  result = result.replace(/\[quote\](.*?)\[\/quote\]/gis, '<blockquote class="border-l-4 border-slate-300 dark:border-slate-600 pl-4 py-2 my-4 italic text-slate-600 dark:text-slate-400">$1</blockquote>')
  
  // 代码
  result = result.replace(/\[code\](.*?)\[\/code\]/gis, '<pre class="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm font-mono">$1</code></pre>')
  
  // 有序列表
  result = result.replace(/\[list=1\](.*?)\[\/list\]/gis, (match, content) => {
    const items = content.replace(/\[\*\]/g, '</li><li class="ml-4">').replace(/^<\/li>/, '')
    return `<ol class="list-decimal list-inside my-4 space-y-1">${items}</li></ol>`
  })
  
  // 无序列表
  result = result.replace(/\[list\](.*?)\[\/list\]/gis, (match, content) => {
    const items = content.replace(/\[\*\]/g, '</li><li class="ml-4">').replace(/^<\/li>/, '')
    return `<ul class="list-disc list-inside my-4 space-y-1">${items}</li></ul>`
  })
  
  // 换行
  result = result.replace(/\n/g, '<br />')
  
  return result
}

// 计算柱形图高度
const getBarHeight = (count: number) => {
  if (!count || count === 0) return '4px' // 最小高度显示
  const allCounts = [...visitData.value.pc, ...visitData.value.mobile]
  const maxCount = Math.max(...allCounts, 1)
  const percentage = (count / maxCount) * 100
  return `${Math.max(percentage, 5)}%`
}

const handleAddComment = async () => {
  if (!newComment.value.trim() || !site.value) return
  
  const result = await createComment({
    siteId: site.value.id,
    content: newComment.value,
  })
  
  if (result.success) {
    newComment.value = ''
  }
}

const handleFavorite = async () => {
  if (!site.value) return
  const { toggleFavorite } = useSites()
  const result = await toggleFavorite(site.value.id)
  if (result.success) {
    isFavorited.value = result.favorited
  }
}

// 加载访问统计
const loadVisits = async () => {
  if (!site.value) return
  visitsLoading.value = true
  try {
    const response = await $fetch<{ success: boolean; data: any }>(`/api/sites/${site.value.id}/visits`)
    if (response.success && response.data) {
      visitData.value = {
        days: response.data.days || [],
        pc: response.data.pc || [],
        mobile: response.data.mobile || [],
      }
    }
  } catch (error) {
    console.error('Failed to load visits:', error)
    // 设置默认的空数据
    visitData.value = { days: [], pc: [], mobile: [] }
  } finally {
    visitsLoading.value = false
  }
}

// 记录访问
const recordVisit = async () => {
  if (!site.value) return
  try {
    await $fetch(`/api/sites/${site.value.id}/visit`, { method: 'POST' })
  } catch (error) {
    console.error('Failed to record visit:', error)
  }
}

// 全局评论开关
const globalCommentsEnabled = ref(true)
// 全局收藏夹开关
const globalFavoritesEnabled = ref(true)

const loadGlobalSettings = async () => {
  try {
    const response = await $fetch<{ success: boolean; data: any }>('/api/settings/site')
    if (response.data) {
      globalCommentsEnabled.value = response.data.enableComments !== false
      globalFavoritesEnabled.value = response.data.enableFavorites !== false
    }
  } catch (error) {
    console.error('Failed to load global settings:', error)
  }
}

// 当用户切换 NSFW 模式后，如果现在可以查看内容，加载额外数据
watch(nsfwMode, async (newMode) => {
  if (site.value?.isNsfw && newMode !== 'sfw') {
    // 用户切换到可以查看 NSFW 的模式
    if (visitData.value.days.length === 0) {
      await Promise.all([
        fetchComments(site.value.id),
        loadVisits(),
      ])
      recordVisit()
    }
  }
})

onMounted(async () => {
  // 初始化 NSFW 模式
  initNsfwMode()
  
  const id = route.params.id as string
  
  // 并行加载设置和网站数据
  await Promise.all([
    loadGlobalSettings(),
    (async () => {
      site.value = await fetchSite(id)
      if (site.value) {
        // 设置收藏状态
        isFavorited.value = site.value.isFavorited || false
        
        // 只有在非 NSFW 内容或用户允许查看时才加载额外数据
        if (!site.value.isNsfw || nsfwMode.value !== 'sfw') {
          await Promise.all([
            fetchComments(site.value.id),
            loadVisits(),
          ])
          // 记录访问
          recordVisit()
        }
      }
    })(),
  ])
})
</script>

<style scoped>
.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4),
.prose :deep(h5),
.prose :deep(h6) {
  @apply font-black tracking-tight;
}

.prose :deep(a) {
  @apply text-blue-600 dark:text-blue-400 hover:underline;
}

.prose :deep(img) {
  @apply rounded-lg;
}

.prose :deep(pre) {
  @apply bg-slate-100 dark:bg-slate-800 rounded-lg;
}

.prose :deep(code) {
  @apply bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded;
}
</style>
