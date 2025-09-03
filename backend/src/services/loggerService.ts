import winston from 'winston'
import path from 'path'

/**
 * Service de logging centralisé pour l'application
 * Utilise Winston avec configuration environnementale
 */

// Niveaux de log personnalisés
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
}

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
}

// Configuration selon l'environnement
const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'

// Format pour la console (développement)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
    let logMessage = `${timestamp} [${level}]`

    if (context) {
      logMessage += ` [${context}]`
    }

    logMessage += `: ${message}`

    // Ajouter les métadonnées si présentes
    if (Object.keys(meta).length > 0) {
      logMessage += ` ${JSON.stringify(meta, null, 2)}`
    }

    return logMessage
  })
)

// Format pour les fichiers (JSON structuré)
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Configuration des transports
const transports: winston.transport[] = []

// Console pour développement et test
if (!isProduction) {
  transports.push(
    new winston.transports.Console({
      level: isTest ? 'warn' : 'debug',
      format: consoleFormat
    })
  )
}

// Fichiers de log pour production et développement
if (!isTest) {
  // Logs d'erreurs
  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5
    })
  )

  // Logs combinés
  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      level: isProduction ? 'info' : 'debug',
      format: fileFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5
    })
  )
}

// Création du logger Winston
winston.addColors(logColors)

const logger = winston.createLogger({
  levels: logLevels,
  level: isProduction ? 'info' : 'debug',
  transports,
  exitOnError: false
})

/**
 * Interface pour le contexte de logging
 */
export interface LogContext {
  context?: string
  userId?: string
  requestId?: string
  duration?: number
  statusCode?: number
  method?: string
  url?: string
  [key: string]: unknown
}

/**
 * Service de logging avec méthodes contextuelles
 */
export class LoggerService {
  /**
   * Log d'erreur
   */
  static error(message: string, meta: LogContext = {}) {
    logger.error(message, meta)
  }

  /**
   * Log d'avertissement
   */
  static warn(message: string, meta: LogContext = {}) {
    logger.warn(message, meta)
  }

  /**
   * Log d'information
   */
  static info(message: string, meta: LogContext = {}) {
    logger.info(message, meta)
  }

  /**
   * Log HTTP (requêtes/réponses)
   */
  static http(message: string, meta: LogContext = {}) {
    logger.http(message, meta)
  }

  /**
   * Log de debug (développement seulement)
   */
  static debug(message: string, meta: LogContext = {}) {
    logger.debug(message, meta)
  }

  /**
   * Logger spécialisé pour les API externes (BGG, etc.)
   */
  static apiCall(
    apiName: string,
    method: string,
    url: string,
    statusCode?: number,
    duration?: number,
    data?: unknown
  ) {
    const meta: LogContext = {
      context: `API_${apiName}`,
      method,
      url,
      statusCode,
      duration
    }

    if (data) {
      meta.responseData = data
    }

    if (statusCode && statusCode >= 400) {
      this.error(`API ${apiName} error: ${method} ${url}`, meta)
    } else {
      this.http(`API ${apiName} call: ${method} ${url}`, meta)
    }
  }

  /**
   * Logger pour les opérations de base de données
   */
  static database(
    operation: string,
    table: string,
    duration?: number,
    error?: Error
  ) {
    const meta: LogContext = {
      context: 'DATABASE',
      operation,
      table,
      duration
    }

    if (error) {
      meta.error = error.message
      meta.stack = error.stack
      this.error(`Database error: ${operation} on ${table}`, meta)
    } else {
      this.debug(`Database operation: ${operation} on ${table}`, meta)
    }
  }

  /**
   * Logger pour le parsing de données
   */
  static parsing(
    source: string,
    action: string,
    success: boolean,
    details?: unknown,
    error?: Error
  ) {
    const meta: LogContext = {
      context: 'PARSING',
      source,
      action,
      success,
      details
    }

    if (error) {
      meta.error = error.message
      this.error(`Parsing error: ${action} from ${source}`, meta)
    } else if (success) {
      this.debug(`Parsing success: ${action} from ${source}`, meta)
    } else {
      this.warn(`Parsing warning: ${action} from ${source}`, meta)
    }
  }

  /**
   * Logger pour les sessions utilisateur
   */
  static userAction(
    action: string,
    userId?: string,
    details?: unknown,
    duration?: number
  ) {
    const meta: LogContext = {
      context: 'USER_ACTION',
      userId,
      action,
      details,
      duration
    }

    this.info(`User action: ${action}`, meta)
  }
}

export default LoggerService
