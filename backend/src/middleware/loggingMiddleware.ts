import { Request, Response, NextFunction } from 'express'
import LoggerService from '../services/loggerService.js'
import { APILogMeta } from '../types/logging.js'

/**
 * Middleware Express pour logger automatiquement toutes les requêtes HTTP
 */

/**
 * Génère un ID unique pour chaque requête
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Middleware de logging des requêtes
 */
export function requestLoggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now()
  const requestId = generateRequestId()

  // Ajouter l'ID de requête à la request pour référence
  ;(req as Request & { requestId: string }).requestId = requestId

  // Logger le début de la requête
  const requestMeta: Partial<APILogMeta> = {
    context: 'API_INTERNAL',
    method: req.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: req.path,
    requestId,
    requestBody: req.method !== 'GET' ? req.body : undefined
  }

  LoggerService.http(`Incoming request: ${req.method} ${req.path}`, requestMeta)

  // Intercepter la réponse
  const originalSend = res.send
  let responseBody: unknown

  res.send = function (body: unknown) {
    responseBody = body
    return originalSend.call(this, body)
  }

  // Logger la fin de la requête
  res.on('finish', () => {
    const duration = Date.now() - startTime

    const responseMeta: APILogMeta = {
      context: 'API_INTERNAL',
      method: req.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      endpoint: req.path,
      statusCode: res.statusCode,
      responseTime: duration,
      requestId,
      responseBody:
        responseBody && typeof responseBody === 'string'
          ? (() => {
              try {
                return JSON.parse(responseBody)
              } catch {
                return responseBody // Return as string if not valid JSON
              }
            })()
          : responseBody
    }

    if (res.statusCode >= 400) {
      LoggerService.error(
        `Request failed: ${req.method} ${req.path}`,
        responseMeta
      )
    } else {
      LoggerService.http(
        `Request completed: ${req.method} ${req.path}`,
        responseMeta
      )
    }
  })

  next()
}

/**
 * Middleware de logging des erreurs
 */
export function errorLoggingMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId =
    (req as Request & { requestId?: string }).requestId || 'unknown'

  LoggerService.error(`Unhandled error in ${req.method} ${req.path}`, {
    context: 'API_INTERNAL',
    method: req.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: req.path,
    requestId,
    error: error.message,
    stack: error.stack
  })

  // Si les headers ne sont pas encore envoyés, renvoyer une erreur 500
  if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal Server Error',
      requestId,
      timestamp: new Date().toISOString()
    })
  }

  next(error)
}

/**
 * Middleware pour logger les appels BGG spécifiquement
 */
export function bggLoggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now()

  // Logger spécifiquement pour les routes BGG
  if (req.path.startsWith('/api/bgg')) {
    const requestId =
      (req as Request & { requestId?: string }).requestId || generateRequestId()

    LoggerService.info(`BGG API call initiated: ${req.method} ${req.path}`, {
      context: 'API_BGG',
      method: req.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      endpoint: req.path,
      requestId,
      searchTerm: req.query.search as string,
      gameId: req.params.id ? parseInt(req.params.id) : undefined
    })

    // Logger la fin avec détails BGG
    res.on('finish', () => {
      const duration = Date.now() - startTime

      LoggerService.info(`BGG API call completed: ${req.method} ${req.path}`, {
        context: 'API_BGG',
        method: req.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        endpoint: req.path,
        statusCode: res.statusCode,
        responseTime: duration,
        requestId
      })
    })
  }

  next()
}
