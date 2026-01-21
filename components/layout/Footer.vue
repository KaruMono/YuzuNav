<template>
  <footer class="max-w-[1600px] mx-auto px-4 py-12 sm:py-16 text-center">
    <div class="w-8 h-px bg-slate-200 dark:bg-slate-800 mx-auto mb-8"></div>
    <!-- 自定义页脚内容 -->
    <div
      v-if="footerHtml"
      class="text-slate-400 text-xs sm:text-sm footer-content"
      v-html="footerHtml"
    ></div>
    <!-- 默认页脚 -->
    <div v-else class="text-slate-400 text-[10px] sm:text-xs">
      <p class="font-bold mb-2">© {{ currentYear }} {{ siteName }}</p>
      <p class="text-slate-300 dark:text-slate-600">
        由 <a href="https://github.com/YuzuACG/YuzuNav" target="_blank" class="hover:text-slate-500 dark:hover:text-slate-400 transition-colors">YuzuNav</a> 强力驱动
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const footerHtml = ref('')
const siteName = ref('YuzuACG')
const currentYear = new Date().getFullYear()

const loadSiteSettings = async () => {
  try {
    const response = await $fetch<{ success: boolean; data: any }>('/api/settings/site')
    if (response.data) {
      footerHtml.value = response.data.footerHtml || ''
      siteName.value = response.data.siteName || 'YuzuACG'
    }
  } catch (error) {
    console.error('Failed to load site settings:', error)
  }
}

onMounted(() => {
  loadSiteSettings()
})
</script>

<style scoped>
.footer-content :deep(a) {
  color: #64748b;
  text-decoration: underline;
}
.footer-content :deep(a:hover) {
  color: #475569;
}
.footer-content :deep(p) {
  margin-bottom: 0.5rem;
}
.footer-content :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
