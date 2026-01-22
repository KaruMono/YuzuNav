<template>
  <div class="min-h-screen text-slate-800 dark:text-slate-200 antialiased">
    <slot />
    <Toast />
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

// CDN 提供商配置
const CDN_PROVIDERS: Record<string, { fontAwesome: string }> = {
  local: { fontAwesome: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css' },
  jsdelivr: { fontAwesome: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.0.0/css/all.min.css' },
  unpkg: { fontAwesome: 'https://unpkg.com/@fortawesome/fontawesome-free@6.0.0/css/all.min.css' },
  cdnjs: { fontAwesome: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css' },
  bootcdn: { fontAwesome: 'https://cdn.bootcdn.net/ajax/libs/font-awesome/6.0.0/css/all.min.css' },
  staticfile: { fontAwesome: 'https://cdn.staticfile.org/font-awesome/6.0.0/css/all.min.css' },
}

const cdnProvider = config.public.cdnProvider || 'local'

const getFontAwesomeUrl = computed(() => {
  if (cdnProvider === 'custom' && config.public.customCdnUrl) {
    return `${config.public.customCdnUrl}/font-awesome/6.0.0/css/all.min.css`
  }
  return CDN_PROVIDERS[cdnProvider]?.fontAwesome || CDN_PROVIDERS.local.fontAwesome
})

useHead({
  link: [
    { rel: 'stylesheet', href: getFontAwesomeUrl.value },
  ],
})
</script>
