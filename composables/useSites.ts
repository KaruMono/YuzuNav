export const useSites = () => {
  const sites = useState<Site[]>('sites.list', () => [])
  const categories = useState<Category[]>('sites.categories', () => [])
  const loading = useState<boolean>('sites.loading', () => false)

  const fetchCategories = async () => {
    try {
      const { data } = await $fetch<{ success: boolean; data: Category[] }>('/api/categories')
      categories.value = data
      return data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      return []
    }
  }

  const fetchSites = async (params?: { categoryId?: number; status?: string; page?: number; limit?: number }) => {
    loading.value = true
    try {
      const query = new URLSearchParams()
      if (params?.categoryId) query.append('categoryId', String(params.categoryId))
      if (params?.status) query.append('status', params.status)
      if (params?.page) query.append('page', String(params.page))
      if (params?.limit) query.append('limit', String(params.limit))

      const { data, pagination } = await $fetch<{ success: boolean; data: Site[]; pagination: Pagination }>(
        `/api/sites?${query.toString()}`
      )
      sites.value = data
      return { data, pagination }
    } catch (error) {
      console.error('Failed to fetch sites:', error)
      return { data: [], pagination: null }
    } finally {
      loading.value = false
    }
  }

  const fetchSite = async (id: string) => {
    try {
      const { data } = await $fetch<{ success: boolean; data: Site }>(`/api/sites/${id}`)
      return data
    } catch (error) {
      console.error('Failed to fetch site:', error)
      return null
    }
  }

  const createSite = async (siteData: CreateSiteInput) => {
    try {
      const { data } = await $fetch<{ success: boolean; data: Site; message?: string }>('/api/sites', {
        method: 'POST',
        body: siteData,
      })
      return { success: true, data, message: data.message }
    } catch (error: any) {
      return { success: false, error: error.data?.message || '创建失败' }
    }
  }

  const updateSite = async (id: string, siteData: Partial<CreateSiteInput>) => {
    try {
      const { data } = await $fetch<{ success: boolean; data: Site }>(`/api/sites/${id}`, {
        method: 'PUT',
        body: siteData,
      })
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.data?.message || '更新失败' }
    }
  }

  const deleteSite = async (id: string) => {
    try {
      await $fetch(`/api/sites/${id}`, { method: 'DELETE' })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.data?.message || '删除失败' }
    }
  }

  const toggleFavorite = async (siteId: string) => {
    try {
      const { favorited } = await $fetch<{ success: boolean; favorited: boolean }>(`/api/sites/${siteId}/favorite`, {
        method: 'POST',
      })
      return { success: true, favorited }
    } catch (error: any) {
      return { success: false, error: error.data?.message || '操作失败' }
    }
  }

  return {
    sites: readonly(sites),
    categories: readonly(categories),
    loading: readonly(loading),
    fetchCategories,
    fetchSites,
    fetchSite,
    createSite,
    updateSite,
    deleteSite,
    toggleFavorite,
  }
}

interface Site {
  id: string
  title: string
  description: string | null
  url: string
  logoUrl: string | null
  categoryId: number
  userId: string
  status: string
  viewCount: number
  createdAt: string
  category?: Category
  user?: {
    id: string
    username: string | null
    avatarUrl: string | null
  }
  _count?: {
    comments: number
    favorites: number
  }
}

interface Category {
  id: number
  name: string
  slug: string
  icon: string | null
  sortOrder: number
}

interface CreateSiteInput {
  title: string
  description?: string
  url: string
  logoUrl?: string
  categoryId: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}
