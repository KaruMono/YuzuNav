<template>
  <main class="max-w-md mx-auto px-4 py-12">
    <div class="glass-card rounded-md p-8 text-center">
      <div v-if="loading" class="py-8">
        <i class="fas fa-spinner fa-spin text-4xl text-slate-400 mb-4"></i>
        <p class="text-slate-500">验证中...</p>
      </div>
      <div v-else-if="success" class="py-8">
        <i class="fas fa-check-circle text-4xl text-green-500 mb-4"></i>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white mb-4">
          邮箱验证成功！
        </h1>
        <p class="text-slate-500 mb-6">
          您的邮箱已验证，现在可以正常使用所有功能了。
        </p>
        <NuxtLink
          to="/"
          class="btn-primary text-white px-6 py-3 rounded-md font-bold text-sm uppercase inline-block"
        >
          返回首页
        </NuxtLink>
      </div>
      <div v-else class="py-8">
        <i class="fas fa-times-circle text-4xl text-red-500 mb-4"></i>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white mb-4">
          验证失败
        </h1>
        <p class="text-slate-500 mb-6">
          {{ error || '验证链接无效或已过期' }}
        </p>
        <NuxtLink
          to="/"
          class="btn-primary text-white px-6 py-3 rounded-md font-bold text-sm uppercase inline-block"
        >
          返回首页
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()
const loading = ref(true)
const success = ref(false)
const error = ref('')

onMounted(async () => {
  const token = route.query.token as string
  
  if (!token) {
    error.value = '缺少验证令牌'
    loading.value = false
    return
  }

  try {
    const result = await $fetch<{ success: boolean; message?: string }>(`/api/auth/verify-email?token=${token}`)
    if (result.success) {
      success.value = true
      // 更新用户状态
      const { fetchUser } = useAuth()
      await fetchUser()
    } else {
      error.value = result.message || '验证失败'
    }
  } catch (err: any) {
    error.value = err.data?.message || '验证失败'
  } finally {
    loading.value = false
  }
})
</script>
