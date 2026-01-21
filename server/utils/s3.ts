import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'

export default defineEventHandler(async () => {
  // This file is for utilities only
})

const getConfig = () => useRuntimeConfig()

export async function uploadToS3(
  file: Buffer,
  filename: string,
  contentType: string,
  cdnUrl?: string
): Promise<string> {
  const config = getConfig()
  
  // 生成唯一文件名
  const ext = filename.split('.').pop() || 'bin'
  const uniqueFilename = `${randomUUID()}.${ext}`
  
  // 按年月组织目录
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const key = `uploads/${year}/${month}/${uniqueFilename}`
  
  const s3Client = new S3Client({
    region: config.s3Region,
    endpoint: config.s3Endpoint || undefined,
    credentials: {
      accessKeyId: config.s3AccessKeyId,
      secretAccessKey: config.s3SecretAccessKey,
    },
    forcePathStyle: config.s3Endpoint ? true : false,
  })
  
  const command = new PutObjectCommand({
    Bucket: config.s3Bucket,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read',
  })

  await s3Client.send(command)

  // 返回文件 URL
  // 优先使用 CDN URL
  if (cdnUrl) {
    return `${cdnUrl.replace(/\/$/, '')}/${key}`
  }
  
  if (config.s3Endpoint) {
    return `${config.s3Endpoint}/${config.s3Bucket}/${key}`
  }
  return `https://${config.s3Bucket}.s3.${config.s3Region}.amazonaws.com/${key}`
}

export async function deleteFromS3(key: string): Promise<void> {
  const config = getConfig()
  // 从完整 URL 中提取 key
  const s3Key = key.includes('/uploads/') ? key.split('/uploads/')[1] : key.replace(/^.*\/uploads\//, 'uploads/')
  
  const s3Client = new S3Client({
    region: config.s3Region,
    endpoint: config.s3Endpoint || undefined,
    credentials: {
      accessKeyId: config.s3AccessKeyId,
      secretAccessKey: config.s3SecretAccessKey,
    },
    forcePathStyle: config.s3Endpoint ? true : false,
  })
  
  const command = new DeleteObjectCommand({
    Bucket: config.s3Bucket,
    Key: s3Key,
  })

  await s3Client.send(command)
}
