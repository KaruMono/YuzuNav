import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const settings = await prisma.setting.findMany()

  const result: Record<string, any> = {}
  settings.forEach(setting => {
    switch (setting.type) {
      case 'number':
        result[setting.key] = Number(setting.value)
        break
      case 'boolean':
        result[setting.key] = setting.value === 'true'
        break
      case 'json':
        result[setting.key] = JSON.parse(setting.value)
        break
      default:
        result[setting.key] = setting.value
    }
  })

  return {
    success: true,
    data: result,
  }
})
