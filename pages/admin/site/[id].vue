<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <!-- 顶部导航 -->
    <header class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <NuxtLink to="/admin" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition">
            <i class="fas fa-arrow-left text-lg"></i>
          </NuxtLink>
          <h1 class="text-lg font-black text-slate-900 dark:text-white">编辑网站</h1>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="handleDelete"
            :disabled="deleting"
            class="text-red-500 hover:text-red-600 px-4 py-2 font-bold text-sm uppercase tracking-wide disabled:opacity-50 transition"
          >
            <i class="fas fa-trash-alt mr-2"></i>删除
          </button>
          <button
            @click="handleSave"
            :disabled="saving"
            class="btn-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide disabled:opacity-50"
          >
            <i class="fas fa-save mr-2"></i>{{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </header>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <i class="fas fa-spinner fa-spin text-2xl text-slate-400"></i>
    </div>

    <!-- 主内容 -->
    <main v-else-if="site" class="max-w-4xl mx-auto px-4 py-8">
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
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">简介</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-lg py-3 px-4 text-sm resize-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="简短描述这个网站"
                ></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">主链接 <span class="text-red-500">*</span></label>
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
                    <p class="text-xs text-slate-500 mt-1">标记为 NSFW 的网站默认不显示，不会出现在 sitemap 和搜索引擎中</p>
                  </div>
                </label>
              </div>
              <!-- 排序 -->
              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">排序</label>
                <input
                  v-model.number="form.sortOrder"
                  type="number"
                  class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="0"
                />
                <p class="text-xs text-slate-400 mt-1">数字越小排序越靠前，默认为 0</p>
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">标签</label>
                <!-- 已选择的标签 -->
                <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2 mb-3">
                  <span
                    v-for="tag in selectedTags"
                    :key="tag.id || tag.name"
                    class="px-3 py-1.5 rounded-lg text-sm font-medium text-white flex items-center gap-2"
                    :style="{ backgroundColor: tag.color || '#6366f1' }"
                  >
                    <i class="fas fa-tag text-xs"></i>{{ tag.name }}
                    <button type="button" @click="removeTag(tag)" class="hover:bg-white/20 rounded-full w-5 h-5 flex items-center justify-center">
                      <i class="fas fa-times text-xs"></i>
                    </button>
                  </span>
                </div>
                <!-- 标签输入框 -->
                <div class="relative">
                  <input
                    v-model="tagInput"
                    type="text"
                    class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="输入标签名称，回车添加..."
                    @input="onTagInput"
                    @keydown.enter.prevent="addTagFromInput"
                    @keydown.down.prevent="navigateSuggestion(1)"
                    @keydown.up.prevent="navigateSuggestion(-1)"
                    @blur="hideSuggestionsDelayed"
                    @focus="showSuggestions = tagInput.length > 0"
                  />
                  <!-- 匹配建议 -->
                  <div
                    v-if="showSuggestions && filteredTags.length > 0"
                    class="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto"
                  >
                    <button
                      v-for="(tag, index) in filteredTags"
                      :key="tag.id"
                      type="button"
                      :class="[
                        'w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors',
                        suggestionIndex === index ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                      ]"
                      @mousedown.prevent="selectTag(tag)"
                    >
                      <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: tag.color || '#6366f1' }"></span>
                      <span class="text-slate-900 dark:text-white">{{ tag.name }}</span>
                      <span class="text-slate-400 text-xs ml-auto">{{ tag.slug }}</span>
                    </button>
                  </div>
                  <!-- 新建标签提示 -->
                  <div
                    v-if="showSuggestions && tagInput.trim() && filteredTags.length === 0"
                    class="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div class="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                      按回车创建新标签 "<span class="text-blue-600 dark:text-blue-400 font-medium">{{ tagInput.trim() }}</span>"
                    </div>
                  </div>
                </div>
                <p class="text-xs text-slate-400 mt-2">输入标签名搜索已有标签，或输入新名称按回车创建</p>
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">状态</label>
                <select
                  v-model="form.status"
                  class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="pending">待审核</option>
                  <option value="approved">已通过</option>
                  <option value="rejected">已拒绝</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 详细介绍 -->
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <h2 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide mb-6">详细介绍</h2>
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
                <span class="w-px h-6 bg-slate-300 dark:bg-slate-500 mx-1"></span>
                <button type="button" @click="insertBBCode('color')" class="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-xs font-bold text-slate-700 dark:text-slate-200 transition" title="颜色"><i class="fas fa-palette"></i></button>
                <button type="button" @click="insertBBCode('size')" class="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-xs font-bold text-slate-700 dark:text-slate-200 transition" title="字号"><i class="fas fa-text-height"></i></button>
              </div>
              <textarea
                ref="richContentTextarea"
                v-model="form.richContent"
                rows="12"
                class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-lg py-3 px-4 text-sm font-mono resize-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="[h1]功能特点[/h1]&#10;[list]&#10;[*]特点1&#10;[*]特点2&#10;[/list]&#10;&#10;[url=https://example.com]链接文字[/url]&#10;[img]https://example.com/image.jpg[/img]"
              ></textarea>
              <p class="text-xs text-slate-400 mt-2">支持 BBCode 标记：[h1] [h2] [h3] [b] [i] [u] [s] [url] [img] [list] [quote] [code] [color] [size]</p>
            </div>
          </div>

          <!-- 设置 -->
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <h2 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide mb-6">设置</h2>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input v-model="form.commentsEnabled" type="checkbox" class="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">启用评论功能</span>
            </label>
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
                <p class="text-xs text-slate-500 mb-3">从网站自动获取图标并保存到服务器</p>
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

          <!-- 网站信息 -->
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <h2 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide mb-4">网站信息</h2>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-500">创建时间</span>
                <span class="text-slate-900 dark:text-white font-medium">{{ formatDate(site.createdAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">访问量</span>
                <span class="text-slate-900 dark:text-white font-medium">{{ site.viewCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">创建者</span>
                <span class="text-slate-900 dark:text-white font-medium">{{ site.user?.username || '未知' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- 网站不存在 -->
    <div v-else class="flex flex-col items-center justify-center py-20">
      <i class="fas fa-exclamation-triangle text-4xl text-slate-400 mb-4"></i>
      <p class="text-slate-500">网站不存在</p>
      <NuxtLink to="/admin" class="mt-4 text-blue-600 hover:underline">返回管理页面</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const { isAdmin } = useAuth()
const toast = useToast()

const siteId = route.params.id as string

// 数据
const site = ref<any>(null)
const loading = ref(true)
const categories = ref<any[]>([])
const saving = ref(false)
const deleting = ref(false)
const fetchingIcon = ref(false)
const uploadingIcon = ref(false)

// 表单数据
const form = ref({
  title: '',
  description: '',
  url: '',
  secondUrl: '',
  logoUrl: '',
  tagIds: [] as number[],
  categoryId: null as number | null,
  commentsEnabled: true,
  richContent: '',
  status: 'pending',
  hasAndroidApp: false,
  hasIosApp: false,
  isNsfw: false,
  sortOrder: 0,
})

const allTags = ref<any[]>([])

// 标签输入相关
const tagInput = ref('')
const showSuggestions = ref(false)
const suggestionIndex = ref(-1)
const newTags = ref<Array<{ name: string; slug: string; color: string }>>([])

// 已选择的标签（包括已有标签和新建标签）
const selectedTags = computed(() => {
  const existing = allTags.value.filter(t => form.value.tagIds.includes(t.id))
  return [...existing, ...newTags.value]
})

// 过滤匹配的标签
const filteredTags = computed(() => {
  if (!tagInput.value.trim()) return []
  const query = tagInput.value.toLowerCase().trim()
  return allTags.value.filter(tag => 
    !form.value.tagIds.includes(tag.id) &&
    !newTags.value.some(nt => nt.name === tag.name) &&
    (tag.name.toLowerCase().includes(query) || tag.slug.toLowerCase().includes(query))
  ).slice(0, 8)
})

const onTagInput = () => {
  showSuggestions.value = tagInput.value.length > 0
  suggestionIndex.value = -1
}

const navigateSuggestion = (direction: number) => {
  if (filteredTags.value.length === 0) return
  suggestionIndex.value = Math.max(-1, Math.min(filteredTags.value.length - 1, suggestionIndex.value + direction))
}

const selectTag = (tag: any) => {
  if (!form.value.tagIds.includes(tag.id)) {
    form.value.tagIds.push(tag.id)
  }
  tagInput.value = ''
  showSuggestions.value = false
  suggestionIndex.value = -1
}

const addTagFromInput = async () => {
  // 如果有选中的建议，使用它
  if (suggestionIndex.value >= 0 && filteredTags.value[suggestionIndex.value]) {
    selectTag(filteredTags.value[suggestionIndex.value])
    return
  }

  const name = tagInput.value.trim()
  if (!name) return

  // 检查是否已存在
  const existingTag = allTags.value.find(t => t.name.toLowerCase() === name.toLowerCase())
  if (existingTag) {
    selectTag(existingTag)
    return
  }

  // 检查是否已在新建列表中
  if (newTags.value.some(t => t.name.toLowerCase() === name.toLowerCase())) {
    tagInput.value = ''
    showSuggestions.value = false
    return
  }

  // 生成 slug
  let slug = ''
  try {
    const response = await $fetch<{ success: boolean; slug: string }>('/api/utils/pinyin', {
      method: 'POST',
      body: { text: name },
    })
    slug = response.slug || name.toLowerCase().replace(/\s+/g, '-')
  } catch {
    slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  // 生成随机颜色
  const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9']
  const color = colors[Math.floor(Math.random() * colors.length)]

  newTags.value.push({ name, slug, color })
  tagInput.value = ''
  showSuggestions.value = false
}

const removeTag = (tag: any) => {
  if (tag.id) {
    // 移除已有标签
    const index = form.value.tagIds.indexOf(tag.id)
    if (index > -1) form.value.tagIds.splice(index, 1)
  } else {
    // 移除新建标签
    const index = newTags.value.findIndex(t => t.name === tag.name)
    if (index > -1) newTags.value.splice(index, 1)
  }
}

const hideSuggestionsDelayed = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

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
        cursorOffset = 5 // 光标移到 "链接地址" 开始位置
      }
      break
    case 'img':
      insertText = selectedText ? `[img]${selectedText}[/img]` : '[img]图片地址[/img]'
      cursorOffset = selectedText ? insertText.length : 5
      break
    case 'color':
      insertText = selectedText ? `[color=#ff0000]${selectedText}[/color]` : '[color=#ff0000]文字[/color]'
      cursorOffset = selectedText ? insertText.length : 8
      break
    case 'size':
      insertText = selectedText ? `[size=16]${selectedText}[/size]` : '[size=16]文字[/size]'
      cursorOffset = selectedText ? insertText.length : 6
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

  // 设置光标位置
  nextTick(() => {
    textarea.focus()
    if (selectedText) {
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset)
    } else {
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset + (tag === 'list' || tag === 'olist' ? 3 : (tag === 'url' ? 4 : (tag === 'img' ? 4 : 2))))
    }
  })
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 加载网站数据
const loadSite = async () => {
  try {
    const response = await $fetch<{ success: boolean; data: any }>(`/api/sites/${siteId}`)
    site.value = response.data

    // 填充表单
    form.value = {
      title: site.value.title,
      description: site.value.description || '',
      url: site.value.url,
      secondUrl: site.value.secondUrl || '',
      logoUrl: site.value.logoUrl || '',
      tagIds: site.value.tags ? site.value.tags.map((t: any) => t.id) : [],
      categoryId: site.value.categoryId,
      commentsEnabled: site.value.commentsEnabled ?? true,
      richContent: site.value.richContent || '',
      status: site.value.status,
      hasAndroidApp: site.value.hasAndroidApp || false,
      hasIosApp: site.value.hasIosApp || false,
      isNsfw: site.value.isNsfw || false,
      sortOrder: site.value.sortOrder || 0,
    }
  } catch (error) {
    console.error('Failed to load site:', error)
    site.value = null
  } finally {
    loading.value = false
  }
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

// 加载标签
const loadTags = async () => {
  try {
    const response = await $fetch<{ success: boolean; data: any[] }>('/api/tags')
    allTags.value = response.data || []
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

    const response = await $fetch<{ success: boolean; url: string }>(`/api/upload?usageType=site_logo&usageId=${route.params.id}`, {
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

// 保存网站
const handleSave = async () => {
  if (!form.value.title || !form.value.url || !form.value.categoryId) {
    toast.error('请填写必填字段：网站名称、主链接、分类')
    return
  }

  saving.value = true

  try {
    // 先创建新标签
    const createdTagIds: number[] = []
    for (const newTag of newTags.value) {
      try {
        const response = await $fetch<{ success: boolean; data: { id: number } }>('/api/admin/tags', {
          method: 'POST',
          body: newTag,
        })
        if (response.data?.id) {
          createdTagIds.push(response.data.id)
        }
      } catch (e: any) {
        console.error('创建标签失败:', newTag.name, e)
      }
    }

    // 合并所有标签 ID
    const allTagIds = [...form.value.tagIds, ...createdTagIds]

    await $fetch(`/api/sites/${siteId}`, {
      method: 'PUT',
      body: {
        title: form.value.title,
        description: form.value.description || undefined,
        url: form.value.url,
        secondUrl: form.value.secondUrl || undefined,
        logoUrl: form.value.logoUrl || undefined,
        tagIds: allTagIds,
        categoryId: form.value.categoryId,
        commentsEnabled: form.value.commentsEnabled,
        richContent: form.value.richContent || undefined,
        hasAndroidApp: form.value.hasAndroidApp,
        hasIosApp: form.value.hasIosApp,
        isNsfw: form.value.isNsfw,
        sortOrder: form.value.sortOrder,
      },
    })

    // 如果状态改变，需要单独处理
    if (form.value.status !== site.value.status) {
      if (form.value.status === 'approved') {
        await $fetch(`/api/admin/sites/${siteId}/approve`, { method: 'POST' })
      } else if (form.value.status === 'rejected') {
        await $fetch(`/api/admin/sites/${siteId}/reject`, { method: 'POST' })
      }
    }

    toast.success('保存成功！')
    
    // 清空新建标签列表
    newTags.value = []
    
    // 重新加载数据
    await Promise.all([loadSite(), loadTags()])
  } catch (error: any) {
    toast.error(error.data?.message || '保存失败')
  } finally {
    saving.value = false
  }
}

// 删除网站
const handleDelete = async () => {
  if (!confirm('确定要删除这个网站吗？此操作不可恢复。')) return

  deleting.value = true

  try {
    await $fetch(`/api/sites/${siteId}`, { method: 'DELETE' })
    toast.success('删除成功')
    router.push('/admin?tab=site-list')
  } catch (error: any) {
    toast.error(error.data?.message || '删除失败')
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  if (!isAdmin.value) {
    navigateTo('/')
    return
  }
  await Promise.all([loadSite(), loadCategories(), loadTags()])
})
</script>
