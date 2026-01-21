import { pinyin } from 'pinyin-pro'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const text = body.text as string

  if (!text) {
    return { success: false, slug: '' }
  }

  // 使用 pinyin-pro 转换中文为拼音
  const result = pinyin(text, {
    toneType: 'none', // 不带声调
    type: 'array',    // 返回数组
  })

  // 将拼音数组连接，空格用 - 代替
  const slug = result
    .join('-')
    .toLowerCase()
    .replace(/\s+/g, '-')      // 空格替换为 -
    .replace(/[^a-z0-9-]/g, '') // 移除非字母数字和连字符的字符
    .replace(/-+/g, '-')        // 多个连字符合并为一个
    .replace(/^-|-$/g, '')      // 移除首尾的连字符

  return {
    success: true,
    slug,
  }
})
