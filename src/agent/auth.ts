import type { Request, Response, NextFunction } from 'express'

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = process.env.LOCAL_AGENT_API_KEY
  if (!apiKey) {
    return next()
  }

  const headerKey = req.headers['x-api-key']
  const authHeader = req.headers['authorization']
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  const providedKey = (typeof headerKey === 'string' ? headerKey : null) ?? bearerToken

  if (!providedKey || providedKey !== apiKey) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  next()
}
