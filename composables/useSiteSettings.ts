export const useSiteSettings = () => {
  const siteSettings = useState<{
    siteName: string
    siteSubtitle: string
    siteIcon: string
    siteIconType: string
    siteIconColor: string
    siteLogoUrl: string
    enableFavorites: boolean
    enableComments: boolean
    enableRegistration: boolean
    allowGuestSubmit: boolean
  }>('siteSettings', () => ({
    siteName: '',
    siteSubtitle: '',
    siteIcon: '',
    siteIconType: 'text',
    siteIconColor: '#1e293b',
    siteLogoUrl: '',
    enableFavorites: true,
    enableComments: true,
    enableRegistration: true,
    allowGuestSubmit: false,
  }))

  const isLoaded = useState<boolean>('siteSettings.loaded', () => false)

  const loadSettings = async () => {
    if (isLoaded.value) return siteSettings.value
    
    try {
      const response = await $fetch<{ success: boolean; data: any }>('/api/settings/site')
      if (response.data) {
        siteSettings.value = {
          siteName: response.data.siteName || '',
          siteSubtitle: response.data.siteSubtitle || '',
          siteIcon: response.data.siteIcon || '',
          siteIconType: response.data.siteIconType || 'text',
          siteIconColor: response.data.siteIconColor || '#1e293b',
          siteLogoUrl: response.data.siteLogoUrl || '',
          enableFavorites: response.data.enableFavorites !== false,
          enableComments: response.data.enableComments !== false,
          enableRegistration: response.data.enableRegistration !== false,
          allowGuestSubmit: response.data.allowGuestSubmit || false,
        }
        isLoaded.value = true
      }
    } catch (error) {
      console.error('Failed to load site settings:', error)
    }
    
    return siteSettings.value
  }

  // 获取网站名称，带默认值
  const getSiteName = computed(() => siteSettings.value.siteName || '网站导航')

  return {
    siteSettings: readonly(siteSettings),
    isLoaded: readonly(isLoaded),
    loadSettings,
    getSiteName,
  }
}
