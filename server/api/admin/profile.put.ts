import { z } from 'zod'
import bcrypt from 'bcryptjs'
import prisma from '~/server/utils/db'
import { getCurrentUser } from '~/server/utils/jwt'

const updateProfileSchema = z.object({
  email: z.string().email('无效的邮箱地址').optional(),
  username: z.string().min(1, '用户名不能为空').optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, '新密码至少需要6个字符').optional(),
}).refine(
  (data) => {
    // 如果要修改密码，必须提供当前密码
    if (data.newPassword && !data.currentPassword) {
      return false
    }
    return true
  },
  { message: '修改密码需要提供当前密码', path: ['currentPassword'] }
)

export default defineEventHandler(async (event) => {
  const currentUser = getCurrentUser(event)
  if (!currentUser) {
    throw createError({
      statusCode: 401,
      message: '需要登录',
    })
  }

  // 验证是否是管理员
  if (currentUser.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: '无权限访问',
    })
  }

  try {
    const body = await readBody(event)
    const validated = updateProfileSchema.parse(body)

    // 获取当前用户信息
    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: '用户不存在',
      })
    }

    const updateData: any = {}

    // 更新用户名
    if (validated.username) {
      updateData.username = validated.username
    }

    // 更新邮箱
    if (validated.email && validated.email !== user.email) {
      // 检查邮箱是否已被使用
      const existingUser = await prisma.user.findUnique({
        where: { email: validated.email },
      })

      if (existingUser) {
        throw createError({
          statusCode: 400,
          message: '该邮箱已被使用',
        })
      }

      updateData.email = validated.email
    }

    // 更新密码
    if (validated.newPassword && validated.currentPassword) {
      // 验证当前密码
      const isValidPassword = await bcrypt.compare(
        validated.currentPassword,
        user.passwordHash
      )

      if (!isValidPassword) {
        throw createError({
          statusCode: 400,
          message: '当前密码不正确',
        })
      }

      updateData.passwordHash = await bcrypt.hash(validated.newPassword, 10)
    }

    // 如果没有任何更新
    if (Object.keys(updateData).length === 0) {
      return {
        success: true,
        message: '没有需要更新的内容',
      }
    }

    // 执行更新
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        role: true,
      },
    })

    return {
      success: true,
      data: updatedUser,
      message: '账号信息已更新',
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
      message: '更新失败：' + error.message,
    })
  }
})
