<template>
  <div class="min-h-screen flex items-center justify-center px-4 light-bg dark:dark-bg">
    <div class="max-w-2xl w-full">
      <!-- 错误图标 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
          <i class="fas fa-exclamation-triangle text-4xl text-red-500"></i>
        </div>
        <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-2">
          {{ errorTitle }}
        </h1>
        <p class="text-slate-500 dark:text-slate-400">
          {{ errorDescription }}
        </p>
      </div>

      <!-- 错误详情卡片 -->
      <div class="glass-card rounded-xl p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
            错误详情
          </h2>
          <button
            @click="copyError"
            class="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm font-bold"
          >
            <i :class="copied ? 'fas fa-check text-green-500' : 'fas fa-copy'"></i>
            <span>{{ copied ? '已复制' : '复制错误信息' }}</span>
          </button>
        </div>

        <!-- 错误代码 -->
        <div class="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto">
          <pre class="text-sm text-slate-300 font-mono whitespace-pre-wrap break-all"><code>{{ errorDetails }}</code></pre>
        </div>

        <!-- 错误元信息 -->
        <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-slate-500">错误代码：</span>
            <span class="font-bold text-slate-900 dark:text-white">{{ error?.statusCode || 'UNKNOWN' }}</span>
          </div>
          <div>
            <span class="text-slate-500">发生时间：</span>
            <span class="font-bold text-slate-900 dark:text-white">{{ errorTime }}</span>
          </div>
          <div class="col-span-2">
            <span class="text-slate-500">请求路径：</span>
            <span class="font-bold text-slate-900 dark:text-white">{{ errorUrl }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          @click="handleRetry"
          class="flex-1 btn-primary text-white py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest flex items-center justify-center space-x-2"
        >
          <i class="fas fa-redo"></i>
          <span>重试</span>
        </button>
        <NuxtLink
          to="/"
          class="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <i class="fas fa-home"></i>
          <span>返回首页</span>
        </NuxtLink>
      </div>

      <!-- 常见问题提示 -->
      <div class="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
        <div class="flex items-start space-x-3">
          <i class="fas fa-lightbulb text-amber-500 mt-0.5"></i>
          <div class="text-sm text-amber-700 dark:text-amber-400">
            <p class="font-bold mb-2">可能的解决方案：</p>
            <ul class="list-disc list-inside space-y-1">
              <li v-if="error?.statusCode === 404">检查 URL 是否正确</li>
              <li v-else-if="error?.statusCode === 401 || error?.statusCode === 403">尝试重新登录</li>
              <li v-else-if="error?.statusCode === 500">服务器暂时不可用，请稍后再试</li>
              <li v-else>刷新页面或清除浏览器缓存</li>
              <li>检查网络连接是否正常</li>
              <li>如果问题持续，请联系管理员并提供错误代码</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object as () => {
    statusCode?: number
    statusMessage?: string
    message?: string
    stack?: string
    url?: string
    data?: any
  },
})

const copied = ref(false)
const errorTime = new Date().toLocaleString('zh-CN')

// 错误标题
const errorTitle = computed(() => {
  const code = props.error?.statusCode
  if (code === 404) return '页面未找到'
  if (code === 401) return '未授权访问'
  if (code === 403) return '禁止访问'
  if (code === 500) return '服务器错误'
  if (code === 502 || code === 503) return '服务暂时不可用'
  return '发生错误'
})

// 错误描述
const errorDescription = computed(() => {
  const code = props.error?.statusCode
  if (code === 404) return '您访问的页面不存在或已被移除'
  if (code === 401) return '您需要登录才能访问此页面'
  if (code === 403) return '您没有权限访问此页面'
  if (code === 500) return '服务器遇到了一个问题，我们正在修复'
  if (code === 502 || code === 503) return '服务正在维护中，请稍后再试'
  return '抱歉，发生了一个意外错误'
})

// 错误 URL
const errorUrl = computed(() => {
  if (import.meta.client) {
    return props.error?.url || window.location.href
  }
  return props.error?.url || '未知'
})

// 错误详情（用于复制）
const errorDetails = computed(() => {
  const details = {
    statusCode: props.error?.statusCode || 'UNKNOWN',
    statusMessage: props.error?.statusMessage || props.error?.message || '未知错误',
    url: errorUrl.value,
    time: errorTime,
    userAgent: import.meta.client ? navigator.userAgent : 'N/A',
    stack: props.error?.stack || '无堆栈信息',
    data: props.error?.data || null,
  }
  return JSON.stringify(details, null, 2)
})

// 复制错误信息
const copyError = async () => {
  try {
    await navigator.clipboard.writeText(errorDetails.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (e) {
    // 回退方案
    const textarea = document.createElement('textarea')
    textarea.value = errorDetails.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

// 重试
const handleRetry = () => {
  clearError({ redirect: errorUrl.value })
}

// 设置页面标题
useHead({
  title: `${errorTitle.value} | 错误`,
})
</script>

<style>
/* 确保错误页面也有正确的背景 */
.light-bg {
  background-color: #f8fafc;
  background-image: radial-gradient(#e2e8f0 0.5px, transparent 0.5px);
  background-size: 24px 24px;
}

.dark-bg {
  background-color: #0f172a;
  background-image: radial-gradient(#1e293b 0.5px, transparent 0.5px);
  background-size: 24px 24px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.dark .glass-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(51, 65, 85, 0.8);
}

.btn-primary {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.dark .btn-primary {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  color: #0f172a !important;
}
</style>
