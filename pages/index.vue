<template>
  <main class="max-w-[1600px] mx-auto px-4 py-6 sm:py-10">
    <!-- 移动端侧边栏抽屉 -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 lg:hidden">
          <!-- 遮罩层 -->
          <div class="absolute inset-0 bg-black/50" @click="closeMenu()"></div>
          <!-- 抽屉内容 -->
          <div class="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 shadow-xl flex flex-col">
            <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span class="font-bold text-slate-900 dark:text-white">分类导航</span>
              <button @click="closeMenu()" class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                <i class="fas fa-times text-slate-500"></i>
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-3 space-y-1">
              <template v-for="category in categories" :key="category.id">
                <!-- 顶级分类 -->
                <div class="space-y-0.5 transition-all duration-300">
                  <a
                    :href="`#${category.slug}`"
                    :class="[
                      'flex items-center justify-between px-4 py-3 rounded-md transition font-bold text-sm',
                      activeCategory === category.id
                        ? 'nav-item-active'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    ]"
                    @click.prevent="handleMobileCategoryClick(category)"
                  >
                    <div class="flex items-center space-x-3">
                      <i :class="[category.icon || 'fas fa-folder', 'text-base w-5 text-center']"></i>
                      <span>{{ category.name }}</span>
                    </div>
                    <i
                      v-if="category.children?.length"
                      :class="[
                        'fas fa-chevron-right text-xs text-slate-400 transition-transform duration-300',
                        expandedCategories.includes(category.id) ? 'rotate-90' : ''
                      ]"
                    ></i>
                  </a>
                  <!-- 子分类 - 带展开动画 -->
                  <div 
                    v-if="category.children?.length"
                    class="grid transition-all duration-300 ease-out"
                    :class="expandedCategories.includes(category.id) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
                  >
                    <div class="overflow-hidden pl-4 space-y-0.5">
                      <a
                        v-for="child in category.children"
                        :key="child.id"
                        :href="`#${child.slug}`"
                        :class="[
                          'flex items-center space-x-3 px-4 py-2 rounded-md transition text-sm',
                          activeCategory === child.id
                            ? 'nav-item-active'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-500'
                        ]"
                        @click.prevent="scrollToCategory(child.slug); closeMenu()"
                      >
                        <i :class="[child.icon || 'fas fa-folder', 'text-sm w-4 text-center']"></i>
                        <span>{{ child.name }}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div class="p-3 border-t border-slate-200 dark:border-slate-700">
              <NuxtLink
                to="/submit"
                @click="closeMenu()"
                class="flex px-4 py-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 items-center justify-center space-x-2 font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                <i class="fas fa-paper-plane"></i>
                <span>投稿网站</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <div class="flex flex-col lg:flex-row gap-6 sm:gap-8">
      <!-- 左侧边栏导航 - 桌面端 -->
      <aside v-if="categories.length > 0" class="hidden lg:block lg:w-52 flex-shrink-0">
        <div class="flex flex-col fixed top-24 w-52 h-[calc(100vh-8rem)] gap-1.5">
          <div class="flex flex-col gap-0.5 flex-1 overflow-y-auto hide-scrollbar">
            <template v-for="category in categories" :key="category.id">
              <!-- 顶级分类 -->
              <div class="space-y-0.5 transition-all duration-300">
                <a
                  :href="`#${category.slug}`"
                  :class="[
                    'whitespace-nowrap px-4 py-2.5 rounded-md flex items-center justify-between transition font-bold text-sm',
                    activeCategory === category.id
                      ? 'nav-item-active'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  ]"
                  @click.prevent="handleCategoryClick(category)"
                >
                  <div class="flex items-center space-x-3">
                    <i :class="[category.icon || 'fas fa-folder', 'text-base w-5 text-center']"></i>
                    <span>{{ category.name }}</span>
                  </div>
                  <i
                    v-if="category.children?.length"
                    :class="[
                      'fas fa-chevron-right text-xs text-slate-400 transition-transform duration-300',
                      expandedCategories.includes(category.id) ? 'rotate-90' : ''
                    ]"
                  ></i>
                </a>
                <!-- 子分类 - 带展开动画 -->
                <div 
                  v-if="category.children?.length"
                  class="grid transition-all duration-300 ease-out"
                  :class="expandedCategories.includes(category.id) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
                >
                  <div class="overflow-hidden pl-4 space-y-0.5">
                    <a
                      v-for="child in category.children"
                      :key="child.id"
                      :href="`#${child.slug}`"
                      :class="[
                        'whitespace-nowrap px-3 py-2 rounded-md flex items-center space-x-2 transition text-sm',
                        activeCategory === child.id
                          ? 'nav-item-active'
                          : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                      ]"
                      @click.prevent="scrollToCategory(child.slug)"
                    >
                      <i :class="[child.icon || 'fas fa-folder', 'text-sm w-4 text-center']"></i>
                      <span>{{ child.name }}</span>
                    </a>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- 投稿按钮 - 固定在底部 -->
          <NuxtLink
            to="/submit"
            class="flex mt-auto px-4 py-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 items-center space-x-3 font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <i class="fas fa-paper-plane text-base w-5 text-center"></i>
            <span>投稿网站</span>
          </NuxtLink>
        </div>
      </aside>

      <!-- 主列表区 -->
      <div class="flex-1 min-w-0 space-y-8 sm:space-y-10">
        <!-- 搜索结果 -->
        <div v-if="isSearching">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-1.5 h-5 bg-blue-500 rounded-full"></div>
            <h2 class="text-lg font-black tracking-tighter uppercase">搜索结果</h2>
            <span class="text-sm text-slate-400">找到 {{ searchResults.length }} 个结果</span>
            <button @click="navigateTo('/')" class="ml-auto text-sm text-blue-500 hover:underline">
              <i class="fas fa-times mr-1"></i>清除搜索
            </button>
          </div>
          <div v-if="searchResults.length === 0" class="text-center py-12">
            <i class="fas fa-search text-4xl text-slate-300 dark:text-slate-600 mb-4"></i>
            <p class="text-slate-500">没有找到匹配 "{{ searchQuery }}" 的结果</p>
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-4">
            <div
              v-for="site in searchResults"
              :key="site.id"
              class="glass-card p-3 rounded-lg cursor-pointer hover:scale-105 transition-transform"
              @click="navigateTo(`/site/${site.id}`)"
            >
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img v-if="site.logoUrl" :src="site.logoUrl" :alt="site.title" class="w-7 h-7 object-contain" loading="lazy" />
                  <i v-else class="fas fa-globe text-slate-400"></i>
                </div>
                <div class="overflow-hidden flex-1">
                  <h3 class="font-bold text-slate-900 dark:text-white text-sm truncate flex items-center gap-1">
                    <span class="truncate">{{ site.title }}</span>
                    <span v-if="site.isNsfw" class="text-[9px] px-1 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold flex-shrink-0">NSFW</span>
                    <i v-if="site.hasAndroidApp" class="fab fa-android text-green-500 text-xs flex-shrink-0" title="有 Android 应用"></i>
                    <i v-if="site.hasIosApp" class="fab fa-apple text-slate-800 dark:text-slate-300 text-xs flex-shrink-0" title="有 iOS 应用"></i>
                  </h3>
                  <p class="text-[10px] text-slate-400 truncate">{{ site.description || getDomain(site.url) }}</p>
                </div>
              </div>
              <div v-if="site.tags?.length" class="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-700">
                <template v-for="(tag, idx) in (site.tags || [])" :key="tag.id">
                  <NuxtLink v-if="Number(idx) < getVisibleTagCount(site)" :to="`/tag/${tag.slug}`" @click.stop class="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[80px]">
                    {{ tag.name }}
                  </NuxtLink>
                </template>
                <span v-if="site.tags.length > getVisibleTagCount(site)" class="px-1.5 py-0.5 text-[10px] text-slate-400 flex-shrink-0">+{{ site.tags.length - getVisibleTagCount(site) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 正常分类列表 -->
        <template v-else>
          <template v-for="category in categories" :key="category.id">
            <!-- 顶级分类 - 只有有网站或有子分类有网站时才显示 -->
            <section
              v-if="hasCategoryContent(category)"
              :id="category.slug"
              class="scroll-mt-24"
            >
              <div class="flex items-center space-x-3 mb-6">
                <div class="w-1.5 h-5 bg-slate-900 dark:bg-white rounded-full"></div>
                <h2 class="text-lg font-black tracking-tighter uppercase">{{ category.name }}</h2>
              </div>
            <div
              v-if="sitesByCategory[category.id]?.length > 0"
              class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-4"
            >
              <div
                v-for="site in sitesByCategory[category.id] || []"
                :key="site.id"
                class="glass-card p-3 rounded-lg cursor-pointer hover:scale-105 transition-transform"
                @click="navigateTo(`/site/${site.id}`)"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      v-if="site.logoUrl"
                      :src="site.logoUrl"
                      :alt="site.title"
                      class="w-7 h-7 object-contain"
                      loading="lazy"
                    />
                    <i v-else class="fas fa-globe text-slate-400"></i>
                  </div>
                  <div class="overflow-hidden flex-1">
                    <h3 class="font-bold text-slate-900 dark:text-white text-sm truncate flex items-center gap-1">
                      <span class="truncate">{{ site.title }}</span>
                      <span v-if="site.isNsfw" class="text-[9px] px-1 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold flex-shrink-0">NSFW</span>
                      <i v-if="site.hasAndroidApp" class="fab fa-android text-green-500 text-xs flex-shrink-0" title="有 Android 应用"></i>
                      <i v-if="site.hasIosApp" class="fab fa-apple text-slate-800 dark:text-slate-300 text-xs flex-shrink-0" title="有 iOS 应用"></i>
                    </h3>
                    <p class="text-[10px] text-slate-400 truncate">
                      {{ site.description || getDomain(site.url) }}
                    </p>
                  </div>
                </div>
                <!-- 标签 -->
                <div v-if="site.tags?.length" class="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-700" ref="tagContainers">
                  <template v-for="(tag, idx) in (site.tags || [])" :key="tag.id">
                    <NuxtLink
                      v-if="Number(idx) < getVisibleTagCount(site)"
                      :to="`/tag/${tag.slug}`"
                      @click.stop
                      class="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[80px]"
                    >
                      {{ tag.name }}
                    </NuxtLink>
                  </template>
                  <span v-if="site.tags.length > getVisibleTagCount(site)" class="px-1.5 py-0.5 text-[10px] text-slate-400 flex-shrink-0">+{{ site.tags.length - getVisibleTagCount(site) }}</span>
                </div>
              </div>
            </div>
          </section>

            <!-- 子分类 - 只有有网站时才显示 -->
            <section
              v-for="child in (category.children || []).filter((c: any) => sitesByCategory[c.id]?.length > 0)"
              :key="child.id"
              :id="child.slug"
              class="scroll-mt-24"
            >
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-1 h-4 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
                <h3 class="text-base font-bold tracking-tight text-slate-700 dark:text-slate-300">{{ child.name }}</h3>
              </div>
              <div
                class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-4"
              >
                <div
                  v-for="site in sitesByCategory[child.id] || []"
                  :key="site.id"
                  class="glass-card p-3 rounded-lg cursor-pointer hover:scale-105 transition-transform"
                  @click="navigateTo(`/site/${site.id}`)"
                >
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <img v-if="site.logoUrl" :src="site.logoUrl" :alt="site.title" class="w-7 h-7 object-contain" loading="lazy" />
                      <i v-else class="fas fa-globe text-slate-400"></i>
                    </div>
                    <div class="overflow-hidden flex-1">
                      <h3 class="font-bold text-slate-900 dark:text-white text-sm truncate flex items-center gap-1">
                        <span class="truncate">{{ site.title }}</span>
                        <span v-if="site.isNsfw" class="text-[9px] px-1 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold flex-shrink-0">NSFW</span>
                        <i v-if="site.hasAndroidApp" class="fab fa-android text-green-500 text-xs flex-shrink-0" title="有 Android 应用"></i>
                        <i v-if="site.hasIosApp" class="fab fa-apple text-slate-800 dark:text-slate-300 text-xs flex-shrink-0" title="有 iOS 应用"></i>
                      </h3>
                      <p class="text-[10px] text-slate-400 truncate">{{ site.description || getDomain(site.url) }}</p>
                    </div>
                  </div>
                  <div v-if="site.tags?.length" class="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-700">
                    <template v-for="(tag, idx) in (site.tags || [])" :key="tag.id">
                      <NuxtLink v-if="Number(idx) < getVisibleTagCount(site)" :to="`/tag/${tag.slug}`" @click.stop class="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[80px]">
                        {{ tag.name }}
                      </NuxtLink>
                    </template>
                    <span v-if="site.tags.length > getVisibleTagCount(site)" class="px-1.5 py-0.5 text-[10px] text-slate-400 flex-shrink-0">+{{ site.tags.length - getVisibleTagCount(site) }}</span>
                  </div>
                </div>
              </div>
            </section>
          </template>

          <!-- 空状态 -->
          <div v-if="categories.length === 0" class="text-center py-20">
            <i class="fas fa-compass text-6xl text-slate-300 dark:text-slate-600 mb-6"></i>
            <h2 class="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">还没有内容</h2>
            <p class="text-slate-400 text-sm">管理员尚未添加任何分类和网站</p>
          </div>
        </template>
      </div>
    </div>

    <!-- 移动端悬浮投稿按钮 -->
    <NuxtLink
      to="/submit"
      class="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-40"
      aria-label="投稿网站"
      title="投稿网站"
    >
      <i class="fas fa-paper-plane text-lg"></i>
    </NuxtLink>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const { mobileMenuOpen, closeMenu } = useMobileMenu()
const { nsfwMode, initNsfwMode } = useNsfwMode()
const { getSiteName, loadSettings: loadSiteSettings } = useSiteSettings()
const activeCategory = ref<number | null>(null)

// 加载网站设置
loadSiteSettings()

// SEO
useHead(() => ({
  title: getSiteName.value,
  meta: [
    { name: 'description', content: `${getSiteName.value} - 精选优质网站导航，发现更多有趣的网站资源` },
  ],
}))
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)
const expandedCategories = ref<number[]>([])

// SSR 数据预取 - 在服务端和客户端都会执行，结果会被序列化传递
const { data: categoriesData } = await useAsyncData('categories', () => 
  $fetch<{ success: boolean; data: any[] }>('/api/categories').then(res => res.data)
)

// 网站数据 - 根据 NSFW 模式获取
const { data: sitesData, refresh: refreshSites } = await useAsyncData(
  'sites',
  () => $fetch<{ success: boolean; data: Record<number, any[]> }>(`/api/sites/all?nsfw=${nsfwMode.value}`).then(res => res.data),
  { watch: [nsfwMode] } // 监听 NSFW 模式变化自动刷新
)

// 使用预取的数据
const categories = computed(() => categoriesData.value || [])
const sitesByCategory = computed(() => sitesData.value || {})

// 切换分类展开/折叠
const toggleExpand = (categoryId: number) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
  }
}

// 点击桌面端分类 - 滚动并切换展开状态（折叠其他分类）
const handleCategoryClick = (category: any) => {
  scrollToCategory(category.slug)
  // 如果有子分类
  if (category.children?.length) {
    const isExpanded = expandedCategories.value.includes(category.id)
    if (isExpanded) {
      // 已展开则折叠
      expandedCategories.value = []
    } else {
      // 未展开则展开当前分类，折叠其他分类
      expandedCategories.value = [category.id]
    }
  } else {
    // 没有子分类时，折叠所有
    expandedCategories.value = []
  }
}

// 点击移动端分类 - 滚动、切换展开状态并关闭菜单
const handleMobileCategoryClick = (category: any) => {
  scrollToCategory(category.slug)
  // 如果有子分类
  if (category.children?.length) {
    const isExpanded = expandedCategories.value.includes(category.id)
    if (isExpanded) {
      // 已展开则折叠
      expandedCategories.value = []
    } else {
      // 未展开则展开当前分类，折叠其他分类
      expandedCategories.value = [category.id]
    }
  } else {
    // 没有子分类时，折叠所有
    expandedCategories.value = []
  }
  closeMenu()
}

// 检查分类是否有内容（本身有网站或子分类有网站）
const hasCategoryContent = (category: any): boolean => {
  // 检查分类本身是否有网站
  if (sitesByCategory.value[category.id]?.length > 0) {
    return true
  }
  // 检查子分类是否有网站
  if (category.children?.length) {
    for (const child of category.children) {
      if (sitesByCategory.value[child.id]?.length > 0) {
        return true
      }
    }
  }
  return false
}

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

// 根据标签名长度动态计算显示数量
const getVisibleTagCount = (site: any) => {
  if (!site.tags || site.tags.length === 0) return 0
  
  // 估算可用宽度（卡片宽度约180px，减去padding）
  const availableWidth = 150
  let usedWidth = 0
  let count = 0
  
  for (const tag of site.tags) {
    // 每个标签预估宽度：字符数 * 8px + padding 12px
    const tagWidth = Math.min(tag.name.length * 8 + 12, 80)
    if (usedWidth + tagWidth + 4 <= availableWidth) { // 4px gap
      usedWidth += tagWidth + 4
      count++
    } else {
      break
    }
  }
  
  // 至少显示1个，最多显示5个
  return Math.max(1, Math.min(count, 5))
}

const scrollToCategory = (slug: string) => {
  const element = document.getElementById(slug)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // 检查顶级分类
    let found = categories.value.find(c => c.slug === slug)
    if (found) {
      activeCategory.value = found.id
    } else {
      // 检查子分类
      for (const cat of categories.value) {
        const child = cat.children?.find((c: any) => c.slug === slug)
        if (child) {
          activeCategory.value = child.id
          break
        }
      }
    }
  }
}

// 刷新数据（用于客户端刷新）
const refreshData = async () => {
  await Promise.all([
    refreshNuxtData('categories'),
    refreshNuxtData('sites'),
  ])
}

// 搜索功能
const performSearch = async (query: string) => {
  if (!query.trim()) {
    isSearching.value = false
    searchResults.value = []
    return
  }
  
  isSearching.value = true
  const allSites: any[] = []
  
  // 从所有分类和子分类中收集网站
  for (const category of categories.value) {
    const sites = sitesByCategory.value[category.id] || []
    allSites.push(...sites)
    // 子分类
    if (category.children?.length) {
      for (const child of category.children) {
        const childSites = sitesByCategory.value[child.id] || []
        allSites.push(...childSites)
      }
    }
  }
  
  // 本地搜索：匹配标题、描述、URL
  const lowerQuery = query.toLowerCase()
  searchResults.value = allSites.filter(site => 
    site.title.toLowerCase().includes(lowerQuery) ||
    (site.description && site.description.toLowerCase().includes(lowerQuery)) ||
    site.url.toLowerCase().includes(lowerQuery) ||
    (site.tags && site.tags.some((tag: any) => tag.name.toLowerCase().includes(lowerQuery)))
  )
}

// 监听路由参数变化
watch(() => route.query.search, (newSearch) => {
  searchQuery.value = (newSearch as string) || ''
  if (searchQuery.value) {
    performSearch(searchQuery.value)
  } else {
    isSearching.value = false
    searchResults.value = []
  }
}, { immediate: true })

onMounted(() => {
  // 如果有搜索参数，执行搜索
  if (route.query.search) {
    searchQuery.value = route.query.search as string
    performSearch(searchQuery.value)
  }
  
  // 监听滚动，更新活动分类
  const handleScroll = () => {
    const sections = categories.value.map(c => ({
      id: c.id,
      element: document.getElementById(c.slug),
    }))
    
    for (const section of sections) {
      if (section.element) {
        const rect = section.element.getBoundingClientRect()
        if (rect.top <= 150 && rect.bottom >= 150) {
          activeCategory.value = section.id
          break
        }
      }
    }
  }
  
  window.addEventListener('scroll', handleScroll)
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
  
  // 初始化 NSFW 模式
  initNsfwMode()
})
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-active > div:last-child,
.drawer-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from > div:last-child,
.drawer-leave-to > div:last-child {
  transform: translateX(-100%);
}
</style>
