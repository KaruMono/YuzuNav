<template>
  <div class="min-h-screen text-slate-800 dark:text-slate-200 antialiased">
    <LayoutHeader />
    <slot />
    <LayoutFooter />
    <Toast />
    <!-- 自定义底部代码 -->
    <div v-if="customBodyCode" v-html="customBodyCode"></div>
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

// 从环境变量获取初始值（SSR 时直接使用，无需等待 API）
const getInitialSettings = () => ({
  title: config.public.seoTitle || config.public.siteName || '网站导航',
  siteName: config.public.siteName || '网站导航',
  description: config.public.seoDescription || '',
  keywords: config.public.seoKeywords || '',
  faviconUrl: config.public.faviconUrl || '',
  appleTouchIconUrl: config.public.appleTouchIconUrl || '',
  cdnProvider: config.public.cdnProvider || 'local',
  customCdnUrl: config.public.customCdnUrl || '',
  customHeadCode: '',
  customBodyCode: '',
})

// SEO 和图标设置（使用环境变量作为初始值）
const seoSettings = ref(getInitialSettings())

// 自定义代码
const customHeadCode = ref('')
const customBodyCode = ref('')

// SSR 数据预取 - 在服务端获取数据库配置覆盖环境变量
const { data: siteSettingsData } = await useAsyncData('siteSettings', () => 
  $fetch<{ success: boolean; data: any }>('/api/settings/site').then(res => res.data),
  { 
    default: () => null,
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
  }
)

// 监听数据变化，更新设置
watch(siteSettingsData, (data) => {
  if (data) {
    const siteName = data.siteName || seoSettings.value.siteName
    seoSettings.value = {
      title: data.seo_title || siteName,
      siteName,
      description: data.seo_description || seoSettings.value.description,
      keywords: data.seo_keywords || seoSettings.value.keywords,
      faviconUrl: data.favicon_url || seoSettings.value.faviconUrl,
      appleTouchIconUrl: data.apple_touch_icon_url || seoSettings.value.appleTouchIconUrl,
      cdnProvider: data.cdn_provider || seoSettings.value.cdnProvider,
      customCdnUrl: data.custom_cdn_url || seoSettings.value.customCdnUrl,
      customHeadCode: data.custom_head_code || '',
      customBodyCode: data.custom_body_code || '',
    }
    customHeadCode.value = data.custom_head_code || ''
    customBodyCode.value = data.custom_body_code || ''
  }
}, { immediate: true })

// 获取 Font Awesome CDN URL
const getFontAwesomeUrl = computed(() => {
  const provider = seoSettings.value.cdnProvider
  if (provider === 'custom' && seoSettings.value.customCdnUrl) {
    return `${seoSettings.value.customCdnUrl}/font-awesome/6.0.0/css/all.min.css`
  }
  return CDN_PROVIDERS[provider]?.fontAwesome || CDN_PROVIDERS.local.fontAwesome
})

// 动态设置 head
useHead(() => {
  const headItems: any = {
    title: seoSettings.value.title,
    meta: [
      { name: 'description', content: seoSettings.value.description },
      { name: 'keywords', content: seoSettings.value.keywords },
    ].filter(m => m.content),
    link: [
      { rel: 'stylesheet', href: getFontAwesomeUrl.value },
      seoSettings.value.faviconUrl ? { rel: 'icon', type: 'image/x-icon', href: seoSettings.value.faviconUrl } : null,
      seoSettings.value.appleTouchIconUrl ? { rel: 'apple-touch-icon', href: seoSettings.value.appleTouchIconUrl } : null,
    ].filter(Boolean) as any[],
  }
  
  if (customHeadCode.value) {
    headItems.script = headItems.script || []
    headItems.__dangerouslyDisableSanitizers = ['script']
    headItems.script.push({
      innerHTML: customHeadCode.value,
      type: 'text/javascript',
      tagPosition: 'head',
    })
  }
  
  return headItems
})
</script>
