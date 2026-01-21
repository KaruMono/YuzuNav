import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

let transporter: Transporter | null = null

function getTransporter(): Transporter {
  if (!transporter) {
    const config = useRuntimeConfig()
    transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    })
  }
  return transporter
}

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const config = useRuntimeConfig()
  const verifyUrl = `${config.appUrl}/verify-email?token=${token}`
  
  const mailOptions = {
    from: config.smtpFrom,
    to: email,
    subject: '验证您的邮箱 - YuzuACG',
    html: `
      <div style="font-family: 'Inter', 'Noto Sans SC', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0f172a; font-size: 24px; margin-bottom: 20px;">欢迎注册 YuzuACG</h1>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          感谢您注册 YuzuACG！请点击下面的链接验证您的邮箱地址：
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" 
             style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); 
                    color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
            验证邮箱
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 30px;">
          如果按钮无法点击，请复制以下链接到浏览器中打开：<br>
          <a href="${verifyUrl}" style="color: #3b82f6; word-break: break-all;">${verifyUrl}</a>
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
          此链接将在 24 小时后过期。如果您没有注册此账户，请忽略此邮件。
        </p>
      </div>
    `,
  }

  await getTransporter().sendMail(mailOptions)
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const config = useRuntimeConfig()
  const resetUrl = `${config.appUrl}/reset-password?token=${token}`
  
  const mailOptions = {
    from: config.smtpFrom,
    to: email,
    subject: '重置您的密码 - YuzuACG',
    html: `
      <div style="font-family: 'Inter', 'Noto Sans SC', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0f172a; font-size: 24px; margin-bottom: 20px;">重置密码</h1>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          您请求重置密码。请点击下面的链接重置您的密码：
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); 
                    color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
            重置密码
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 30px;">
          如果按钮无法点击，请复制以下链接到浏览器中打开：<br>
          <a href="${resetUrl}" style="color: #3b82f6; word-break: break-all;">${resetUrl}</a>
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
          此链接将在 1 小时后过期。如果您没有请求重置密码，请忽略此邮件。
        </p>
      </div>
    `,
  }

  await getTransporter().sendMail(mailOptions)
}
