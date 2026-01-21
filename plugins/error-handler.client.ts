export default defineNuxtPlugin((nuxtApp) => {
  // 捕获 Vue 组件错误
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Vue Error:', error)
    console.error('Component:', instance)
    console.error('Error Info:', info)

    // 构建错误信息
    const errorData = {
      statusCode: 500,
      statusMessage: 'Vue 运行时错误',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      url: window.location.href,
      data: {
        type: 'vue_error',
        info,
        componentName: instance?.$options?.name || instance?.$options?.__name || 'Unknown',
      },
    }

    // 显示错误页面
    showError(errorData)
  }

  // 捕获未处理的 Promise 错误
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason)

    const error = event.reason
    const errorData = {
      statusCode: 500,
      statusMessage: '未处理的异步错误',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      url: window.location.href,
      data: {
        type: 'unhandled_rejection',
      },
    }

    // 阻止默认行为
    event.preventDefault()

    // 显示错误页面
    showError(errorData)
  })

  // 捕获全局 JavaScript 错误
  window.addEventListener('error', (event) => {
    // 忽略资源加载错误（如图片、脚本加载失败）
    if (event.target && (event.target as HTMLElement).tagName) {
      return
    }

    console.error('Global Error:', event.error)

    const errorData = {
      statusCode: 500,
      statusMessage: 'JavaScript 运行时错误',
      message: event.message || '未知错误',
      stack: event.error?.stack,
      url: window.location.href,
      data: {
        type: 'js_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    }

    // 阻止默认行为
    event.preventDefault()

    // 显示错误页面
    showError(errorData)
  })
})
