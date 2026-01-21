import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, message: '缺少网站 ID' })
  }

  // 判断设备类型
  const userAgent = getHeader(event, 'user-agent') || ''
  let deviceType = body?.deviceType || 'pc'
  
  // 如果没有传入设备类型，根据 User-Agent 判断
  if (!body?.deviceType) {
    const mobileKeywords = ['Mobile', 'Android', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone']
    deviceType = mobileKeywords.some(keyword => userAgent.includes(keyword)) ? 'mobile' : 'pc'
  }

  // 获取今天的日期（不包含时间）
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  try {
    // 尝试更新现有记录或创建新记录
    await prisma.siteVisit.upsert({
      where: {
        siteId_deviceType_visitDate: {
          siteId: id,
          deviceType,
          visitDate: today,
        },
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        siteId: id,
        deviceType,
        visitDate: today,
        count: 1,
      },
    })

    // 同时更新总访问量
    await prisma.site.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })

    return { success: true }
  } catch (error) {
    console.error('记录访问失败:', error)
    return { success: false }
  }
})
