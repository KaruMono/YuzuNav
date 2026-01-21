<template>
  <div v-if="hasError" class="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
    <div class="flex items-start space-x-4">
      <div class="flex-shrink-0">
        <i class="fas fa-exclamation-circle text-2xl text-red-500"></i>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-bold text-red-800 dark:text-red-300 mb-2">
          组件加载失败
        </h3>
        <p class="text-sm text-red-600 dark:text-red-400 mb-4">
          {{ errorMessage }}
        </p>
        
        <!-- 错误详情（可展开） -->
        <details v-if="errorStack" class="mb-4">
          <summary class="text-sm font-medium text-red-700 dark:text-red-300 cursor-pointer hover:underline">
            查看错误详情
          </summary>
          <div class="mt-2 p-3 bg-red-100 dark:bg-red-900/40 rounded-lg overflow-x-auto">
            <pre class="text-xs text-red-800 dark:text-red-200 font-mono whitespace-pre-wrap">{{ errorStack }}</pre>
          </div>
        </details>

        <div class="flex items-center space-x-3">
          <button
            @click="retry"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors"
          >
            <i class="fas fa-redo mr-2"></i>重试
          </button>
          <button
            @click="copyError"
            class="px-4 py-2 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-700 dark:text-red-200 rounded-lg font-bold text-sm transition-colors"
          >
            <i :class="copied ? 'fas fa-check' : 'fas fa-copy'" class="mr-2"></i>
            {{ copied ? '已复制' : '复制错误' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
const props = defineProps<{
  fallback?: string
}>()

const hasError = ref(false)
const errorMessage = ref('')
const errorStack = ref('')
const copied = ref(false)

// 捕获子组件错误
onErrorCaptured((err, instance, info) => {
  hasError.value = true
  errorMessage.value = err instanceof Error ? err.message : String(err)
  errorStack.value = err instanceof Error ? err.stack || '' : ''
  
  console.error('ErrorBoundary caught:', err)
  console.error('Component:', instance)
  console.error('Info:', info)
  
  // 返回 false 阻止错误继续传播
  return false
})

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
}

const copyError = async () => {
  const errorInfo = JSON.stringify({
    message: errorMessage.value,
    stack: errorStack.value,
    time: new Date().toISOString(),
    url: window.location.href,
  }, null, 2)

  try {
    await navigator.clipboard.writeText(errorInfo)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (e) {
    console.error('Failed to copy:', e)
  }
}
</script>
