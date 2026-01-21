<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-3 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm min-w-[280px] max-w-[400px]',
            'transform transition-all duration-300 ease-out',
            toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
            getToastClasses(toast.type)
          ]"
        >
          <div class="flex-shrink-0">
            <i :class="getIconClass(toast.type)" class="text-lg"></i>
          </div>
          <div class="flex-1 text-sm font-medium">{{ toast.message }}</div>
          <button
            @click="hide(toast.id)"
            class="flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <i class="fas fa-times text-xs opacity-60"></i>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, hide } = useToast()

const getToastClasses = (type?: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-500/95 text-white'
    case 'error':
      return 'bg-red-500/95 text-white'
    case 'warning':
      return 'bg-amber-500/95 text-white'
    case 'info':
      return 'bg-blue-500/95 text-white'
    default:
      return 'bg-slate-800/95 text-white'
  }
}

const getIconClass = (type?: string) => {
  switch (type) {
    case 'success':
      return 'fas fa-check-circle'
    case 'error':
      return 'fas fa-times-circle'
    case 'warning':
      return 'fas fa-exclamation-triangle'
    case 'info':
      return 'fas fa-info-circle'
    default:
      return 'fas fa-bell'
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
