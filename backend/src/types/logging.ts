/**
 * Types TypeScript pour le système de logging
 */

/**
 * Niveaux de log disponibles
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug'

/**
 * Contextes de logging spécialisés
 */
export type LogContextType =
  | 'API_BGG'
  | 'API_INTERNAL'
  | 'DATABASE'
  | 'PARSING'
  | 'USER_ACTION'
  | 'BGG_SEARCH'
  | 'BGG_DETAILS'
  | 'BGG_CHARACTERS'
  | 'BGG_EXTENSIONS'
  | 'BGG_ANALYSIS'

/**
 * Interface pour les métadonnées de log BGG
 */
export interface BGGLogMeta {
  context:
    | 'API_BGG'
    | 'BGG_SEARCH'
    | 'BGG_DETAILS'
    | 'BGG_CHARACTERS'
    | 'BGG_EXTENSIONS'
    | 'BGG_ANALYSIS'
  gameId?: number
  gameName?: string
  searchTerm?: string
  resultCount?: number
  responseSize?: number
  cacheHit?: boolean
  parseTime?: number
  apiCallTime?: number
  gameCount?: number
  extensionCount?: number
  totalGames?: number
  gamesWithExtensions?: number
  averageExtensions?: number
  analysisTime?: number
  characters?: Array<{
    name: string
    id?: string
    type?: string
  }>
  extensions?: Array<{
    name: string
    id?: number
    year?: number
  }>
  [key: string]: unknown
}

/**
 * Interface pour les métadonnées de log de base de données
 */
export interface DatabaseLogMeta {
  context: 'DATABASE'
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CREATE' | 'DROP'
  table: string
  rowsAffected?: number
  queryTime?: number
  query?: string
  parameters?: unknown[]
  [key: string]: unknown
}

/**
 * Interface pour les métadonnées d'API interne
 */
export interface APILogMeta {
  context: 'API_INTERNAL'
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  endpoint: string
  statusCode: number
  responseTime: number
  userId?: string
  requestId?: string
  requestBody?: unknown
  responseBody?: unknown
  [key: string]: unknown
}

/**
 * Interface pour les métadonnées de parsing
 */
export interface ParsingLogMeta {
  context: 'PARSING'
  source: 'BGG_XML' | 'USER_INPUT' | 'DATABASE' | 'API_RESPONSE'
  inputSize?: number
  outputSize?: number
  parseTime?: number
  elementsProcessed?: number
  errors?: string[]
  warnings?: string[]
  [key: string]: unknown
}

/**
 * Union type pour toutes les métadonnées possibles
 */
export type LogMeta = BGGLogMeta | DatabaseLogMeta | APILogMeta | ParsingLogMeta

/**
 * Interface pour la configuration du logger
 */
export interface LoggerConfig {
  level: LogLevel
  environment: 'development' | 'test' | 'production'
  enableFileLogging: boolean
  enableConsoleLogging: boolean
  logDirectory: string
  maxFileSize: number
  maxFiles: number
}

/**
 * Interface pour les métriques de performance
 */
export interface PerformanceMetrics {
  startTime: number
  endTime?: number
  duration?: number
  memoryUsage?: NodeJS.MemoryUsage
  cpuUsage?: NodeJS.CpuUsage
}

/**
 * Helper type pour créer des loggers spécialisés
 */
export interface SpecializedLogger {
  error: (message: string, meta?: Partial<LogMeta>) => void
  warn: (message: string, meta?: Partial<LogMeta>) => void
  info: (message: string, meta?: Partial<LogMeta>) => void
  debug: (message: string, meta?: Partial<LogMeta>) => void
}
