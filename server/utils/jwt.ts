import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

const getConfig = () => useRuntimeConfig()

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export function generateToken(payload: JWTPayload): string {
  const config = getConfig()
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '7d'
  })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const config = getConfig()
    return jwt.verify(token, config.jwtSecret) as JWTPayload
  } catch (error) {
    return null
  }
}

export function getTokenFromEvent(event: H3Event): string | null {
  const authHeader = getHeader(event, 'authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  const cookie = getCookie(event, 'auth-token')
  return cookie || null
}

export function getCurrentUser(event: H3Event): JWTPayload | null {
  const token = getTokenFromEvent(event)
  if (!token) return null
  return verifyToken(token)
}
