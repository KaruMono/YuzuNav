import { randomUUID } from 'crypto'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

// 获取存储设置
// 仅从环境变量读取（不查询数据库，提升性能）
export function getStorageSettings() {
  const config = useRuntimeConfig()
  
  return {
    storage_type: config.storageType || 'local',
    s3_bucket: config.s3Bucket || '',
    s3_region: config.s3Region || '',
    s3_endpoint: config.s3Endpoint || '',
    s3_cdn_url: config.s3CdnUrl || '',
  }
}

// 本地存储上传
export async function uploadToLocal(
  file: Buffer,
  filename: string,
  _contentType: string
): Promise<string> {
  // 生成唯一文件名
  const ext = filename.split('.').pop() || 'bin'
  const uniqueFilename = `${randomUUID()}.${ext}`
  
  // 按年月组织目录
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const relativePath = `${year}/${month}/${uniqueFilename}`
  
  // 构建完整路径（上传到项目根目录的 uploads 文件夹）
  const uploadDir = join(process.cwd(), 'uploads', String(year), month)
  const fullPath = join(uploadDir, uniqueFilename)
  
  // 确保目录存在
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }
  
  // 写入文件
  await writeFile(fullPath, file)
  
  // 返回相对 URL（由 server/routes/uploads/[...path].get.ts 处理）
  return `/uploads/${relativePath}`
}

// 本地存储删除
export async function deleteFromLocal(url: string): Promise<void> {
  // 从 URL 中提取相对路径 (/uploads/2026/01/xxx.ico -> 2026/01/xxx.ico)
  const relativePath = url.replace(/^\/uploads\//, '')
  const fullPath = join(process.cwd(), 'uploads', relativePath)
  
  try {
    if (existsSync(fullPath)) {
      await unlink(fullPath)
    }
  } catch (error) {
    console.error('Failed to delete local file:', error)
  }
}
