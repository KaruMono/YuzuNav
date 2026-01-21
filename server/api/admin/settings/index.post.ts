import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const settings = body.settings as Record<string, { value: any; type: string }>

    if (!settings) {
      throw createError({
        statusCode: 400,
        message: '缺少设置数据',
      })
    }

    const updates = Object.entries(settings).map(([key, { value, type }]) => {
      let stringValue: string
      if (type === 'json') {
        stringValue = JSON.stringify(value)
      } else {
        stringValue = String(value)
      }

      return prisma.setting.upsert({
        where: { key },
        update: { value: stringValue, type },
        create: { key, value: stringValue, type },
      })
    })

    await Promise.all(updates)

    return {
      success: true,
      message: '设置已保存',
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: '保存失败：' + error.message,
    })
  }
})
