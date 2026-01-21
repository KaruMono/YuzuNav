import prisma from '~/server/utils/db'

// 公共 API - 获取网站基本设置（不需要登录）
// 优先级说明：
// - 大部分设置：数据库 > 环境变量 > 代码默认值
// - CDN/存储设置：仅从环境变量读取（提升性能）
export default defineEventHandler(async (event) => {
  // 设置缓存头 - 缓存 5 分钟
  setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=300')
  
  // 获取环境变量配置
  const config = useRuntimeConfig()
  
  // 从数据库获取可配置的设置
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: [
          'siteName',
          'siteSubtitle',
          'siteIcon',
          'siteIconType',
          'siteIconColor',
          'siteLogoUrl',
          'footerHtml',
          'enableRefParam',
          'refParamFormat',
          'enableComments',
          'enableFavorites',
          'enableRegistration',
          'allowGuestSubmit',
          // SEO 设置
          'seo_title',
          'seo_description',
          'seo_keywords',
          // 图标设置
          'favicon_url',
          'apple_touch_icon_url',
          // 自定义代码
          'custom_head_code',
          'custom_body_code',
        ],
      },
    },
  })

  // 默认值（优先级最低）
  const defaults: Record<string, any> = {
    siteName: 'YuzuACG',
    siteSubtitle: '',
    siteIcon: '',
    siteIconType: 'text',
    siteIconColor: '#1e293b',
    siteLogoUrl: '',
    footerHtml: '',
    enableRefParam: false,
    refParamFormat: '?ref={site}',
    enableComments: true,
    enableFavorites: true,
    enableRegistration: true,
    allowGuestSubmit: false,
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    favicon_url: '',
    apple_touch_icon_url: '',
    custom_head_code: '',
    custom_body_code: '',
  }

  // 环境变量配置（用于网站基本信息，优先级中）
  const envConfig: Record<string, any> = {
    siteName: config.public.siteName,
    siteSubtitle: config.public.siteSubtitle,
    siteIcon: config.public.siteIcon,
    siteIconType: config.public.siteIconType,
    siteIconColor: config.public.siteIconColor,
    siteLogoUrl: config.public.siteLogoUrl,
    seo_title: config.public.seoTitle,
    seo_description: config.public.seoDescription,
    seo_keywords: config.public.seoKeywords,
    favicon_url: config.public.faviconUrl,
    apple_touch_icon_url: config.public.appleTouchIconUrl,
  }

  // 构建结果：默认值 -> 环境变量覆盖 -> 数据库覆盖
  const result: Record<string, any> = { ...defaults }

  // 应用环境变量（仅当有值时覆盖）
  for (const [key, value] of Object.entries(envConfig)) {
    if (value) {
      result[key] = value
    }
  }

  // 应用数据库配置（优先级最高）
  settings.forEach(setting => {
    if (setting.value) {
      // 处理布尔值
      if (['enableRefParam', 'enableComments', 'enableFavorites', 'enableRegistration', 'allowGuestSubmit'].includes(setting.key)) {
        result[setting.key] = setting.value === 'true'
      } else {
        result[setting.key] = setting.value
      }
    }
  })

  // CDN 和存储配置 - 仅从环境变量读取（不存数据库，提升性能）
  result.cdn_provider = config.public.cdnProvider || 'local'
  result.custom_cdn_url = config.public.customCdnUrl || ''
  result.storage_type = config.storageType || 'local'
  result.s3_bucket = config.s3Bucket || ''
  result.s3_region = config.s3Region || ''
  result.s3_endpoint = config.s3Endpoint || ''
  result.s3_cdn_url = config.s3CdnUrl || ''

  return {
    success: true,
    data: result,
  }
})
