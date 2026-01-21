// 全局 Toast 通知组合式函数
interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastItem extends ToastOptions {
  id: number
  visible: boolean
}

// 全局状态
const toasts = ref<ToastItem[]>([])
let toastId = 0

export function useToast() {
  const show = (options: ToastOptions) => {
    const id = ++toastId
    const toast: ToastItem = {
      id,
      message: options.message,
      type: options.type || 'success',
      duration: options.duration || 3000,
      visible: false,
    }
    
    toasts.value.push(toast)
    
    // 延迟显示以触发动画
    setTimeout(() => {
      const index = toasts.value.findIndex(t => t.id === id)
      if (index !== -1) {
        toasts.value[index].visible = true
      }
    }, 10)
    
    // 自动消失
    setTimeout(() => {
      hide(id)
    }, toast.duration)
    
    return id
  }
  
  const hide = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value[index].visible = false
      // 等待动画结束后移除
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id)
      }, 300)
    }
  }
  
  const success = (message: string, duration?: number) => {
    return show({ message, type: 'success', duration })
  }
  
  const error = (message: string, duration?: number) => {
    return show({ message, type: 'error', duration })
  }
  
  const warning = (message: string, duration?: number) => {
    return show({ message, type: 'warning', duration })
  }
  
  const info = (message: string, duration?: number) => {
    return show({ message, type: 'info', duration })
  }
  
  return {
    toasts,
    show,
    hide,
    success,
    error,
    warning,
    info,
  }
}
