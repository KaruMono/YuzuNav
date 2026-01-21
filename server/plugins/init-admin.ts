import prisma from '~/server/utils/db'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

export default defineNitroPlugin(async () => {
  try {
    // 检查是否已存在管理员账号
    const adminCount = await prisma.user.count({
      where: { role: 'admin' },
    })

    if (adminCount === 0) {
      // 生成随机密码
      const randomPassword = randomBytes(8).toString('hex') // 16位随机密码
      const passwordHash = await bcrypt.hash(randomPassword, 10)

      // 创建默认管理员账号
      const admin = await prisma.user.create({
        data: {
          email: 'admin@yuzuacg.com',
          passwordHash,
          username: 'Admin',
          emailVerified: true,
          role: 'admin',
        },
      })

      console.log('\n')
      console.log('╔══════════════════════════════════════════════════════════════╗')
      console.log('║                    🎉 管理员账号已创建                        ║')
      console.log('╠══════════════════════════════════════════════════════════════╣')
      console.log('║                                                              ║')
      console.log(`║  📧 邮箱: admin@yuzuacg.com                                   ║`)
      console.log(`║  🔑 密码: ${randomPassword}                                   ║`)
      console.log('║                                                              ║')
      console.log('║  ⚠️  请立即登录后台修改密码！                                 ║')
      console.log('║                                                              ║')
      console.log('╚══════════════════════════════════════════════════════════════╝')
      console.log('\n')
    }
  } catch (error) {
    console.error('初始化管理员账号失败:', error)
  }
})
