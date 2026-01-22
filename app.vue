<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { initAuth } = useAuth()
const { initTheme } = useTheme()

onMounted(async () => {
  // 初始化主题（必须最先执行）
  initTheme()
  
  // 初始化认证
  await initAuth()
})
</script>
