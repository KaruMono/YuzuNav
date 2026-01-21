<template>
  <main class="max-w-md mx-auto px-4 py-12">
    <!-- 注册已关闭提示 -->
    <div v-if="!enableRegistration" class="glass-card rounded-md p-8 text-center">
      <i class="fas fa-user-slash text-6xl text-slate-300 dark:text-slate-600 mb-6"></i>
      <h1 class="text-2xl font-black text-slate-900 dark:text-white mb-4">
        暂停注册
      </h1>
      <p class="text-slate-500 dark:text-slate-400 mb-6">
        当前不允许新用户注册，如有需要请联系管理员。
      </p>
      <NuxtLink
        to="/login"
        class="btn-primary text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider inline-block"
      >
        返回登录
      </NuxtLink>
    </div>

    <div v-else class="glass-card rounded-md p-8">
      <h1 class="text-2xl font-black text-slate-900 dark:text-white mb-6 text-center">
        注册
      </h1>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
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
            用户名（可选）
          </label>
          <input
            v-model="form.username"
            type="text"
            class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-md py-2 px-4 text-sm focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 transition-all outline-none"
            placeholder="username"
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
            minlength="6"
            class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-md py-2 px-4 text-sm focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 transition-all outline-none"
            placeholder="至少6个字符"
          />
        </div>
        
        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            确认密码
          </label>
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            class="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-md py-2 px-4 text-sm focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 transition-all outline-none"
            placeholder="再次输入密码"
          />
        </div>
        
        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>
        
        <div v-if="success" class="text-green-500 text-sm text-center">
          {{ success }}
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full btn-primary text-white py-3 rounded-md font-bold text-sm uppercase tracking-wider disabled:opacity-50"
        >
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>
      
      <div class="mt-6 text-center text-sm text-slate-500">
        已有账户？
        <NuxtLink to="/login" class="text-slate-900 dark:text-white font-bold hover:underline">
          立即登录
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { register } = useAuth()
const { getSiteName, loadSettings: loadSiteSettings } = useSiteSettings()

// 加载网站设置
loadSiteSettings()

// SEO
useHead(() => ({
  title: `注册 - ${getSiteName.value}`,
  meta: [
    { name: 'description', content: `注册 ${getSiteName.value} 账号，开始收藏和投稿网站` },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
}))
const config = useRuntimeConfig()
const form = ref({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
})
const loading = ref(false)
const error = ref('')
const success = ref('')
const enableRegistration = ref(true)

// 加载设置
const loadSettings = async () => {
  try {
    const response = await $fetch<{ success: boolean; data: any }>('/api/settings/site')
    if (response.data) {
      enableRegistration.value = response.data.enableRegistration !== false
    }
  } catch (e) {
    console.error('Failed to load settings:', e)
  }
}

onMounted(async () => {
  await loadSettings()
})

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  if (form.value.password !== form.value.confirmPassword) {
    error.value = '两次输入的密码不一致'
    loading.value = false
    return
  }
  
  const result = await register(
    form.value.email,
    form.value.password,
    form.value.username || undefined
  )
  
  if (result.success) {
    success.value = result.message || '注册成功！'
    if (config.public.enableEmailVerification) {
      success.value += ' 请检查您的邮箱以验证账户。'
    }
    setTimeout(() => {
      navigateTo('/')
    }, 2000)
  } else {
    error.value = result.error || '注册失败'
  }
  
  loading.value = false
}
</script>
