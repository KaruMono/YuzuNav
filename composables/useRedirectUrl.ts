export const useRedirectUrl = () => {
  const siteSettings = useState<{
    enableRefParam: boolean
    refParamFormat: string
  }>('redirect-settings', () => ({
    enableRefParam: false,
    refParamFormat: '?ref={site}',
  }))

  const isLoaded = ref(false)

  const loadSettings = async () => {
    if (isLoaded.value) return
    
    try {
      const response = await $fetch<{ success: boolean; data: any }>('/api/settings/site')
      if (response.data) {
        siteSettings.value = {
          enableRefParam: response.data.enableRefParam || false,
          refParamFormat: response.data.refParamFormat || '?ref={site}',
        }
      }
      isLoaded.value = true
    } catch (error) {
      console.error('Failed to load redirect settings:', error)
    }
  }

  // 生成带参数的跳转链接
  const getRedirectUrl = (originalUrl: string): string => {
    if (!siteSettings.value.enableRefParam || !originalUrl) {
      return originalUrl
    }

    try {
      const url = new URL(originalUrl)
      const format = siteSettings.value.refParamFormat || '?ref={site}'
      
      // 获取本站域名
      const siteHost = import.meta.client ? window.location.host : 'localhost'
      
      // 替换变量
      const paramString = format.replace('{site}', siteHost)
      
      // 解析参数格式
      // 支持格式: ?ref=xxx 或 &ref=xxx 或 #ref=xxx
      if (paramString.startsWith('?')) {
        // 如果原URL已有参数，用&连接
        const params = paramString.substring(1)
        if (url.search) {
          url.search += '&' + params
        } else {
          url.search = '?' + params
        }
      } else if (paramString.startsWith('&')) {
        const params = paramString.substring(1)
        if (url.search) {
          url.search += '&' + params
        } else {
          url.search = '?' + params
        }
      } else if (paramString.startsWith('#')) {
        url.hash = paramString
      } else {
        // 默认作为查询参数处理
        if (url.search) {
          url.search += '&' + paramString
        } else {
          url.search = '?' + paramString
        }
      }

      return url.toString()
    } catch (error) {
      // 如果URL解析失败，直接拼接
      const siteHost = import.meta.client ? window.location.host : 'localhost'
      const paramString = (siteSettings.value.refParamFormat || '?ref={site}').replace('{site}', siteHost)
      
      if (originalUrl.includes('?')) {
        return originalUrl + paramString.replace('?', '&')
      }
      return originalUrl + paramString
    }
  }

  return {
    siteSettings: readonly(siteSettings),
    loadSettings,
    getRedirectUrl,
  }
}
