import sharp from 'sharp'
import prisma from './db'
import { uploadToS3, deleteFromS3 } from './s3'
import { uploadToLocal, deleteFromLocal, getStorageSettings } from './storage'
import { randomUUID } from 'crypto'

interface UploadOptions {
  file: Buffer
  filename: string
  contentType: string
  usageType: 'site_logo' | 'rich_content' | 'setting' | 'other'
  usageId?: string
  userId?: string
}

interface UploadResult {
  url: string
  filename: string
  size: number
  mimeType: string
}

// 检查是否需要转换为 WebP
function shouldConvertToWebp(contentType: string, filename: string): boolean {
  // ICO 图标不转换
  if (contentType.includes('ico') || filename.toLowerCase().endsWith('.ico')) {
    return false
  }
  // PNG 和 JPEG 转换为 WebP
  return contentType.includes('png') || contentType.includes('jpeg') || contentType.includes('jpg')
}

// 转换图片为 WebP
async function convertToWebp(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .webp({ quality: 85 })
    .toBuffer()
}

// 上传图片并记录
export async function uploadImage(options: UploadOptions): Promise<UploadResult> {
  const { file, filename, contentType, usageType, usageId, userId } = options
  
  // 获取存储设置（同步，从环境变量读取）
  const storageSettings = getStorageSettings()
  
  let processedFile = file
  let finalContentType = contentType
  let finalFilename = filename
  
  // PNG/JPEG 转换为 WebP（ICO 除外）
  if (shouldConvertToWebp(contentType, filename)) {
    try {
      processedFile = await convertToWebp(file)
      finalContentType = 'image/webp'
      // 修改文件扩展名
      const nameWithoutExt = filename.replace(/\.[^.]+$/, '')
      finalFilename = `${nameWithoutExt}.webp`
    } catch (error) {
      console.error('Failed to convert image to WebP:', error)
      // 转换失败则使用原图
    }
  }
  
  let url: string
  
  if (storageSettings.storage_type === 's3') {
    url = await uploadToS3(processedFile, finalFilename, finalContentType, storageSettings.s3_cdn_url)
  } else {
    url = await uploadToLocal(processedFile, finalFilename, finalContentType)
  }
  
  // 记录到数据库
  await prisma.image.create({
    data: {
      url,
      filename: finalFilename,
      size: processedFile.length,
      mimeType: finalContentType,
      storageType: storageSettings.storage_type,
      usageType,
      usageId: usageId || null,
      userId: userId || null,
    },
  })
  
  return {
    url,
    filename: finalFilename,
    size: processedFile.length,
    mimeType: finalContentType,
  }
}

// 删除图片
export async function deleteImage(url: string): Promise<void> {
  const image = await prisma.image.findUnique({
    where: { url },
  })
  
  if (!image) {
    return
  }
  
  // 从存储中删除
  if (image.storageType === 's3') {
    await deleteFromS3(url)
  } else {
    await deleteFromLocal(url)
  }
  
  // 从数据库删除记录
  await prisma.image.delete({
    where: { url },
  })
}

// 更新图片关联
export async function updateImageUsage(url: string, usageType: string, usageId: string): Promise<void> {
  await prisma.image.updateMany({
    where: { url },
    data: { usageType, usageId },
  })
}

// 获取所有未使用的图片
export async function getUnusedImages(): Promise<any[]> {
  // 获取所有图片
  const images = await prisma.image.findMany()
  
  // 获取所有正在使用的图片 URL
  const usedUrls = new Set<string>()
  
  // 1. 网站 logo
  const sitesWithLogo = await prisma.site.findMany({
    where: { logoUrl: { not: null } },
    select: { logoUrl: true },
  })
  sitesWithLogo.forEach(s => s.logoUrl && usedUrls.add(s.logoUrl))
  
  // 2. 网站富文本中的图片
  const sitesWithContent = await prisma.site.findMany({
    where: { richContent: { not: null } },
    select: { richContent: true },
  })
  sitesWithContent.forEach(s => {
    if (s.richContent) {
      // 匹配 [img]url[/img] 格式
      const imgMatches = s.richContent.match(/\[img\](.*?)\[\/img\]/gi)
      if (imgMatches) {
        imgMatches.forEach(match => {
          const url = match.replace(/\[img\]/i, '').replace(/\[\/img\]/i, '')
          usedUrls.add(url)
        })
      }
    }
  })
  
  // 3. 用户头像
  const usersWithAvatar = await prisma.user.findMany({
    where: { avatarUrl: { not: null } },
    select: { avatarUrl: true },
  })
  usersWithAvatar.forEach(u => u.avatarUrl && usedUrls.add(u.avatarUrl))
  
  // 4. 设置中的图片（favicon, logo 等）
  const settingsWithImages = await prisma.setting.findMany({
    where: {
      key: { in: ['favicon_url', 'apple_touch_icon_url', 'siteLogoUrl'] },
    },
  })
  settingsWithImages.forEach(s => s.value && usedUrls.add(s.value))
  
  // 筛选出未使用的图片
  return images.filter(img => !usedUrls.has(img.url))
}

// 清理未使用的图片
export async function cleanupUnusedImages(): Promise<{ deleted: number; errors: string[] }> {
  const unusedImages = await getUnusedImages()
  let deleted = 0
  const errors: string[] = []
  
  for (const image of unusedImages) {
    try {
      // 只删除超过 24 小时的未使用图片（避免误删刚上传的图片）
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      if (new Date(image.createdAt) < oneDayAgo) {
        await deleteImage(image.url)
        deleted++
      }
    } catch (error: any) {
      errors.push(`Failed to delete ${image.url}: ${error.message}`)
    }
  }
  
  return { deleted, errors }
}
