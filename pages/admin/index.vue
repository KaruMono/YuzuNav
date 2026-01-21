<template>
  <div class="min-h-screen flex bg-slate-100 dark:bg-slate-900">
    <!-- 左侧侧边栏 - 浅色主题 -->
    <aside class="w-64 bg-white dark:bg-slate-800 flex-shrink-0 fixed h-full border-r border-slate-200 dark:border-slate-700">
      <div class="p-6 border-b border-slate-200 dark:border-slate-700">
        <NuxtLink to="/" class="flex items-center space-x-3">
          <!-- 动态图标 -->
          <div
            v-if="brandingForm.siteIconType === 'image' && brandingForm.siteLogoUrl"
            class="w-10 h-10 rounded-md overflow-hidden"
          >
            <img :src="brandingForm.siteLogoUrl" alt="Logo" class="w-full h-full object-cover" />
          </div>
          <div
            v-else
            class="w-10 h-10 rounded-md flex items-center justify-center text-white text-xl font-bold"
            :style="{ backgroundColor: brandingForm.siteIconColor || '#1e293b' }"
          >
            <i v-if="brandingForm.siteIconType === 'fa' && brandingForm.siteIcon" :class="brandingForm.siteIcon"></i>
            <span v-else>{{ brandTextPreview }}</span>
          </div>
          <div>
            <div class="font-black text-lg text-slate-900 dark:text-white">{{ brandingForm.siteName || 'YuzuACG' }}</div>
            <div class="text-xs text-slate-400">管理控制台</div>
          </div>
        </NuxtLink>
      </div>

      <nav class="p-4 space-y-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          <i :class="tab.icon" class="w-5 text-center"></i>
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.id === 'sites' && stats.pendingSites > 0"
            class="ml-auto bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full"
          >
            {{ stats.pendingSites }}
          </span>
        </button>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700">
        <NuxtLink
          to="/"
          class="flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <i class="fas fa-arrow-left w-5 text-center"></i>
          <span>返回首页</span>
        </NuxtLink>
      </div>
    </aside>

    <!-- 主内容区域 -->
    <main class="flex-1 ml-64 min-h-screen">
      <div class="p-8">
        <!-- 页面标题 -->
    <div class="mb-8">
          <h1 class="text-2xl font-black text-slate-900 dark:text-white mb-2">
            {{ currentTabLabel }}
          </h1>
          <p class="text-slate-500 text-sm">{{ currentTabDescription }}</p>
    </div>

        <!-- 仪表盘 -->
        <div v-if="activeTab === 'dashboard'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        <div class="text-slate-400 text-xs font-bold uppercase mb-2">总用户数</div>
        <div class="text-2xl font-black text-slate-900 dark:text-white">{{ stats.totalUsers }}</div>
      </div>
            <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        <div class="text-slate-400 text-xs font-bold uppercase mb-2">已审核网站</div>
        <div class="text-2xl font-black text-slate-900 dark:text-white">{{ stats.totalSites }}</div>
      </div>
            <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        <div class="text-slate-400 text-xs font-bold uppercase mb-2">待审核</div>
        <div class="text-2xl font-black text-orange-500">{{ stats.pendingSites }}</div>
      </div>
            <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        <div class="text-slate-400 text-xs font-bold uppercase mb-2">总评论数</div>
        <div class="text-2xl font-black text-slate-900 dark:text-white">{{ stats.totalComments }}</div>
      </div>
            <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        <div class="text-slate-400 text-xs font-bold uppercase mb-2">分类数</div>
        <div class="text-2xl font-black text-slate-900 dark:text-white">{{ stats.totalCategories }}</div>
      </div>
    </div>
      </div>

        <!-- 网站列表 -->
        <div v-if="activeTab === 'manage-sites'" class="bg-white dark:bg-slate-800 rounded-lg shadow-sm">
          <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">网站列表</h3>
            <NuxtLink
              to="/admin/site/new"
            class="btn-primary text-white px-4 py-2 rounded-md font-bold text-xs uppercase"
          >
              <i class="fas fa-plus mr-2"></i>添加网站
            </NuxtLink>
        </div>
          <div class="divide-y divide-slate-200 dark:divide-slate-700">
          <div
            v-for="site in allSites"
            :key="site.id"
              class="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div class="flex items-center space-x-4 flex-1">
                <img v-if="site.logoUrl" :src="site.logoUrl" :alt="site.title" class="w-12 h-12 rounded-lg object-cover" />
                <div v-else class="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <i class="fas fa-globe text-slate-400"></i>
                </div>
              <div class="flex-1">
                <div class="flex items-center space-x-2">
                  <span class="font-bold text-slate-900 dark:text-white">{{ site.title }}</span>
                  <span v-if="site.isNsfw" class="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-bold">NSFW</span>
                </div>
                  <div class="text-sm text-slate-400">{{ site.url }}</div>
                  <div class="flex items-center space-x-3 mt-1">
                    <span class="text-xs text-slate-400"><i class="fas fa-folder mr-1"></i>{{ site.category.name }}</span>
                    <span class="text-xs text-slate-400"><i class="fas fa-sort mr-1"></i>排序: {{ site.sortOrder || 0 }}</span>
                    <span :class="['text-xs px-2 py-0.5 rounded-full', site.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : site.status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400']">
                      {{ site.status === 'approved' ? '已审核' : site.status === 'pending' ? '待审核' : '已拒绝' }}
                    </span>
                </div>
              </div>
            </div>
            <div class="flex space-x-2">
                <NuxtLink :to="`/admin/site/${site.id}`" class="px-3 py-2 bg-blue-500 text-white rounded-md text-xs font-bold hover:bg-blue-600"><i class="fas fa-edit"></i></NuxtLink>
                <button @click="deleteSite(site.id)" class="px-3 py-2 bg-red-500 text-white rounded-md text-xs font-bold hover:bg-red-600"><i class="fas fa-trash"></i></button>
            </div>
          </div>
            <div v-if="allSites.length === 0" class="text-center text-slate-400 py-12">
              <i class="fas fa-inbox text-4xl mb-4"></i>
              <p>暂无网站</p>
          </div>
        </div>
      </div>

      <!-- 待审核网站 -->
        <div v-if="activeTab === 'sites'" class="bg-white dark:bg-slate-800 rounded-lg shadow-sm">
          <div class="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">待审核列表</h3>
          </div>
          <div class="divide-y divide-slate-200 dark:divide-slate-700">
            <div v-for="site in pendingSites" :key="site.id" class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <h4 class="font-bold text-slate-900 dark:text-white text-lg">{{ site.title }}</h4>
                    <span v-if="site.isNsfw" class="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-bold">NSFW</span>
                  </div>
                  <p class="text-sm text-slate-500 mb-3">{{ site.description }}</p>
                <div class="flex items-center space-x-4 text-xs text-slate-400">
                    <span><i class="fas fa-folder mr-1"></i>{{ site.category.name }}</span>
                    <span><i class="fas fa-user mr-1"></i>{{ site.user.username || site.user.email }}</span>
                    <a :href="site.url" target="_blank" class="text-blue-500 hover:underline"><i class="fas fa-external-link-alt mr-1"></i>访问网站</a>
                </div>
              </div>
                <div class="flex space-x-2 ml-6">
                  <button @click="approveSite(site.id)" class="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-bold hover:bg-green-600"><i class="fas fa-check mr-2"></i>批准</button>
                  <button @click="rejectSite(site.id)" class="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-bold hover:bg-red-600"><i class="fas fa-times mr-2"></i>拒绝</button>
              </div>
            </div>
          </div>
            <div v-if="pendingSites.length === 0" class="text-center text-slate-400 py-12">
              <i class="fas fa-check-circle text-4xl mb-4 text-green-500"></i>
              <p>暂无待审核网站</p>
          </div>
        </div>
      </div>

      <!-- 用户管理 -->
        <div v-if="activeTab === 'users'" class="bg-white dark:bg-slate-800 rounded-lg shadow-sm">
          <div class="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">用户列表</h3>
          </div>
          <div class="divide-y divide-slate-200 dark:divide-slate-700">
            <div v-for="user in users" :key="user.id" class="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <div class="flex items-center space-x-4 flex-1">
                <div class="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <i class="fas fa-user text-slate-400 text-lg"></i>
              </div>
              <div class="flex-1">
                  <div class="font-bold text-slate-900 dark:text-white">{{ user.username || '未设置用户名' }}</div>
                  <div class="text-sm text-slate-400">{{ user.email }}</div>
                  <div class="flex items-center space-x-3 mt-1">
                    <span :class="['text-xs px-2 py-0.5 rounded-full', user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400']">{{ user.role === 'admin' ? '管理员' : '普通用户' }}</span>
                    <span :class="['text-xs px-2 py-0.5 rounded-full', user.emailVerified ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400']">{{ user.emailVerified ? '已验证' : '未验证' }}</span>
                    <span class="text-xs text-slate-400">网站: {{ user._count.sites }} | 评论: {{ user._count.comments }}</span>
                  </div>
                </div>
              </div>
              <button @click="editUser(user)" class="px-3 py-2 bg-blue-500 text-white rounded-md text-xs font-bold hover:bg-blue-600"><i class="fas fa-edit"></i></button>
            </div>
            <div v-if="users.length === 0" class="text-center text-slate-400 py-12"><i class="fas fa-users text-4xl mb-4"></i><p>暂无用户</p></div>
          </div>
        </div>

        <!-- 分类管理 -->
        <div v-if="activeTab === 'categories'" class="bg-white dark:bg-slate-800 rounded-lg shadow-sm">
          <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">分类列表</h3>
            <button @click="showCategoryForm = true; editingCategory = null; resetCategoryForm()" class="btn-primary text-white px-4 py-2 rounded-md font-bold text-xs uppercase"><i class="fas fa-plus mr-2"></i>添加分类</button>
          </div>
          <div class="divide-y divide-slate-200 dark:divide-slate-700">
            <template v-for="category in topLevelCategories" :key="category.id">
              <!-- 顶级分类 -->
              <div class="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <i :class="category.icon || 'fas fa-folder'" class="text-slate-500 text-lg"></i>
                  </div>
                  <div>
                <div class="font-bold text-slate-900 dark:text-white">
                      {{ category.name }}
                      <span v-if="category.children?.length" class="ml-2 text-xs text-slate-400">({{ category.children.length }} 个子分类)</span>
                </div>
                    <div class="text-sm text-slate-400">
                      <span class="mr-3">标识: {{ category.slug }}</span>
                      <span class="mr-3">网站: {{ category._count?.sites || 0 }}</span>
                      <span class="mr-3">排序: {{ category.sortOrder || 0 }}</span>
                      <span>图标: {{ category.icon || '未设置' }}</span>
                </div>
              </div>
            </div>
            <div class="flex space-x-2">
                  <button @click="addSubCategory(category)" class="px-3 py-2 bg-green-500 text-white rounded-md text-xs font-bold hover:bg-green-600" title="添加子分类"><i class="fas fa-plus"></i></button>
                  <button @click="editCategory(category)" class="px-3 py-2 bg-blue-500 text-white rounded-md text-xs font-bold hover:bg-blue-600"><i class="fas fa-edit"></i></button>
                  <button @click="deleteCategory(category.id)" class="px-3 py-2 bg-red-500 text-white rounded-md text-xs font-bold hover:bg-red-600"><i class="fas fa-trash"></i></button>
            </div>
          </div>
              <!-- 子分类 -->
              <div v-for="child in category.children" :key="child.id" class="flex items-center justify-between p-4 pl-12 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                    <i :class="child.icon || 'fas fa-folder'" class="text-slate-400 text-sm"></i>
          </div>
                  <div>
                    <div class="font-bold text-slate-700 dark:text-slate-300 text-sm">
                      <i class="fas fa-level-up-alt fa-rotate-90 mr-2 text-slate-300 dark:text-slate-600"></i>
                      {{ child.name }}
                    </div>
                    <div class="text-xs text-slate-400">
                      <span class="mr-3">标识: {{ child.slug }}</span>
                      <span class="mr-3">网站: {{ child._count?.sites || 0 }}</span>
                      <span>排序: {{ child.sortOrder || 0 }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button @click="editCategory(child)" class="px-3 py-2 bg-blue-500 text-white rounded-md text-xs font-bold hover:bg-blue-600"><i class="fas fa-edit"></i></button>
                  <button @click="deleteCategory(child.id)" class="px-3 py-2 bg-red-500 text-white rounded-md text-xs font-bold hover:bg-red-600"><i class="fas fa-trash"></i></button>
                </div>
              </div>
            </template>
            <div v-if="categories.length === 0" class="text-center text-slate-400 py-12"><i class="fas fa-folder-open text-4xl mb-4"></i><p>暂无分类</p></div>
        </div>
      </div>

        <!-- 标签管理 -->
        <div v-if="activeTab === 'tags'" class="bg-white dark:bg-slate-800 rounded-lg shadow-sm">
          <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">标签列表</h3>
            <button @click="showTagForm = true; editingTag = null; resetTagForm()" class="btn-primary text-white px-4 py-2 rounded-md font-bold text-xs uppercase"><i class="fas fa-plus mr-2"></i>添加标签</button>
        </div>
          <div class="divide-y divide-slate-200 dark:divide-slate-700">
            <div v-for="tag in tags" :key="tag.id" class="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold" :style="{ backgroundColor: tag.color || '#6366f1' }">
                  <i class="fas fa-tag"></i>
                </div>
                <div>
                  <div class="font-bold text-slate-900 dark:text-white">{{ tag.name }}</div>
                  <div class="text-sm text-slate-400">
                    <span class="mr-3">标识: {{ tag.slug }}</span>
                    <span>网站数: {{ tag._count?.sites || 0 }}</span>
                  </div>
                </div>
              </div>
              <div class="flex space-x-2">
                <button @click="editTag(tag)" class="px-3 py-2 bg-blue-500 text-white rounded-md text-xs font-bold hover:bg-blue-600"><i class="fas fa-edit"></i></button>
                <button @click="deleteTag(tag.id)" class="px-3 py-2 bg-red-500 text-white rounded-md text-xs font-bold hover:bg-red-600"><i class="fas fa-trash"></i></button>
              </div>
            </div>
            <div v-if="tags.length === 0" class="text-center text-slate-400 py-12"><i class="fas fa-tags text-4xl mb-4"></i><p>暂无标签</p></div>
          </div>
        </div>

        <!-- 图片管理 -->
        <div v-if="activeTab === 'images'" class="space-y-6">
          <!-- 统计卡片 -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
              <div class="text-slate-400 text-xs font-bold uppercase mb-2">总图片数</div>
              <div class="text-2xl font-black text-slate-900 dark:text-white">{{ imageStats.total }}</div>
            </div>
            <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
              <div class="text-slate-400 text-xs font-bold uppercase mb-2">总大小</div>
              <div class="text-2xl font-black text-slate-900 dark:text-white">{{ formatFileSize(imageStats.totalSize) }}</div>
            </div>
            <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
              <div class="text-slate-400 text-xs font-bold uppercase mb-2">未使用图片</div>
              <div class="text-2xl font-black text-orange-500">{{ unusedImages.length }}</div>
            </div>
            <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
              <div class="text-slate-400 text-xs font-bold uppercase mb-2">可释放空间</div>
              <div class="text-2xl font-black text-orange-500">{{ formatFileSize(unusedImagesSize) }}</div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center space-x-4">
            <button
              @click="cleanupImages"
              :disabled="cleaningImages || unusedImages.length === 0"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <i :class="cleaningImages ? 'fas fa-spinner fa-spin' : 'fas fa-trash-alt'" class="mr-2"></i>
              {{ cleaningImages ? '清理中...' : '清理未使用图片' }}
            </button>
            <button
              @click="loadImages"
              class="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-md font-bold text-sm transition"
            >
              <i class="fas fa-sync-alt mr-2"></i>刷新
            </button>
            <select
              v-model="imageFilter.usageType"
              @change="loadImages"
              class="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md py-2 px-3 text-sm"
            >
              <option value="">全部用途</option>
              <option value="site_logo">网站图标</option>
              <option value="rich_content">富文本图片</option>
              <option value="setting">设置图片</option>
              <option value="other">其他</option>
            </select>
            <select
              v-model="imageFilter.storageType"
              @change="loadImages"
              class="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md py-2 px-3 text-sm"
            >
              <option value="">全部存储</option>
              <option value="local">本地存储</option>
              <option value="s3">S3 存储</option>
            </select>
          </div>

          <!-- 图片列表 -->
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <div class="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">图片列表</h3>
            </div>
            <div v-if="loadingImages" class="p-12 text-center">
              <i class="fas fa-spinner fa-spin text-4xl text-slate-400"></i>
              <p class="text-slate-400 mt-4">加载中...</p>
            </div>
            <div v-else-if="images.length === 0" class="p-12 text-center text-slate-400">
              <i class="fas fa-images text-4xl mb-4"></i>
              <p>暂无图片</p>
            </div>
            <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
              <div
                v-for="image in images"
                :key="image.id"
                class="group relative bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden aspect-square"
              >
                <img
                  :src="image.url"
                  :alt="image.filename"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div class="text-white text-xs truncate">{{ image.filename }}</div>
                  <div class="flex items-center justify-between">
                    <span class="text-white/80 text-xs">{{ formatFileSize(image.size) }}</span>
                    <button
                      @click="deleteImageById(image.id)"
                      class="text-red-400 hover:text-red-300 transition"
                      title="删除图片"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span
                      class="px-1.5 py-0.5 rounded text-[10px] font-medium"
                      :class="image.storageType === 's3' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'"
                    >
                      {{ image.storageType === 's3' ? 'S3' : '本地' }}
                    </span>
                    <span class="text-white/60 text-[10px]">{{ getUsageTypeLabel(image.usageType) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 分页 -->
            <div v-if="imagePagination.totalPages > 1" class="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-center space-x-2">
              <button
                v-for="page in imagePagination.totalPages"
                :key="page"
                @click="imageFilter.page = page; loadImages()"
                :class="[
                  'w-8 h-8 rounded text-sm font-medium transition',
                  imageFilter.page === page
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                ]"
              >
                {{ page }}
              </button>
            </div>
          </div>
        </div>

        <!-- 网站样式 -->
        <div v-if="activeTab === 'style'" class="space-y-6">
          <!-- 品牌设置 -->
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">品牌设置</h3>
            <form @submit.prevent="saveBranding" class="max-w-2xl space-y-6">
              <!-- 预览区域 -->
              <div class="p-6 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <div class="text-xs font-bold text-slate-500 uppercase mb-4">预览效果</div>
            <div class="flex items-center space-x-3">
                  <div v-if="brandingForm.siteIconType === 'image' && brandingForm.siteLogoUrl" class="w-10 h-10 rounded-md overflow-hidden shadow-md">
                    <img :src="brandingForm.siteLogoUrl" alt="Logo" class="w-full h-full object-cover" />
            </div>
                  <div v-else class="w-10 h-10 rounded-md flex items-center justify-center text-white text-xl font-bold shadow-md" :style="{ backgroundColor: brandingForm.siteIconColor }">
                    <i v-if="brandingForm.siteIconType === 'fa' && brandingForm.siteIcon" :class="brandingForm.siteIcon"></i>
                    <span v-else>{{ brandTextPreview }}</span>
          </div>
                  <span class="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
                    {{ brandingForm.siteName || 'YuzuACG' }}<span v-if="brandingForm.siteSubtitle" class="text-slate-400">{{ brandingForm.siteSubtitle }}</span>
                  </span>
        </div>
      </div>

              <!-- 网站名称 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">网站名称</label>
                  <input v-model="brandingForm.siteName" type="text" class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm" placeholder="例如: YuzuACG" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">副标题 (可选)</label>
                  <input v-model="brandingForm.siteSubtitle" type="text" class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm" placeholder="例如: ACG" />
                  <p class="text-xs text-slate-400 mt-1">副标题会以灰色显示在名称后面</p>
                </div>
              </div>

              <!-- 图标类型选择 -->
              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">图标类型</label>
                <div class="flex space-x-4">
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input v-model="brandingForm.siteIconType" type="radio" value="text" class="w-4 h-4" />
                    <span class="text-sm text-slate-600 dark:text-slate-400">文字图标</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
                    <input v-model="brandingForm.siteIconType" type="radio" value="fa" class="w-4 h-4" />
                    <span class="text-sm text-slate-600 dark:text-slate-400">Font Awesome 图标</span>
                  </label>
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input v-model="brandingForm.siteIconType" type="radio" value="image" class="w-4 h-4" />
                    <span class="text-sm text-slate-600 dark:text-slate-400">自定义图片</span>
            </label>
          </div>
              </div>

              <!-- 文字/FA图标颜色设置 -->
              <div v-if="brandingForm.siteIconType === 'text' || brandingForm.siteIconType === 'fa'" class="space-y-4">
                <div v-if="brandingForm.siteIconType === 'fa'">
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">选择图标</label>
                  <div class="flex space-x-3 mb-3">
                    <input v-model="brandingForm.siteIcon" type="text" class="flex-1 bg-slate-100 dark:bg-slate-700 border-none rounded-md py-2 px-4 text-sm" placeholder="例如: fas fa-rocket" />
                    <div class="w-10 h-10 rounded-md flex items-center justify-center text-white" :style="{ backgroundColor: brandingForm.siteIconColor }">
                      <i v-if="brandingForm.siteIcon" :class="brandingForm.siteIcon"></i>
                      <span v-else>?</span>
                    </div>
                  </div>
                  <div class="grid grid-cols-8 gap-2">
                    <button v-for="icon in brandIcons" :key="icon" type="button" @click="brandingForm.siteIcon = icon" :class="['w-10 h-10 rounded-md flex items-center justify-center transition-colors', brandingForm.siteIcon === icon ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600']">
                      <i :class="icon"></i>
                    </button>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">图标背景颜色</label>
                  <div class="flex items-center space-x-4">
                    <div class="grid grid-cols-6 gap-2">
                      <button v-for="color in presetColors" :key="color" type="button" @click="brandingForm.siteIconColor = color" :class="['w-8 h-8 rounded-md transition-transform', brandingForm.siteIconColor === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : '']" :style="{ backgroundColor: color }"></button>
                    </div>
                    <div class="flex items-center space-x-2">
                      <input v-model="brandingForm.siteIconColor" type="color" class="w-10 h-10 rounded cursor-pointer" />
                      <input v-model="brandingForm.siteIconColor" type="text" class="w-24 bg-slate-100 dark:bg-slate-700 border-none rounded-md py-2 px-3 text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 图片上传设置 -->
              <div v-if="brandingForm.siteIconType === 'image'" class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">上传图标图片</label>
                  <div class="flex items-center space-x-4">
                    <div v-if="brandingForm.siteLogoUrl" class="w-16 h-16 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-600">
                      <img :src="brandingForm.siteLogoUrl" alt="Logo" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                      <i class="fas fa-image text-slate-400 text-xl"></i>
                    </div>
                    <div class="flex-1">
                      <label class="btn-primary text-white px-4 py-2 rounded-md font-bold text-xs uppercase cursor-pointer inline-block">
                        <i class="fas fa-upload mr-2"></i>{{ uploadingLogo ? '上传中...' : '选择图片' }}
                        <input type="file" accept="image/*" class="hidden" @change="uploadLogo" :disabled="uploadingLogo" />
                      </label>
                      <p class="text-xs text-slate-400 mt-2">建议尺寸: 128x128 像素</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">或输入图片 URL</label>
                  <input v-model="brandingForm.siteLogoUrl" type="url" class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm" placeholder="https://example.com/logo.png" />
                </div>
              </div>

              <div v-if="brandingMessage" :class="['text-sm p-4 rounded-md', brandingSuccess ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400']">{{ brandingMessage }}</div>
              <button type="submit" :disabled="brandingLoading" class="btn-primary text-white px-6 py-3 rounded-md font-bold text-sm uppercase disabled:opacity-50">
                <i class="fas fa-save mr-2"></i>{{ brandingLoading ? '保存中...' : '保存品牌设置' }}
              </button>
            </form>
          </div>

          <!-- 页脚设置 -->
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">页脚设置</h3>
            <form @submit.prevent="saveFooter" class="max-w-2xl space-y-6">
              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">自定义页脚 HTML</label>
                <textarea
                  v-model="footerHtml"
                  rows="8"
                  class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm font-mono"
                  placeholder="<p>© 2024 YuzuACG. All rights reserved.</p>&#10;<p>Powered by <a href='#'>YuzuNav</a></p>"
                ></textarea>
                <p class="text-xs text-slate-400 mt-2">支持 HTML 代码，可以添加链接、版权信息等</p>
              </div>
              <!-- 页脚预览 -->
              <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">预览效果</label>
                <div class="p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
                  <div class="text-center text-sm text-slate-500 dark:text-slate-400" v-html="footerHtml || '<p>暂无自定义页脚</p>'"></div>
                </div>
              </div>
              <div v-if="footerMessage" :class="['text-sm p-4 rounded-md', footerSuccess ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400']">{{ footerMessage }}</div>
              <button type="submit" :disabled="footerLoading" class="btn-primary text-white px-6 py-3 rounded-md font-bold text-sm uppercase disabled:opacity-50">
                <i class="fas fa-save mr-2"></i>{{ footerLoading ? '保存中...' : '保存页脚设置' }}
          </button>
        </form>
      </div>
    </div>

        <!-- 系统设置 -->
        <div v-if="activeTab === 'settings'" class="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
          <form @submit.prevent="saveSettings" class="max-w-2xl space-y-6">
            <!-- 用户注册 -->
          <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">用户注册</label>
              <label class="flex items-center space-x-3 cursor-pointer">
                <input v-model="settings.enableRegistration" type="checkbox" class="w-5 h-5 rounded" />
                <span class="text-sm text-slate-600 dark:text-slate-400">允许新用户注册</span>
            </label>
              <p class="text-xs text-slate-400 mt-2">关闭后，新用户将无法注册账号</p>
            </div>

            <!-- 邮件验证 -->
            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">邮件验证</label>
              <label class="flex items-center space-x-3 cursor-pointer">
                <input v-model="settings.enableEmailVerification" type="checkbox" class="w-5 h-5 rounded" />
                <span class="text-sm text-slate-600 dark:text-slate-400">新用户注册时需要验证邮箱</span>
              </label>
            </div>

            <!-- 访客投稿 -->
            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">访客投稿</label>
              <label class="flex items-center space-x-3 cursor-pointer">
                <input v-model="settings.allowGuestSubmit" type="checkbox" class="w-5 h-5 rounded" />
                <span class="text-sm text-slate-600 dark:text-slate-400">允许未登录用户投稿网站</span>
              </label>
              <p class="text-xs text-slate-400 mt-2">关闭后，用户必须登录才能投稿网站</p>
            </div>

            <!-- 全局评论开关 -->
            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">评论功能</label>
              <label class="flex items-center space-x-3 cursor-pointer">
                <input v-model="settings.enableComments" type="checkbox" class="w-5 h-5 rounded" />
                <span class="text-sm text-slate-600 dark:text-slate-400">启用全站评论功能</span>
              </label>
              <p class="text-xs text-slate-400 mt-2">关闭后，所有网站的评论功能都将被禁用</p>
            </div>

            <!-- 全局收藏夹开关 -->
            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">收藏夹功能</label>
              <label class="flex items-center space-x-3 cursor-pointer">
                <input v-model="settings.enableFavorites" type="checkbox" class="w-5 h-5 rounded" />
                <span class="text-sm text-slate-600 dark:text-slate-400">启用收藏夹功能</span>
              </label>
              <p class="text-xs text-slate-400 mt-2">关闭后，首页顶部和网站详情页的收藏按钮都将隐藏</p>
            </div>

            <!-- 文件存储设置（只读，需在 .env 配置） -->
            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                <i class="fas fa-cloud-upload-alt mr-2 text-blue-500"></i>文件存储设置
                <span class="ml-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded">环境变量配置</span>
              </h4>
              <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-4">
                <div class="flex items-start space-x-2 text-sm text-amber-700 dark:text-amber-400">
                  <i class="fas fa-info-circle mt-0.5"></i>
                  <div>
                    <p class="font-medium">此配置需要在服务器 <code class="bg-amber-200 dark:bg-amber-900/40 px-1 rounded">.env</code> 文件中修改</p>
                    <p class="mt-1 text-xs opacity-80">修改后需要重启服务才能生效</p>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">当前存储方式</label>
                  <div class="flex items-center space-x-2">
                    <span :class="[
                      'px-3 py-1.5 rounded-md text-sm font-medium',
                      envConfig.storageType === 's3' 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    ]">
                      <i :class="envConfig.storageType === 's3' ? 'fas fa-cloud' : 'fas fa-hdd'" class="mr-2"></i>
                      {{ envConfig.storageType === 's3' ? 'S3 对象存储' : '本地存储' }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-400 mt-2">
                    环境变量: <code class="bg-slate-200 dark:bg-slate-700 px-1 rounded">STORAGE_TYPE={{ envConfig.storageType || 'local' }}</code>
                  </p>
                </div>
                
                <!-- 本地存储信息 -->
                <div v-if="envConfig.storageType !== 's3'" class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div class="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <i class="fas fa-folder text-green-500"></i>
                    <span>文件存储在服务器 <code class="bg-slate-200 dark:bg-slate-700 px-1 rounded">public/uploads</code> 目录</span>
                  </div>
                </div>

                <!-- S3 存储信息 -->
                <div v-if="envConfig.storageType === 's3'" class="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-slate-400">S3 Bucket:</span>
                      <span class="ml-2 font-mono text-slate-700 dark:text-slate-300">{{ envConfig.s3Bucket || '未配置' }}</span>
                    </div>
                    <div>
                      <span class="text-slate-400">S3 Region:</span>
                      <span class="ml-2 font-mono text-slate-700 dark:text-slate-300">{{ envConfig.s3Region || '未配置' }}</span>
                    </div>
                    <div class="col-span-2" v-if="envConfig.s3Endpoint">
                      <span class="text-slate-400">S3 Endpoint:</span>
                      <span class="ml-2 font-mono text-slate-700 dark:text-slate-300">{{ envConfig.s3Endpoint }}</span>
                    </div>
                    <div class="col-span-2" v-if="envConfig.s3CdnUrl">
                      <span class="text-slate-400">CDN 域名:</span>
                      <span class="ml-2 font-mono text-slate-700 dark:text-slate-300">{{ envConfig.s3CdnUrl }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- SEO 设置 -->
            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                <i class="fas fa-search mr-2 text-green-500"></i>SEO 优化设置
              </h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">网站标题 (Title)</label>
            <input
                    v-model="settings.seoTitle"
              type="text"
                    class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm"
                    placeholder="网站标题"
            />
                  <p class="text-xs text-slate-400 mt-2">显示在浏览器标签页和搜索结果中</p>
          </div>
          <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">网站描述 (Description)</label>
            <textarea
                    v-model="settings.seoDescription"
                    rows="2"
                    class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm resize-none"
                    placeholder="简短描述网站内容，建议 150 字以内"
            ></textarea>
                  <p class="text-xs text-slate-400 mt-2">显示在搜索结果的描述中</p>
          </div>
          <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">关键词 (Keywords)</label>
            <input
                    v-model="settings.seoKeywords"
                    type="text"
                    class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm"
                    placeholder="关键词1, 关键词2, 关键词3"
                  />
                  <p class="text-xs text-slate-400 mt-2">多个关键词用逗号分隔</p>
                </div>
              </div>
            </div>

            <!-- 网站图标设置 -->
            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                <i class="fas fa-image mr-2 text-purple-500"></i>网站图标 (Favicon)
              </h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Favicon URL</label>
                  <div class="flex items-center space-x-4">
                    <div v-if="settings.faviconUrl" class="w-10 h-10 border border-slate-200 dark:border-slate-700 rounded flex items-center justify-center bg-white dark:bg-slate-900">
                      <img :src="settings.faviconUrl" alt="Favicon" class="w-6 h-6 object-contain" />
                    </div>
                    <input
                      v-model="settings.faviconUrl"
              type="url"
                      class="flex-1 bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm"
                      placeholder="https://example.com/favicon.ico"
            />
                  </div>
                  <p class="text-xs text-slate-400 mt-2">浏览器标签页显示的小图标，建议 32x32 或 64x64 像素</p>
          </div>
          <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Apple Touch Icon URL</label>
                  <div class="flex items-center space-x-4">
                    <div v-if="settings.appleTouchIconUrl" class="w-14 h-14 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 overflow-hidden">
                      <img :src="settings.appleTouchIconUrl" alt="Apple Touch Icon" class="w-12 h-12 object-cover" />
                    </div>
            <input
                      v-model="settings.appleTouchIconUrl"
              type="url"
                      class="flex-1 bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm"
                      placeholder="https://example.com/apple-touch-icon.png"
            />
          </div>
                  <p class="text-xs text-slate-400 mt-2">iOS 设备将网站保存到桌面时显示的图标，建议 180x180 像素的 PNG 图片</p>
                </div>
              </div>
            </div>

            <!-- CDN 设置（只读，需在 .env 配置） -->
            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                <i class="fas fa-bolt mr-2 text-yellow-500"></i>CDN 加速设置
                <span class="ml-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded">环境变量配置</span>
              </h4>
              <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-4">
                <div class="flex items-start space-x-2 text-sm text-amber-700 dark:text-amber-400">
                  <i class="fas fa-info-circle mt-0.5"></i>
                  <div>
                    <p class="font-medium">此配置需要在服务器 <code class="bg-amber-200 dark:bg-amber-900/40 px-1 rounded">.env</code> 文件中修改</p>
                    <p class="mt-1 text-xs opacity-80">修改后需要重启服务才能生效</p>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">当前 CDN 提供商</label>
                  <div class="flex items-center space-x-2">
                    <span class="px-3 py-1.5 rounded-md text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                      <i class="fas fa-bolt mr-2"></i>
                      {{ getCdnProviderLabel(envConfig.cdnProvider) }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-400 mt-2">
                    环境变量: <code class="bg-slate-200 dark:bg-slate-700 px-1 rounded">CDN_PROVIDER={{ envConfig.cdnProvider || 'local' }}</code>
                  </p>
                </div>
                <div v-if="envConfig.cdnProvider === 'custom' && envConfig.customCdnUrl">
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">自定义 CDN URL</label>
                  <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <code class="text-sm font-mono text-slate-700 dark:text-slate-300">{{ envConfig.customCdnUrl }}</code>
                  </div>
                </div>
                <!-- 可用的 CDN 选项说明 -->
                <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div class="text-xs font-bold text-slate-500 uppercase mb-2">可用选项</div>
                  <div class="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div><code class="bg-slate-200 dark:bg-slate-700 px-1 rounded">local</code> - 本地（不使用 CDN）</div>
                    <div><code class="bg-slate-200 dark:bg-slate-700 px-1 rounded">jsdelivr</code> - jsDelivr（推荐）</div>
                    <div><code class="bg-slate-200 dark:bg-slate-700 px-1 rounded">unpkg</code> - UNPKG</div>
                    <div><code class="bg-slate-200 dark:bg-slate-700 px-1 rounded">cdnjs</code> - cdnjs (Cloudflare)</div>
                    <div><code class="bg-slate-200 dark:bg-slate-700 px-1 rounded">bootcdn</code> - BootCDN（国内）</div>
                    <div><code class="bg-slate-200 dark:bg-slate-700 px-1 rounded">staticfile</code> - 七牛云</div>
                    <div class="col-span-2"><code class="bg-slate-200 dark:bg-slate-700 px-1 rounded">custom</code> - 自定义（需配置 CUSTOM_CDN_URL）</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 网站 URL -->
            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">网站地址</h4>
          <div>
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">网站 URL</label>
            <input
                  v-model="settings.siteUrl"
              type="url"
                  class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm"
                  placeholder="https://example.com"
            />
                <p class="text-xs text-slate-400 mt-2">用于生成网站地图、IndexNow 提交等功能</p>
          </div>
            </div>

            <!-- 跳转链接参数设置 -->
            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">跳转链接参数</h4>
              <div class="space-y-4">
          <div>
                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input v-model="settings.enableRefParam" type="checkbox" class="w-5 h-5 rounded" />
                    <span class="text-sm text-slate-600 dark:text-slate-400">在跳转链接后添加来源参数</span>
            </label>
                </div>
                <div v-if="settings.enableRefParam">
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">参数格式</label>
            <input
                    v-model="settings.refParamFormat"
              type="text"
                    class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm font-mono"
                    placeholder="?ref={site}"
                  />
                  <p class="text-xs text-slate-400 mt-2">
                    可用变量：<code class="bg-slate-200 dark:bg-slate-600 px-1 rounded">{site}</code> = 本站域名
                  </p>
                  <!-- 预览 -->
                  <div class="mt-3 p-3 bg-slate-100 dark:bg-slate-700 rounded-md">
                    <div class="text-xs font-bold text-slate-500 uppercase mb-2">预览效果</div>
                    <div class="text-sm text-slate-600 dark:text-slate-400 font-mono break-all">
                      https://example.com/{{ refParamPreview }}
          </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- IndexNow 设置 -->
            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                <i class="fas fa-search mr-2 text-blue-500"></i>IndexNow 搜索引擎推送
              </h4>
              <p class="text-xs text-slate-400 mb-4">
                当网站添加或审核通过时，自动向搜索引擎（Bing、Yandex 等）提交页面 URL
              </p>
              <div class="space-y-4">
          <div>
                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input v-model="settings.indexNowEnabled" type="checkbox" class="w-5 h-5 rounded" />
                    <span class="text-sm text-slate-600 dark:text-slate-400">启用 IndexNow 自动推送</span>
            </label>
          </div>
                <div v-if="settings.indexNowEnabled">
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">API Key</label>
              <input
                    v-model="settings.indexNowApiKey"
                    type="text"
                    class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm font-mono"
                    placeholder="输入您的 IndexNow API Key"
                  />
                  <p class="text-xs text-slate-400 mt-2">
                    获取 API Key：访问 <a href="https://www.bing.com/indexnow" target="_blank" class="text-blue-500 hover:underline">Bing IndexNow</a> 
                    或直接使用任意 8-128 位字符串作为 Key
                  </p>
                  <!-- 验证文件提示 -->
                  <div v-if="settings.indexNowApiKey && settings.siteUrl" class="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <div class="flex items-start space-x-2">
                      <i class="fas fa-check-circle text-green-500 mt-0.5"></i>
                      <div class="text-xs text-green-700 dark:text-green-400">
                        <p class="font-bold mb-1">验证文件已自动配置</p>
                        <p>搜索引擎将通过以下地址验证您的 API Key：</p>
                        <code class="block mt-1 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded break-all">
                          {{ settings.siteUrl }}/{{ settings.indexNowApiKey }}.txt
                        </code>
          </div>
          </div>
                  </div>
                  <div v-else-if="settings.indexNowApiKey && !settings.siteUrl" class="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                    <div class="flex items-start space-x-2">
                      <i class="fas fa-exclamation-triangle text-amber-500 mt-0.5"></i>
                      <div class="text-xs text-amber-700 dark:text-amber-400">
                        请先填写网站 URL，否则 IndexNow 将无法正常工作
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 自定义代码 -->
            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                <i class="fas fa-code mr-2 text-orange-500"></i>自定义代码
              </h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">头部代码 (Head)</label>
                  <textarea
                    v-model="settings.customHeadCode"
                    rows="4"
                    class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm font-mono resize-none"
                    placeholder="<!-- 添加到 <head> 标签内的代码，如统计代码、Meta 标签等 -->&#10;<script>...</script>&#10;<meta name='...' content='...' />"
                  ></textarea>
                  <p class="text-xs text-slate-400 mt-2">此代码将添加到页面 &lt;head&gt; 标签内，适合放置统计代码、验证代码等</p>
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">底部代码 (Body 末尾)</label>
                  <textarea
                    v-model="settings.customBodyCode"
                    rows="4"
                    class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm font-mono resize-none"
                    placeholder="<!-- 添加到 </body> 标签前的代码，如客服系统、分析脚本等 -->&#10;<script>...</script>"
                  ></textarea>
                  <p class="text-xs text-slate-400 mt-2">此代码将添加到页面 &lt;/body&gt; 标签前，适合放置客服系统、延迟加载的脚本等</p>
                </div>
                <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div class="flex items-start space-x-2 text-sm text-amber-700 dark:text-amber-400">
                    <i class="fas fa-exclamation-triangle mt-0.5"></i>
                    <div>
                      <p class="font-medium">安全提示</p>
                      <p class="mt-1 text-xs opacity-80">请确保添加的代码来源可信，恶意代码可能影响网站安全和用户体验</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" class="btn-primary text-white px-6 py-3 rounded-md font-bold text-sm uppercase"><i class="fas fa-save mr-2"></i>保存设置</button>
        </form>
      </div>

        <!-- 账号设置 -->
        <div v-if="activeTab === 'profile'" class="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
          <form @submit.prevent="saveProfile" class="max-w-lg space-y-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">用户名</label>
              <input v-model="profileForm.username" type="text" class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm" placeholder="输入新用户名" />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">邮箱</label>
              <input v-model="profileForm.email" type="email" class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm" placeholder="输入新邮箱" />
            </div>
            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">修改密码</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">当前密码</label>
                  <input v-model="profileForm.currentPassword" type="password" class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm" placeholder="输入当前密码" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">新密码</label>
                  <input v-model="profileForm.newPassword" type="password" class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm" placeholder="输入新密码 (至少6个字符)" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">确认新密码</label>
                  <input v-model="profileForm.confirmPassword" type="password" class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-3 px-4 text-sm" placeholder="再次输入新密码" />
                </div>
              </div>
            </div>
            <div v-if="profileMessage" :class="['text-sm p-4 rounded-md', profileSuccess ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400']">{{ profileMessage }}</div>
            <button type="submit" :disabled="profileLoading" class="btn-primary text-white px-6 py-3 rounded-md font-bold text-sm uppercase disabled:opacity-50">
              <i class="fas fa-save mr-2"></i>{{ profileLoading ? '保存中...' : '保存修改' }}
            </button>
          </form>
    </div>

        <!-- 关于程序 -->
        <div v-if="activeTab === 'about'" class="space-y-6">
          <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8">
            <div class="flex items-center space-x-4 mb-8">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                Y
              </div>
              <div>
                <h2 class="text-2xl font-black text-slate-900 dark:text-white">YuzuNav</h2>
                <p class="text-slate-500">v1.0.0</p>
              </div>
            </div>

            <div class="prose dark:prose-invert max-w-none">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">关于项目</h3>
              <p class="text-slate-600 dark:text-slate-400 mb-6">
                YuzuNav 是一个现代化的网站导航程序，专为资源聚合和网站收藏设计。基于 Nuxt 3 + Prisma + Tailwind CSS 构建，
                提供简洁美观的界面和强大的后台管理功能。
              </p>

              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">主要功能</h3>
              <ul class="text-slate-600 dark:text-slate-400 space-y-2 mb-6">
                <li><i class="fas fa-check text-green-500 mr-2"></i>网站分类管理与标签系统</li>
                <li><i class="fas fa-check text-green-500 mr-2"></i>用户注册、登录与邮箱验证</li>
                <li><i class="fas fa-check text-green-500 mr-2"></i>用户投稿与审核机制</li>
                <li><i class="fas fa-check text-green-500 mr-2"></i>网站收藏与评论功能</li>
                <li><i class="fas fa-check text-green-500 mr-2"></i>访问统计与数据分析</li>
                <li><i class="fas fa-check text-green-500 mr-2"></i>SEO 优化与 IndexNow 推送</li>
                <li><i class="fas fa-check text-green-500 mr-2"></i>响应式设计，支持深色模式</li>
                <li><i class="fas fa-check text-green-500 mr-2"></i>BBCode 富文本编辑器</li>
              </ul>

              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">技术栈</h3>
              <div class="flex flex-wrap gap-2 mb-6">
                <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">Nuxt 3</span>
                <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">Vue 3</span>
                <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium">Prisma</span>
                <span class="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-full text-sm font-medium">Tailwind CSS</span>
                <span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium">TypeScript</span>
              </div>

              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">开源协议</h3>
              <p class="text-slate-600 dark:text-slate-400">
                本项目基于 MIT 协议开源，您可以自由使用、修改和分发。
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 用户编辑弹窗 -->
    <div v-if="showUserForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showUserForm = false">
      <div class="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">编辑用户</h3>
        <form @submit.prevent="handleSaveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">用户名</label>
            <input v-model="userForm.username" type="text" class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-2 px-4 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">角色</label>
            <select v-model="userForm.role" class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-2 px-4 text-sm">
              <option value="user">普通用户</option>
              <option value="admin">管理员</option>
            </select>
          </div>
          <div>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input v-model="userForm.emailVerified" type="checkbox" class="w-4 h-4 rounded" />
              <span class="text-sm font-bold text-slate-700 dark:text-slate-300">邮箱已验证</span>
            </label>
          </div>
          <div class="flex space-x-3 pt-4">
            <button type="submit" class="flex-1 btn-primary text-white py-3 rounded-md font-bold text-sm uppercase">保存</button>
            <button type="button" @click="showUserForm = false" class="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white py-3 rounded-md font-bold text-sm uppercase">取消</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 分类表单弹窗 -->
    <div v-if="showCategoryForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showCategoryForm = false">
      <div class="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto" @click.stop>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">
          {{ editingCategory ? '编辑分类' : (categoryForm.parentId ? '添加子分类' : '添加分类') }}
        </h3>
        <form @submit.prevent="handleSaveCategory" class="space-y-4">
          <!-- 父分类选择 -->
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">父分类</label>
            <select v-model="categoryForm.parentId" class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-2 px-4 text-sm">
              <option :value="null">无（顶级分类）</option>
              <option v-for="cat in topLevelCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <p class="text-xs text-slate-400 mt-1">选择父分类可创建子分类</p>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">分类名称 *</label>
            <input v-model="categoryForm.name" type="text" required class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-2 px-4 text-sm" placeholder="例如: 动漫资源" />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">分类标识 (slug) *</label>
            <input v-model="categoryForm.slug" type="text" required class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-2 px-4 text-sm" placeholder="例如: anime" />
            <p class="text-xs text-slate-400 mt-1">用于 URL，只能包含字母、数字和连字符</p>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">图标 (Font Awesome)</label>
            <div class="flex space-x-3">
              <input v-model="categoryForm.icon" type="text" class="flex-1 bg-slate-100 dark:bg-slate-700 border-none rounded-md py-2 px-4 text-sm" placeholder="例如: fas fa-film" />
              <div class="w-12 h-10 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center">
                <i :class="categoryForm.icon || 'fas fa-folder'" class="text-slate-500"></i>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">快速选择图标</label>
            <div class="grid grid-cols-8 gap-2">
              <button v-for="icon in commonIcons" :key="icon" type="button" @click="categoryForm.icon = icon" :class="['w-10 h-10 rounded-md flex items-center justify-center transition-colors', categoryForm.icon === icon ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600']">
                <i :class="icon"></i>
            </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">排序</label>
            <input v-model.number="categoryForm.sortOrder" type="number" class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-2 px-4 text-sm" placeholder="0" />
            <p class="text-xs text-slate-400 mt-1">数字越小排序越靠前，默认为 0</p>
          </div>
          <div class="flex space-x-3 pt-4">
            <button type="submit" class="flex-1 btn-primary text-white py-3 rounded-md font-bold text-sm uppercase">{{ editingCategory ? '保存修改' : '添加分类' }}</button>
            <button type="button" @click="showCategoryForm = false" class="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white py-3 rounded-md font-bold text-sm uppercase">取消</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 标签表单弹窗 -->
    <div v-if="showTagForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showTagForm = false">
      <div class="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">{{ editingTag ? '编辑标签' : '添加标签' }}</h3>
        <form @submit.prevent="handleSaveTag" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">标签名称 *</label>
            <input v-model="tagForm.name" type="text" required class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-2 px-4 text-sm" placeholder="例如: 免费资源" />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">标签标识 (slug) *</label>
            <input v-model="tagForm.slug" type="text" required class="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-md py-2 px-4 text-sm" placeholder="例如: free" />
            <p class="text-xs text-slate-400 mt-1">用于 URL，只能包含字母、数字和连字符</p>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">标签颜色</label>
            <div class="flex space-x-3">
              <input v-model="tagForm.color" type="color" class="w-12 h-10 rounded-md cursor-pointer" />
              <input v-model="tagForm.color" type="text" class="flex-1 bg-slate-100 dark:bg-slate-700 border-none rounded-md py-2 px-4 text-sm font-mono" placeholder="#6366f1" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">预设颜色</label>
            <div class="grid grid-cols-8 gap-2">
              <button v-for="color in tagColors" :key="color" type="button" @click="tagForm.color = color" :class="['w-10 h-10 rounded-md transition-all', tagForm.color === color ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white' : '']" :style="{ backgroundColor: color }"></button>
            </div>
          </div>
          <div class="flex space-x-3 pt-4">
            <button type="submit" class="flex-1 btn-primary text-white py-3 rounded-md font-bold text-sm uppercase">{{ editingTag ? '保存修改' : '添加标签' }}</button>
            <button type="button" @click="showTagForm = false" class="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white py-3 rounded-md font-bold text-sm uppercase">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { isAdmin } = useAuth()
const toast = useToast()
const activeTab = ref('dashboard')
const showUserForm = ref(false)
const showCategoryForm = ref(false)
const editingUser = ref<any>(null)
const editingCategory = ref<any>(null)

const stats = ref({ totalUsers: 0, totalSites: 0, pendingSites: 0, totalComments: 0, totalCategories: 0 })
const allSites = ref<any[]>([])
const pendingSites = ref<any[]>([])
const users = ref<any[]>([])
const categories = ref<any[]>([])
const tags = ref<any[]>([])
const showTagForm = ref(false)
const editingTag = ref<any>(null)
const tagForm = ref({ name: '', slug: '', color: '#6366f1' })

// 图片管理
const images = ref<any[]>([])
const unusedImages = ref<any[]>([])
const loadingImages = ref(false)
const cleaningImages = ref(false)
const imageStats = ref({ total: 0, totalSize: 0 })
const imagePagination = ref({ page: 1, limit: 24, total: 0, totalPages: 0 })
const imageFilter = ref({ page: 1, usageType: '', storageType: '' })
const unusedImagesSize = computed(() => unusedImages.value.reduce((sum, img) => sum + img.size, 0))
const settings = ref({
  enableRegistration: true,
  enableEmailVerification: false,
  allowGuestSubmit: false,
  enableComments: true,
  enableFavorites: true,
  enableRefParam: false,
  refParamFormat: '?ref={site}',
  siteUrl: '',
  indexNowEnabled: false,
  indexNowApiKey: '',
  // SEO 设置
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  // 图标设置
  faviconUrl: '',
  appleTouchIconUrl: '',
  // 自定义代码
  customHeadCode: '',
  customBodyCode: '',
})

// 环境变量配置（只读显示）
const envConfig = ref({
  cdnProvider: 'local',
  customCdnUrl: '',
  storageType: 'local',
  s3Bucket: '',
  s3Region: '',
  s3Endpoint: '',
  s3CdnUrl: '',
})

// CDN 提供商标签
const getCdnProviderLabel = (provider: string): string => {
  const labels: Record<string, string> = {
    'local': '本地（不使用 CDN）',
    'jsdelivr': 'jsDelivr（推荐）',
    'unpkg': 'UNPKG',
    'cdnjs': 'cdnjs (Cloudflare)',
    'bootcdn': 'BootCDN（国内加速）',
    'staticfile': 'Staticfile（七牛云）',
    'custom': '自定义 CDN',
  }
  return labels[provider] || provider || '本地（不使用 CDN）'
}

// 品牌设置
const brandingForm = ref({ siteName: 'YuzuACG', siteSubtitle: '', siteIcon: '', siteIconType: 'text', siteIconColor: '#1e293b', siteLogoUrl: '' })
const brandingLoading = ref(false)
const brandingMessage = ref('')
const brandingSuccess = ref(false)
const uploadingLogo = ref(false)

// 页脚设置
const footerHtml = ref('')
const footerLoading = ref(false)
const footerMessage = ref('')
const footerSuccess = ref(false)

const userForm = ref({ username: '', role: 'user', emailVerified: false })
const categoryForm = ref({ name: '', slug: '', icon: '', parentId: null as number | null, sortOrder: 0 })
const profileForm = ref({ username: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '' })
const profileLoading = ref(false)
const profileMessage = ref('')
const profileSuccess = ref(false)

const commonIcons = ['fas fa-film', 'fas fa-gamepad', 'fas fa-music', 'fas fa-book', 'fas fa-image', 'fas fa-video', 'fas fa-tv', 'fas fa-headphones', 'fas fa-paint-brush', 'fas fa-camera', 'fas fa-code', 'fas fa-globe', 'fas fa-star', 'fas fa-heart', 'fas fa-folder', 'fas fa-archive']
const brandIcons = ['fas fa-home', 'fas fa-compass', 'fas fa-rocket', 'fas fa-bolt', 'fas fa-fire', 'fas fa-gem', 'fas fa-crown', 'fas fa-leaf', 'fas fa-moon', 'fas fa-sun', 'fas fa-cloud', 'fas fa-anchor', 'fab fa-discord', 'fab fa-github', 'fab fa-twitter', 'fab fa-youtube']
const presetColors = ['#1e293b', '#0f172a', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#2563eb', '#7c3aed', '#db2777', '#000000', '#6366f1']
const tagColors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9']

const tabs = [
  { id: 'dashboard', label: '仪表盘', icon: 'fas fa-chart-pie' },
  { id: 'manage-sites', label: '网站列表', icon: 'fas fa-globe' },
  { id: 'sites', label: '待审核', icon: 'fas fa-clock' },
  { id: 'users', label: '用户管理', icon: 'fas fa-users' },
  { id: 'categories', label: '分类管理', icon: 'fas fa-folder' },
  { id: 'tags', label: '标签管理', icon: 'fas fa-tags' },
  { id: 'images', label: '图片管理', icon: 'fas fa-images' },
  { id: 'style', label: '网站样式', icon: 'fas fa-palette' },
  { id: 'settings', label: '系统设置', icon: 'fas fa-cog' },
  { id: 'profile', label: '账号设置', icon: 'fas fa-user-cog' },
  { id: 'about', label: '关于程序', icon: 'fas fa-info-circle' },
]

const currentTabLabel = computed(() => tabs.find(t => t.id === activeTab.value)?.label || '')
const currentTabDescription = computed(() => {
  const descriptions: Record<string, string> = {
    'dashboard': '查看网站整体数据统计',
    'manage-sites': '管理所有网站资源',
    'sites': '审核用户提交的网站',
    'users': '管理注册用户',
    'categories': '管理网站分类',
    'tags': '管理网站标签',
    'images': '管理上传的图片资源',
    'style': '自定义网站外观和页脚',
    'settings': '配置系统参数',
    'profile': '修改管理员账号信息',
    'about': '了解程序信息与技术栈',
  }
  return descriptions[activeTab.value] || ''
})

const brandTextPreview = computed(() => (brandingForm.value.siteName || 'Y').charAt(0).toUpperCase())

const resetCategoryForm = () => { categoryForm.value = { name: '', slug: '', icon: '', parentId: null, sortOrder: 0 } }

// 顶级分类（没有父分类的）
const topLevelCategories = computed(() => categories.value.filter(c => !c.parentId))

// 添加子分类
const addSubCategory = (parent: any) => {
  resetCategoryForm()
  categoryForm.value.parentId = parent.id
  editingCategory.value = null
  showCategoryForm.value = true
}

const loadStats = async () => { try { const r = await $fetch<{ success: boolean; data: any }>('/api/admin/stats'); stats.value = r.data } catch (e) { console.error(e) } }
const loadAllSites = async () => { try { const r = await $fetch<{ success: boolean; data: any[] }>('/api/admin/sites'); allSites.value = r.data } catch (e) { console.error(e) } }
const loadPendingSites = async () => { try { const r = await $fetch<{ success: boolean; data: any[] }>('/api/admin/sites?status=pending'); pendingSites.value = r.data } catch (e) { console.error(e) } }
const loadUsers = async () => { try { const r = await $fetch<{ success: boolean; data: any[] }>('/api/admin/users'); users.value = r.data } catch (e) { console.error(e) } }
const loadCategories = async () => { try { const r = await $fetch<{ success: boolean; data: any[] }>('/api/admin/categories'); categories.value = r.data } catch (e) { console.error(e) } }

// 图片管理函数
const loadImages = async () => {
  loadingImages.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', String(imageFilter.value.page))
    params.append('limit', '24')
    if (imageFilter.value.usageType) params.append('usageType', imageFilter.value.usageType)
    if (imageFilter.value.storageType) params.append('storageType', imageFilter.value.storageType)
    
    const r = await $fetch<{ success: boolean; data: any[]; pagination: any; stats: any }>(`/api/admin/images?${params}`)
    images.value = r.data
    imagePagination.value = r.pagination
    imageStats.value = { total: r.pagination.total, totalSize: r.stats.totalSize }
  } catch (e) {
    console.error(e)
  } finally {
    loadingImages.value = false
  }
}

const loadUnusedImages = async () => {
  try {
    const r = await $fetch<{ success: boolean; data: any[] }>('/api/admin/images/unused')
    unusedImages.value = r.data
  } catch (e) {
    console.error(e)
  }
}

const deleteImageById = async (id: string) => {
  if (!confirm('确定要删除这张图片吗？')) return
  try {
    await $fetch(`/api/admin/images/${id}`, { method: 'DELETE' })
    toast.success('图片已删除')
    await loadImages()
    await loadUnusedImages()
  } catch (e: any) {
    toast.error(e.data?.message || '删除失败')
  }
}

const cleanupImages = async () => {
  if (!confirm(`确定要清理 ${unusedImages.value.length} 张未使用的图片吗？\n注意：只会删除上传超过 24 小时的图片`)) return
  cleaningImages.value = true
  try {
    const r = await $fetch<{ success: boolean; deleted: number; message: string }>('/api/admin/images/cleanup', { method: 'POST' })
    toast.success(r.message)
    await loadImages()
    await loadUnusedImages()
  } catch (e: any) {
    toast.error(e.data?.message || '清理失败')
  } finally {
    cleaningImages.value = false
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getUsageTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'site_logo': '网站图标',
    'rich_content': '富文本',
    'setting': '设置',
    'other': '其他',
  }
  return labels[type] || type
}
const loadSettings = async () => {
  try {
    const r = await $fetch<{ success: boolean; data: any }>('/api/admin/settings')
    settings.value = {
      enableRegistration: r.data.enableRegistration !== false, // 默认开启
      enableEmailVerification: r.data.enableEmailVerification || false,
      allowGuestSubmit: r.data.allowGuestSubmit || false,
      enableComments: r.data.enableComments !== false, // 默认开启
      enableFavorites: r.data.enableFavorites !== false, // 默认开启
      enableRefParam: r.data.enableRefParam || false,
      refParamFormat: r.data.refParamFormat || '?ref={site}',
      siteUrl: r.data.site_url || '',
      indexNowEnabled: r.data.indexnow_enabled || false,
      indexNowApiKey: r.data.indexnow_api_key || '',
      // SEO 设置
      seoTitle: r.data.seo_title || '',
      seoDescription: r.data.seo_description || '',
      seoKeywords: r.data.seo_keywords || '',
      // 图标设置
      faviconUrl: r.data.favicon_url || '',
      appleTouchIconUrl: r.data.apple_touch_icon_url || '',
      // 自定义代码
      customHeadCode: r.data.custom_head_code || '',
      customBodyCode: r.data.custom_body_code || '',
    }
    // 环境变量配置（只读）
    envConfig.value = {
      cdnProvider: r.data.cdn_provider || 'local',
      customCdnUrl: r.data.custom_cdn_url || '',
      storageType: r.data.storage_type || 'local',
      s3Bucket: r.data.s3_bucket || '',
      s3Region: r.data.s3_region || '',
      s3Endpoint: r.data.s3_endpoint || '',
      s3CdnUrl: r.data.s3_cdn_url || '',
    }
  } catch (e) { 
    console.error(e) 
  } 
}

const deleteSite = async (id: string) => { if (!confirm('确定要删除此网站吗？')) return; try { await $fetch(`/api/sites/${id}`, { method: 'DELETE' }); toast.success('网站已删除'); await loadAllSites(); await loadPendingSites(); await loadStats() } catch (e: any) { toast.error(e.data?.message || '删除失败') } }

const editUser = (user: any) => { editingUser.value = user; userForm.value = { username: user.username || '', role: user.role, emailVerified: user.emailVerified }; showUserForm.value = true }
const handleSaveUser = async () => { try { await $fetch(`/api/admin/users/${editingUser.value.id}`, { method: 'PUT', body: userForm.value }); showUserForm.value = false; editingUser.value = null; toast.success('用户信息已保存'); await loadUsers(); await loadStats() } catch (e: any) { toast.error(e.data?.message || '保存失败') } }

const approveSite = async (id: string) => { try { await $fetch(`/api/admin/sites/${id}/approve`, { method: 'POST' }); toast.success('网站已批准'); await loadPendingSites(); await loadAllSites(); await loadStats() } catch (e) { toast.error('操作失败') } }
const rejectSite = async (id: string) => { try { await $fetch(`/api/admin/sites/${id}/reject`, { method: 'POST' }); toast.success('网站已拒绝'); await loadPendingSites(); await loadAllSites(); await loadStats() } catch (e) { toast.error('操作失败') } }

const editCategory = (category: any) => { editingCategory.value = category; categoryForm.value = { name: category.name, slug: category.slug, icon: category.icon || '', parentId: category.parentId || null, sortOrder: category.sortOrder || 0 }; showCategoryForm.value = true }
const handleSaveCategory = async () => { try { if (editingCategory.value) { await $fetch(`/api/admin/categories/${editingCategory.value.id}`, { method: 'PUT', body: categoryForm.value }) } else { await $fetch('/api/admin/categories', { method: 'POST', body: categoryForm.value }) }; showCategoryForm.value = false; editingCategory.value = null; resetCategoryForm(); toast.success('分类已保存'); await loadCategories(); await loadStats() } catch (e: any) { toast.error(e.data?.message || '保存失败') } }
const deleteCategory = async (id: number) => { if (!confirm('确定要删除此分类吗？')) return; try { await $fetch(`/api/admin/categories/${id}`, { method: 'DELETE' }); toast.success('分类已删除'); await loadCategories(); await loadStats() } catch (e: any) { toast.error(e.data?.message || '删除失败') } }

// 标签管理
const loadTags = async () => { try { const r = await $fetch<{ success: boolean; data: any[] }>('/api/admin/tags'); tags.value = r.data } catch (e) { console.error(e) } }
const resetTagForm = () => { tagForm.value = { name: '', slug: '', color: '#6366f1' } }
const editTag = (tag: any) => { editingTag.value = tag; tagForm.value = { name: tag.name, slug: tag.slug, color: tag.color || '#6366f1' }; showTagForm.value = true }
const handleSaveTag = async () => { try { if (editingTag.value) { await $fetch(`/api/admin/tags/${editingTag.value.id}`, { method: 'PUT', body: tagForm.value }) } else { await $fetch('/api/admin/tags', { method: 'POST', body: tagForm.value }) }; showTagForm.value = false; editingTag.value = null; resetTagForm(); toast.success('标签已保存'); await loadTags() } catch (e: any) { toast.error(e.data?.message || '保存失败') } }
const deleteTag = async (id: number) => { if (!confirm('确定要删除此标签吗？')) return; try { await $fetch(`/api/admin/tags/${id}`, { method: 'DELETE' }); toast.success('标签已删除'); await loadTags() } catch (e: any) { toast.error(e.data?.message || '删除失败') } }

const saveSettings = async () => {
  try {
    await $fetch('/api/admin/settings', {
      method: 'POST',
      body: {
        settings: {
          enableRegistration: { value: settings.value.enableRegistration, type: 'boolean' },
          enableEmailVerification: { value: settings.value.enableEmailVerification, type: 'boolean' },
          allowGuestSubmit: { value: settings.value.allowGuestSubmit, type: 'boolean' },
          enableComments: { value: settings.value.enableComments, type: 'boolean' },
          enableFavorites: { value: settings.value.enableFavorites, type: 'boolean' },
          enableRefParam: { value: settings.value.enableRefParam, type: 'boolean' },
          refParamFormat: { value: settings.value.refParamFormat, type: 'string' },
          site_url: { value: settings.value.siteUrl, type: 'string' },
          indexnow_enabled: { value: settings.value.indexNowEnabled, type: 'boolean' },
          indexnow_api_key: { value: settings.value.indexNowApiKey, type: 'string' },
          // SEO 设置
          seo_title: { value: settings.value.seoTitle, type: 'string' },
          seo_description: { value: settings.value.seoDescription, type: 'string' },
          seo_keywords: { value: settings.value.seoKeywords, type: 'string' },
          // 图标设置
          favicon_url: { value: settings.value.faviconUrl, type: 'string' },
          apple_touch_icon_url: { value: settings.value.appleTouchIconUrl, type: 'string' },
          // 自定义代码
          custom_head_code: { value: settings.value.customHeadCode, type: 'string' },
          custom_body_code: { value: settings.value.customBodyCode, type: 'string' },
          // 注意：CDN 和存储设置需要在 .env 文件中配置
        } 
      } 
    }); 
    toast.success('设置已保存')
  } catch (e) { 
    toast.error('保存失败')
  }
}

// 预览参数格式
const refParamPreview = computed(() => {
  if (!settings.value.refParamFormat) return '?ref={site}'
  const siteHost = typeof window !== 'undefined' ? window.location.host : 'yoursite.com'
  return settings.value.refParamFormat.replace('{site}', siteHost)
})

const loadBranding = async () => { try { const r = await $fetch<{ success: boolean; data: any }>('/api/settings/site'); if (r.data) { brandingForm.value = { ...brandingForm.value, ...r.data }; footerHtml.value = r.data.footerHtml || '' } } catch (e) { console.error(e) } }
const saveBranding = async () => { brandingMessage.value = ''; brandingSuccess.value = false; brandingLoading.value = true; try { await $fetch('/api/admin/settings', { method: 'POST', body: { settings: { siteName: { value: brandingForm.value.siteName, type: 'string' }, siteSubtitle: { value: brandingForm.value.siteSubtitle, type: 'string' }, siteIcon: { value: brandingForm.value.siteIcon, type: 'string' }, siteIconType: { value: brandingForm.value.siteIconType, type: 'string' }, siteIconColor: { value: brandingForm.value.siteIconColor, type: 'string' }, siteLogoUrl: { value: brandingForm.value.siteLogoUrl, type: 'string' } } } }); brandingSuccess.value = true; brandingMessage.value = '品牌设置已保存，刷新页面后生效' } catch (e: any) { brandingMessage.value = e.data?.message || '保存失败' } finally { brandingLoading.value = false } }
const saveFooter = async () => { footerMessage.value = ''; footerSuccess.value = false; footerLoading.value = true; try { await $fetch('/api/admin/settings', { method: 'POST', body: { settings: { footerHtml: { value: footerHtml.value, type: 'string' } } } }); footerSuccess.value = true; footerMessage.value = '页脚设置已保存' } catch (e: any) { footerMessage.value = e.data?.message || '保存失败' } finally { footerLoading.value = false } }
const uploadLogo = async (event: Event) => { const input = event.target as HTMLInputElement; if (!input.files || input.files.length === 0) return; const file = input.files[0]; if (!file.type.startsWith('image/')) { toast.error('请选择图片文件'); return }; uploadingLogo.value = true; try { const formData = new FormData(); formData.append('file', file); const r = await $fetch<{ success: boolean; url: string }>('/api/upload?usageType=setting', { method: 'POST', body: formData }); if (r.url) { brandingForm.value.siteLogoUrl = r.url; brandingForm.value.siteIconType = 'image'; toast.success('图标上传成功') } } catch (e: any) { toast.error(e.data?.message || '上传失败') } finally { uploadingLogo.value = false; input.value = '' } }

const saveProfile = async () => { profileMessage.value = ''; profileSuccess.value = false; if (profileForm.value.newPassword && profileForm.value.newPassword !== profileForm.value.confirmPassword) { profileMessage.value = '两次输入的新密码不一致'; return }; if (profileForm.value.newPassword && !profileForm.value.currentPassword) { profileMessage.value = '修改密码需要提供当前密码'; return }; profileLoading.value = true; try { const data: any = {}; if (profileForm.value.username) data.username = profileForm.value.username; if (profileForm.value.email) data.email = profileForm.value.email; if (profileForm.value.currentPassword && profileForm.value.newPassword) { data.currentPassword = profileForm.value.currentPassword; data.newPassword = profileForm.value.newPassword }; const r = await $fetch<{ success: boolean; message: string }>('/api/admin/profile', { method: 'PUT', body: data }); profileSuccess.value = true; profileMessage.value = r.message || '账号信息已更新'; profileForm.value.currentPassword = ''; profileForm.value.newPassword = ''; profileForm.value.confirmPassword = '' } catch (e: any) { profileMessage.value = e.data?.message || '更新失败' } finally { profileLoading.value = false } }
const loadProfile = async () => { try { const r = await $fetch<{ user: any }>('/api/auth/me'); if (r.user) { profileForm.value.username = r.user.username || ''; profileForm.value.email = r.user.email || '' } } catch (e) { console.error(e) } }

onMounted(async () => { if (!isAdmin.value) { navigateTo('/'); return }; await Promise.all([loadStats(), loadAllSites(), loadPendingSites(), loadUsers(), loadCategories(), loadTags(), loadSettings(), loadProfile(), loadBranding(), loadImages(), loadUnusedImages()]) })
</script>
