<template>
  <main class="max-w-md mx-auto px-4 py-12">
    <div class="glass-card rounded-md p-8">
      <h1 class="text-2xl font-black text-slate-900 dark:text-white mb-6 text-center">
        登录
      </h1>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            邮箱
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-md py-2 px-4 text-sm focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 transition-all outline-none"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            密码
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-md py-2 px-4 text-sm focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 transition-all outline-none"
            placeholder="••••••••"
          />
        </div>
        
        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full btn-primary text-white py-3 rounded-md font-bold text-sm uppercase tracking-wider disabled:opacity-50"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <div class="mt-6 text-center text-sm text-slate-500">
        还没有账户？
        <NuxtLink to="/register" class="text-slate-900 dark:text-white font-bold hover:underline">
          立即注册
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { login } = useAuth()
const { getSiteName, loadSettings } = useSiteSettings()

// 加载网站设置
loadSettings()

// SEO
useHead(() => ({
  title: `登录 - ${getSiteName.value}`,
  meta: [
    { name: 'description', content: `登录您的 ${getSiteName.value} 账号` },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
}))
const form = ref({
  email: '',
  password: '',
})
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  const result = await login(form.value.email, form.value.password)
  
  if (result.success) {
    navigateTo('/')
  } else {
    error.value = result.error || '登录失败'
  }
  
  loading.value = false
}
</script>
