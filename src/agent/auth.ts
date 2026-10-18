import crypto from 'node:crypto'
import type { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'

export const chatRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
})

function safeCompare(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest()
  const hashB = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(hashA, hashB)
}

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '0')
  res.setHeader('Referrer-Policy', 'no-referrer')
  next()
}

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = process.env.LOCAL_AGENT_API_KEY
  if (!apiKey) {
    return next()
  }

  const headerKey = req.headers['x-api-key']
  const authHeader = req.headers['authorization']
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  const providedKey = (typeof headerKey === 'string' ? headerKey : null) ?? bearerToken

  if (!providedKey || !safeCompare(providedKey, apiKey)) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  next()
}
