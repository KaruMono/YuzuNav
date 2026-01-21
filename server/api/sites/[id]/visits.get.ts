import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: '缺少网站 ID' })
  }

  try {
    // 获取最近7天的日期范围
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)

    // 查询访问记录
    const visits = await prisma.siteVisit.findMany({
      where: {
        siteId: id,
        visitDate: {
          gte: sevenDaysAgo,
          lte: today,
        },
      },
      orderBy: {
        visitDate: 'asc',
      },
    })

    // 生成最近7天的日期数组
    const days: string[] = []
    const pcData: number[] = []
    const mobileData: number[] = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo)
      date.setDate(date.getDate() + i)
      
      // 格式化为 YYYY-MM-DD 用于比较
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`
      
      // 格式化为 MM-DD 用于显示
      days.push(`${month}-${day}`)

      // 查找对应日期的访问数据
      const pcVisit = visits.find(v => {
        const vDate = new Date(v.visitDate)
        const vYear = vDate.getFullYear()
        const vMonth = String(vDate.getMonth() + 1).padStart(2, '0')
        const vDay = String(vDate.getDate()).padStart(2, '0')
        return `${vYear}-${vMonth}-${vDay}` === dateStr && v.deviceType === 'pc'
      })
      const mobileVisit = visits.find(v => {
        const vDate = new Date(v.visitDate)
        const vYear = vDate.getFullYear()
        const vMonth = String(vDate.getMonth() + 1).padStart(2, '0')
        const vDay = String(vDate.getDate()).padStart(2, '0')
        return `${vYear}-${vMonth}-${vDay}` === dateStr && v.deviceType === 'mobile'
      })

      pcData.push(pcVisit?.count || 0)
      mobileData.push(mobileVisit?.count || 0)
    }

    return {
      success: true,
      data: {
        days,
        pc: pcData,
        mobile: mobileData,
      },
    }
  } catch (error) {
    console.error('Failed to get visits:', error)
    // 返回空数据而不是抛出错误
    const days: string[] = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      days.push(`${month}-${day}`)
    }
    return {
      success: true,
      data: {
        days,
        pc: [0, 0, 0, 0, 0, 0, 0],
        mobile: [0, 0, 0, 0, 0, 0, 0],
      },
    }
  }
})
