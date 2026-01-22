export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)
  const token = useState<string | null>('auth.token', () => null)
  const initialized = useState<boolean>('auth.initialized', () => false)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch<{ success: boolean; user: User; token: string }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      user.value = response.user
      token.value = response.token
      
      // 保存 token 到 localStorage（作为备份）
      if (process.client) {
        localStorage.setItem('auth-token', response.token)
      }

      return { success: true, user: response.user }
    } catch (error: any) {
      return { success: false, error: error.data?.message || '登录失败' }
    }
  }

  const register = async (email: string, password: string, username?: string) => {
    try {
      const response = await $fetch<{ success: boolean; user: User; token: string; message?: string }>('/api/auth/register', {
        method: 'POST',
        body: { email, password, username },
      })

      user.value = response.user
      token.value = response.token
      
      if (process.client) {
        localStorage.setItem('auth-token', response.token)
      }

      return { success: true, user: response.user, message: response.message }
    } catch (error: any) {
      return { success: false, error: error.data?.message || '注册失败' }
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      token.value = null
      if (process.client) {
        localStorage.removeItem('auth-token')
      }
    }
  }

  const fetchUser = async () => {
    try {
      const response = await $fetch<{ success: boolean; user: User }>('/api/auth/me', {
        // 确保发送 credentials（cookie）
        credentials: 'include',
      })
      user.value = response.user
      return response.user
    } catch (error) {
      user.value = null
      token.value = null
      if (process.client) {
        localStorage.removeItem('auth-token')
      }
      return null
    }
  }

  const initAuth = async () => {
    // 避免重复初始化
    if (initialized.value) return
    
    // 尝试从 cookie 获取用户信息（httpOnly cookie 会自动发送）
    await fetchUser()
    initialized.value = true
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchUser,
    initAuth,
  }
}

interface User {
  id: string
  email: string
  username: string | null
  avatarUrl: string | null
  emailVerified: boolean
  role: string
}
