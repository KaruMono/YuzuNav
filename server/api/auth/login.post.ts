import { z } from 'zod'
import bcrypt from 'bcryptjs'
import prisma from '~/server/utils/db'
import { generateToken } from '~/server/utils/jwt'

const loginSchema = z.object({
  email: z.string().email('无效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validated = loginSchema.parse(body)

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        message: '邮箱或密码错误',
      })
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(validated.password, user.passwordHash)

    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: '邮箱或密码错误',
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
      message: '登录失败，请稍后重试',
    })
  }
})
