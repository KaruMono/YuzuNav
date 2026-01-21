import prisma from '~/server/utils/db'

export default defineEventHandler(async () => {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  })

  return {
    success: true,
    data: tags,
  }
})
