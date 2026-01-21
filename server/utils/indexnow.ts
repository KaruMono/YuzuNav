import prisma from './db'

// IndexNow 支持的搜索引擎端点
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
]

interface IndexNowConfig {
  enabled: boolean
  apiKey: string
  host: string
}

/**
 * 获取 IndexNow 配置
 */
export async function getIndexNowConfig(): Promise<IndexNowConfig> {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: ['indexnow_enabled', 'indexnow_api_key', 'site_url'],
      },
    },
  })

  const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]))

  return {
    enabled: settingsMap.indexnow_enabled === 'true',
    apiKey: settingsMap.indexnow_api_key || '',
    host: settingsMap.site_url || '',
  }
}

/**
 * 提交 URL 到 IndexNow
 */
export async function submitToIndexNow(urls: string | string[]): Promise<{
  success: boolean
  message: string
  results?: Array<{ endpoint: string; success: boolean; status?: number; error?: string }>
}> {
  const config = await getIndexNowConfig()

  if (!config.enabled) {
    return { success: false, message: 'IndexNow 未启用' }
  }

  if (!config.apiKey) {
    return { success: false, message: 'IndexNow API Key 未配置' }
  }

  if (!config.host) {
    return { success: false, message: '网站 URL 未配置' }
  }

  const urlList = Array.isArray(urls) ? urls : [urls]
  const host = new URL(config.host).host

  const results: Array<{ endpoint: string; success: boolean; status?: number; error?: string }> = []

  // 向多个搜索引擎提交
  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host,
          key: config.apiKey,
          keyLocation: `${config.host}/api/indexnow/${config.apiKey}.txt`,
          urlList,
        }),
      })

      results.push({
        endpoint,
        success: response.ok || response.status === 202,
        status: response.status,
      })

      // 只需要成功提交到一个端点即可
      if (response.ok || response.status === 202) {
        console.log(`[IndexNow] 成功提交到 ${endpoint}:`, urlList)
        break
      }
    } catch (error: any) {
      results.push({
        endpoint,
        success: false,
        error: error.message,
      })
      console.error(`[IndexNow] 提交到 ${endpoint} 失败:`, error.message)
    }
  }

  const anySuccess = results.some(r => r.success)
  
  return {
    success: anySuccess,
    message: anySuccess ? '已提交到 IndexNow' : '提交失败',
    results,
  }
}

/**
 * 提交网站详情页到 IndexNow
 * 注意：NSFW 网站不会被提交到 IndexNow
 */
export async function submitSiteToIndexNow(siteId: string): Promise<{
  success: boolean
  message: string
}> {
  // 检查网站是否为 NSFW
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: { isNsfw: true },
  })
  
  if (site?.isNsfw) {
    console.log(`[IndexNow] 跳过 NSFW 网站: ${siteId}`)
    return { success: false, message: 'NSFW 网站不提交到 IndexNow' }
  }

  const config = await getIndexNowConfig()
  
  if (!config.enabled || !config.apiKey || !config.host) {
    return { success: false, message: 'IndexNow 未正确配置' }
  }

  const siteUrl = `${config.host}/site/${siteId}`
  return submitToIndexNow(siteUrl)
}
