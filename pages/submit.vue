<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <!-- 顶部导航 -->
    <header class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <NuxtLink to="/" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition">
            <i class="fas fa-arrow-left text-lg"></i>
          </NuxtLink>
          <h1 class="text-lg font-black text-slate-900 dark:text-white">
            <i class="fas fa-paper-plane mr-2 text-blue-500"></i>投稿网站
          </h1>
        </div>
        <button
          @click="handleSubmit"
          :disabled="saving || !isAuthenticated"
          class="btn-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide disabled:opacity-50"
        >
          <i class="fas fa-paper-plane mr-2"></i>{{ saving ? '提交中...' : '提交投稿' }}
        </button>
      </div>
    </header>

    <!-- 未登录且不允许访客投稿的提示 -->
    <div v-if="!isAuthenticated && !allowGuestSubmit" class="max-w-4xl mx-auto px-4 py-20 text-center">
      <i class="fas fa-user-lock text-6xl text-slate-300 dark:text-slate-600 mb-6"></i>
      <h2 class="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">请先登录</h2>
      <p class="text-slate-400 text-sm mb-6">登录后即可投稿网站</p>
      <NuxtLink
        to="/login"
        class="btn-primary text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider inline-block"
      >
        立即登录
      </NuxtLink>
    </div>

    <!-- 主内容（登录用户或允许访客投稿时显示） -->
    <main v-else class="max-w-4xl mx-auto px-4 py-8">
      <!-- 投稿说明 -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8">
        <div class="flex items-start space-x-3">
          <i class="fas fa-info-circle text-blue-500 mt-0.5"></i>
          <div class="text-sm text-blue-700 dark:text-blue-400">
            <p class="font-bold mb-1">投稿须知</p>
            <ul class="space-y-1 list-disc list-inside">
              <li>投稿后需要管理员审核，审核通过后将在首页展示</li>
              <li>请确保网站内容合法合规，不含违规信息</li>
              <li>建议填写详细的网站介绍，有助于审核通过</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧表单 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 基本信息 -->
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <h2 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide mb-6">基本信息</h2>
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">网站名称 <span class="text-red-500">*</span></label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="输入网站名称"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">简介 <span class="text-red-500">*</span></label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-lg py-3 px-4 text-sm resize-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="简短描述这个网站的功能和特点"
                ></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">网站链接 <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.url"
                    type="url"
                    required
                    class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">备用链接</label>
                  <input
                    v-model="form.secondUrl"
                    type="url"
                    class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="https://mirror.example.com"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">分类 <span class="text-red-500">*</span></label>
                  <select
                    v-model="form.categoryId"
                    required
                    class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option :value="null">请选择分类</option>
                    <template v-for="cat in categories" :key="cat.id">
                      <option :value="cat.id">{{ cat.name }}</option>
                      <option v-for="child in cat.children || []" :key="child.id" :value="child.id">&nbsp;&nbsp;└ {{ child.name }}</option>
                    </template>
                  </select>
                </div>
              </div>
              <!-- App 可用性 -->
              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">手机应用</label>
                <div class="flex flex-wrap gap-4">
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input v-model="form.hasAndroidApp" type="checkbox" class="w-5 h-5 rounded text-green-500" />
                    <i class="fab fa-android text-green-500"></i>
                    <span class="text-sm text-slate-600 dark:text-slate-400">有 Android 应用</span>
                  </label>
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input v-model="form.hasIosApp" type="checkbox" class="w-5 h-5 rounded text-slate-800" />
                    <i class="fab fa-apple text-slate-800 dark:text-white"></i>
                    <span class="text-sm text-slate-600 dark:text-slate-400">有 iOS 应用</span>
                  </label>
                </div>
              </div>
              <!-- NSFW 标记 -->
              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">内容分级</label>
                <label class="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 transition-colors" :class="form.isNsfw ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700'">
                  <input v-model="form.isNsfw" type="checkbox" class="w-5 h-5 rounded text-red-500" />
                  <div>
                    <div class="flex items-center space-x-2">
                      <i class="fas fa-exclamation-triangle text-red-500"></i>
                      <span class="text-sm font-bold text-slate-700 dark:text-slate-300">NSFW 内容</span>
                    </div>
                    <p class="text-xs text-slate-500 mt-1">标记为 NSFW 的网站默认不显示给用户</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- 详细介绍 -->
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <h2 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide mb-6">详细介绍（选填）</h2>
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">富文本内容</label>
              <!-- BBCode 工具栏 -->
              <div class="flex flex-wrap gap-1.5 mb-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <button type="button" @click="insertBBCode('h1')" class="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-xs font-bold text-slate-700 dark:text-slate-200 transition" title="标题1">H1</button>
                <button type="button" @click="insertBBCode('h2')" class="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-xs font-bold text-slate-700 dark:text-slate-200 transition" title="标题2">H2</button>
                <button type="button" @click="insertBBCode('h3')" class="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-xs font-bold text-slate-700 dark:text-slate-200 transition" title="标题3">H3</button>
                <span class="w-px h-6 bg-slate-300 dark:bg-slate-500 mx-1"></span>
                <button type="button" @click="insertBBCode('b')" class="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-xs font-bold text-slate-700 dark:text-slate-200 transition" title="粗体"><i class="fas fa-bold"></i></button>
                <button type="button" @click="insertBBCode('i')" class="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-xs font-bold text-slate-700 dark:text-slate-200 transition" title="斜体"><i class="fas fa-italic"></i></button>
                <button type="button" @click="insertBBCode('u')" class="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-xs font-bold text-slate-700 dark:text-slate-200 transition" title="下划线"><i class="fas fa-underline"></i></button>
                <button type="button" @click="insertBBCode('s')" class="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-xs font-bold text-slate-700 dark:text-slate-200 transition" title="删除线"><i class="fas fa-strikethrough"></i></button>
                <span class="w-px h-6 bg-slate-300 dark:bg-slate-500 mx-1"></span>
                <button type="button" @click="insertBBCode('url')" class="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-xs font-bold text-slate-700 dark:text-slate-200 transition" title="链接"><i class="fas fa-link"></i></button>
                <button type="button" @click="insertBBCode('img')" class="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-xs font-bold text-slate-700 dark:text-slate-200 transition" title="图片"><i class="fas fa-image"></i></button>
                <span class="w-px h-6 bg-slate-300 dark:bg-slate-500 mx-1"></span>
                <button type="button" @click="insertBBCode('list')" class="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-xs font-bold text-slate-700 dark:text-slate-200 transition" title="无序列表"><i class="fas fa-list-ul"></i></button>
                <button type="button" @click="insertBBCode('olist')" class="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-xs font-bold text-slate-700 dark:text-slate-200 transition" title="有序列表"><i class="fas fa-list-ol"></i></button>
                <button type="button" @click="insertBBCode('quote')" class="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-xs font-bold text-slate-700 dark:text-slate-200 transition" title="引用"><i class="fas fa-quote-left"></i></button>
                <button type="button" @click="insertBBCode('code')" class="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-xs font-bold text-slate-700 dark:text-slate-200 transition" title="代码"><i class="fas fa-code"></i></button>
              </div>
              <textarea
                ref="richContentTextarea"
                v-model="form.richContent"
                rows="8"
                class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-lg py-3 px-4 text-sm font-mono resize-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="[h1]功能特点[/h1]&#10;[list]&#10;[*]特点1&#10;[*]特点2&#10;[/list]&#10;&#10;[url=https://example.com]链接文字[/url]"
              ></textarea>
              <p class="text-xs text-slate-400 mt-2">支持 BBCode 标记：[h1] [h2] [h3] [b] [i] [u] [s] [url] [img] [list] [quote] [code]</p>
            </div>
          </div>
        </div>

        <!-- 右侧图标设置 -->
        <div class="space-y-6">
          <!-- 网站图标 -->
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <h2 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide mb-6">网站图标</h2>
            
            <!-- 图标预览 -->
            <div class="flex justify-center mb-6">
              <div class="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 overflow-hidden">
                <img
                  v-if="form.logoUrl"
                  :src="form.logoUrl"
                  alt="网站图标"
                  class="w-16 h-16 object-contain"
                />
                <i v-else class="fas fa-image text-3xl text-slate-400"></i>
              </div>
            </div>

            <!-- 图标来源选择 -->
            <div class="space-y-4">
              <!-- 自动抓取 -->
              <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-bold text-slate-700 dark:text-slate-300">
                    <i class="fas fa-magic mr-2 text-purple-500"></i>自动抓取
                  </span>
                </div>
                <p class="text-xs text-slate-500 mb-3">从网站自动获取图标</p>
                <button
                  @click="fetchIcon"
                  :disabled="fetchingIcon || !form.url"
                  class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <i :class="fetchingIcon ? 'fas fa-spinner fa-spin' : 'fas fa-download'" class="mr-2"></i>
                  {{ fetchingIcon ? '抓取中...' : '抓取图标' }}
                </button>
                <p v-if="!form.url" class="text-xs text-orange-500 mt-2">
                  <i class="fas fa-exclamation-triangle mr-1"></i>请先填写网站链接
                </p>
              </div>

              <!-- 手动上传 -->
              <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-bold text-slate-700 dark:text-slate-300">
                    <i class="fas fa-upload mr-2 text-blue-500"></i>手动上传
                  </span>
                </div>
                <p class="text-xs text-slate-500 mb-3">上传本地图片作为图标</p>
                <label class="block">
                  <input
                    type="file"
                    accept="image/*"
                    @change="uploadIcon"
                    class="hidden"
                    ref="fileInput"
                  />
                  <button
                    @click="($refs.fileInput as HTMLInputElement).click()"
                    :disabled="uploadingIcon"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide disabled:opacity-50 transition"
                  >
                    <i :class="uploadingIcon ? 'fas fa-spinner fa-spin' : 'fas fa-cloud-upload-alt'" class="mr-2"></i>
                    {{ uploadingIcon ? '上传中...' : '选择文件' }}
                  </button>
                </label>
              </div>

              <!-- URL 链接 -->
              <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-bold text-slate-700 dark:text-slate-300">
                    <i class="fas fa-link mr-2 text-green-500"></i>URL 链接
                  </span>
                </div>
                <p class="text-xs text-slate-500 mb-3">直接输入图标的 URL 地址</p>
                <input
                  v-model="form.logoUrl"
                  type="url"
                  class="w-full bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-green-500 transition"
                  placeholder="https://example.com/icon.png"
                />
              </div>

              <!-- 清除图标 -->
              <button
                v-if="form.logoUrl"
                @click="form.logoUrl = ''"
                class="w-full text-red-500 hover:text-red-600 py-2 text-sm font-medium transition"
              >
                <i class="fas fa-trash-alt mr-2"></i>清除图标
              </button>
            </div>
          </div>

          <!-- 操作提示 -->
          <div class="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div class="flex items-start space-x-3">
              <i class="fas fa-lightbulb text-amber-500 mt-0.5"></i>
              <div class="text-xs text-amber-700 dark:text-amber-400">
                <p class="font-bold mb-1">提示</p>
                <ul class="space-y-1 list-disc list-inside">
                  <li>推荐使用自动抓取功能获取网站图标</li>
                  <li>图标建议使用正方形图片</li>
                  <li>支持 PNG、JPG、ICO、SVG 格式</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { isAuthenticated } = useAuth()
const { getSiteName, loadSettings: loadSiteSettings } = useSiteSettings()
const toast = useToast()

// 加载网站设置
loadSiteSettings()

// SEO
useHead(() => ({
  title: `投稿网站 - ${getSiteName.value}`,
  meta: [
    { name: 'description', content: `向 ${getSiteName.value} 投稿您发现的优质网站` },
    { name: 'keywords', content: '投稿, 网站收录, 资源导航' },
  ],
}))

// 表单数据
const form = ref({
  title: '',
  description: '',
  url: '',
  secondUrl: '',
  logoUrl: '',
  categoryId: null as number | null,
  richContent: '',
  hasAndroidApp: false,
  hasIosApp: false,
  isNsfw: false,
})

const categories = ref<any[]>([])
const saving = ref(false)
const fetchingIcon = ref(false)
const uploadingIcon = ref(false)
const allowGuestSubmit = ref(false)

// BBCode 编辑器
const richContentTextarea = ref<HTMLTextAreaElement | null>(null)

const insertBBCode = (tag: string) => {
  const textarea = richContentTextarea.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = form.value.richContent.substring(start, end)

  let insertText = ''
  let cursorOffset = 0

  switch (tag) {
    case 'url':
      if (selectedText) {
        insertText = `[url=${selectedText}]链接文字[/url]`
        cursorOffset = insertText.length
      } else {
        insertText = '[url=链接地址]链接文字[/url]'
        cursorOffset = 5
      }
      break
    case 'img':
      insertText = selectedText ? `[img]${selectedText}[/img]` : '[img]图片地址[/img]'
      cursorOffset = selectedText ? insertText.length : 5
      break
    case 'list':
      insertText = selectedText ? `[list]\n[*]${selectedText}\n[/list]` : '[list]\n[*]列表项\n[/list]'
      cursorOffset = selectedText ? insertText.length : 10
      break
    case 'olist':
      insertText = selectedText ? `[list=1]\n[*]${selectedText}\n[/list]` : '[list=1]\n[*]列表项\n[/list]'
      cursorOffset = selectedText ? insertText.length : 12
      break
    default:
      insertText = selectedText ? `[${tag}]${selectedText}[/${tag}]` : `[${tag}]文字[/${tag}]`
      cursorOffset = selectedText ? insertText.length : tag.length + 2
  }

  form.value.richContent = form.value.richContent.substring(0, start) + insertText + form.value.richContent.substring(end)

  nextTick(() => {
    textarea.focus()
    if (selectedText) {
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset)
    } else {
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset + (tag === 'list' || tag === 'olist' ? 3 : (tag === 'url' ? 4 : (tag === 'img' ? 4 : 2))))
    }
  })
}

// 加载分类
const loadCategories = async () => {
  try {
    const response = await $fetch<{ success: boolean; data: any[] }>('/api/categories')
    categories.value = response.data || []
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

// 自动抓取图标（直接使用输入框中的 URL）
const fetchIcon = async () => {
  if (!form.value.url) {
    toast.error('请先填写网站链接')
    return
  }

  fetchingIcon.value = true

  try {
    const response = await $fetch<{ success: boolean; url: string }>('/api/sites/fetch-icon', {
      method: 'POST',
      body: { url: form.value.url },
    })

    if (response.url) {
      form.value.logoUrl = response.url
      toast.success('图标抓取成功！')
    }
  } catch (error: any) {
    toast.error(error.data?.message || '图标抓取失败，请尝试手动上传')
  } finally {
    fetchingIcon.value = false
  }
}

// 上传图标
const uploadIcon = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const file = input.files[0]
  if (!file.type.startsWith('image/')) {
    toast.error('请选择图片文件')
    return
  }

  uploadingIcon.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await $fetch<{ success: boolean; url: string }>('/api/upload?usageType=site_logo', {
      method: 'POST',
      body: formData,
    })

    if (response.url) {
      form.value.logoUrl = response.url
      toast.success('图标上传成功！')
    }
  } catch (error: any) {
    toast.error(error.data?.message || '上传失败')
  } finally {
    uploadingIcon.value = false
    input.value = ''
  }
}

// 提交投稿
const handleSubmit = async () => {
  if (!form.value.title || !form.value.url || !form.value.categoryId) {
    toast.error('请填写必填字段：网站名称、网站链接、分类')
    return
  }

  if (!form.value.description) {
    toast.error('请填写网站简介')
    return
  }

  saving.value = true

  try {
    await $fetch('/api/sites', {
      method: 'POST',
      body: {
        title: form.value.title,
        description: form.value.description,
        url: form.value.url,
        secondUrl: form.value.secondUrl || undefined,
        logoUrl: form.value.logoUrl || undefined,
        categoryId: form.value.categoryId,
        commentsEnabled: true,
        richContent: form.value.richContent || undefined,
        hasAndroidApp: form.value.hasAndroidApp,
        hasIosApp: form.value.hasIosApp,
        isNsfw: form.value.isNsfw,
      },
    })

    toast.success('投稿成功！您的网站已提交审核，3秒后返回首页')
    
    // 清空表单
    form.value = {
      title: '',
      description: '',
      url: '',
      secondUrl: '',
      logoUrl: '',
      categoryId: null,
      richContent: '',
      hasAndroidApp: false,
      hasIosApp: false,
      isNsfw: false,
    }

    // 3秒后跳转回首页
    setTimeout(() => {
      router.push('/')
    }, 3000)
  } catch (error: any) {
    toast.error(error.data?.message || '提交失败')
  } finally {
    saving.value = false
  }
}

// 加载设置
const loadSettings = async () => {
  try {
    const response = await $fetch<{ success: boolean; data: any }>('/api/settings/site')
    if (response.data) {
      allowGuestSubmit.value = response.data.allowGuestSubmit || false
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadSettings()])
})
</script>
