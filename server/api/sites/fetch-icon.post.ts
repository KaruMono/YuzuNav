import { getCurrentUser } from '~/server/utils/jwt'
import { uploadImage } from '~/server/utils/image'

export default defineEventHandler(async (event) => {
  const user = getCurrentUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: '需要登录',
    })
  }

  const body = await readBody(event)
  const { url, siteId } = body

  if (!url) {
    throw createError({
      statusCode: 400,
      message: '请提供网站 URL',
    })
  }

  try {
    // 解析域名
    const parsedUrl = new URL(url)
    const domain = parsedUrl.origin

    // 尝试多种方式获取图标
    const iconUrls = [
      `${domain}/favicon.ico`,
      `${domain}/favicon.png`,
      `${domain}/apple-touch-icon.png`,
      `${domain}/apple-touch-icon-precomposed.png`,
    ]

    // 首先尝试从 HTML 中解析图标链接
    try {
      const htmlResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        signal: AbortSignal.timeout(10000),
      })

      if (htmlResponse.ok) {
        const html = await htmlResponse.text()
        
        // 解析 link 标签中的图标
        const iconPatterns = [
          /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i,
          /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i,
          /<link[^>]*rel=["']apple-touch-icon(?:-precomposed)?["'][^>]*href=["']([^"']+)["']/i,
          /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']apple-touch-icon(?:-precomposed)?["']/i,
        ]

        for (const pattern of iconPatterns) {
          const match = html.match(pattern)
          if (match && match[1]) {
            let iconUrl = match[1]
            // 处理相对路径
            if (iconUrl.startsWith('//')) {
              iconUrl = `${parsedUrl.protocol}${iconUrl}`
            } else if (iconUrl.startsWith('/')) {
              iconUrl = `${domain}${iconUrl}`
            } else if (!iconUrl.startsWith('http')) {
              iconUrl = `${domain}/${iconUrl}`
            }
            // 添加到列表前面（优先级更高）
            iconUrls.unshift(iconUrl)
          }
        }
      }
    } catch (e) {
      // 忽略 HTML 解析错误，继续尝试默认路径
      console.log('Failed to parse HTML for icons:', e)
    }

    // 尝试下载图标
    let iconBuffer: Buffer | null = null
    let contentType = 'image/png'
    let successUrl = ''

    for (const iconUrl of iconUrls) {
      try {
        const response = await fetch(iconUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          signal: AbortSignal.timeout(5000),
        })

        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer()
          iconBuffer = Buffer.from(arrayBuffer)
          contentType = response.headers.get('content-type') || 'image/png'
          successUrl = iconUrl
          
          // 检查是否是有效的图片（至少 100 字节）
          if (iconBuffer.length > 100) {
            break
          }
          iconBuffer = null
        }
      } catch (e) {
        // 继续尝试下一个 URL
        continue
      }
    }

    if (!iconBuffer) {
      throw createError({
        statusCode: 404,
        message: '无法获取网站图标，请手动上传或输入图标 URL',
      })
    }

    // 生成文件名
    const ext = contentType.includes('ico') ? 'ico' : 
                contentType.includes('png') ? 'png' : 
                contentType.includes('gif') ? 'gif' : 
                contentType.includes('svg') ? 'svg' : 'png'
    const filename = `favicon-${parsedUrl.hostname.replace(/\./g, '-')}.${ext}`

    // 上传图片（自动转换 PNG 为 WebP，并记录到数据库）
    const result = await uploadImage({
      file: iconBuffer,
      filename,
      contentType,
      usageType: 'site_logo',
      usageId: siteId,
      userId: user.id,
    })

    return {
      success: true,
      url: result.url,
      originalUrl: successUrl,
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: '获取图标失败：' + error.message,
    })
  }
})
