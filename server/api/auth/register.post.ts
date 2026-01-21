import { z } from 'zod'
import bcrypt from 'bcryptjs'
import prisma from '~/server/utils/db'
import { generateToken } from '~/server/utils/jwt'
import { sendVerificationEmail } from '~/server/utils/email'
import { randomUUID } from 'crypto'

const registerSchema = z.object({
  email: z.string().email('无效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
  username: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  try {
    // 检查是否允许注册
    const registrationSetting = await prisma.setting.findUnique({
      where: { key: 'enableRegistration' },
    })
    if (registrationSetting && registrationSetting.value === 'false') {
      throw createError({
        statusCode: 403,
        message: '当前不允许新用户注册',
      })
    }

    const body = await readBody(event)
    const validated = registerSchema.parse(body)

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: '该邮箱已被注册',
      })
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(validated.password, 10)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        passwordHash,
        username: validated.username || validated.email.split('@')[0],
        emailVerified: false,
      },
    })

    const config = useRuntimeConfig()

    // 如果启用了邮件验证，发送验证邮件
    if (config.public.enableEmailVerification) {
      const token = randomUUID()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      await prisma.emailVerification.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      })

      try {
        await sendVerificationEmail(user.email, token)
      } catch (emailError) {
        console.error('发送验证邮件失败:', emailError)
        // 不阻止注册，但记录错误
      }
    } else {
      // 如果未启用邮件验证，直接标记为已验证
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      })
    }

    // 生成 JWT token
    const jwtToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // 设置 cookie
    setCookie(event, 'auth-token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
        role: user.role,
      },
      token: jwtToken,
      message: config.public.enableEmailVerification
        ? '注册成功！请检查您的邮箱以验证账户。'
        : '注册成功！',
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: error.errors[0].message,
      })
    }
    throw createError({
      statusCode: 500,
      message: '注册失败，请稍后重试',
    })
  }
})
