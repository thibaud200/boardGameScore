/**
 * Service pour la gestion des statistiques
 */
import { apiClient } from './apiClient'
import type { PlayerStats, GameStats, PlayerGameStats } from '../types'

export class StatsService {
  /**
   * Statistiques globales d'un joueur
   */
  static async getPlayerStats(playerId: number): Promise<PlayerStats | null> {
    try {
      return await apiClient.get<PlayerStats>(`/stats/player/${playerId}`)
    } catch (error: unknown) {
      if ((error as { status?: number }).status === 404) {
        return null
      }
      throw error
    }
  }

  /**
   * Statistiques d'un joueur pour un jeu spécifique
   */
  static async getPlayerGameStats(
    playerId: number,
    gameId: number
  ): Promise<PlayerGameStats | null> {
    try {
      return await apiClient.get<PlayerGameStats>(
        `/stats/player/${playerId}/game/${gameId}`
      )
    } catch (error: unknown) {
      if ((error as { status?: number }).status === 404) {
        return null
      }
      throw error
    }
  }

  /**
   * Statistiques globales d'un jeu
   */
  static async getGameStats(gameId: number): Promise<GameStats | null> {
    try {
      return await apiClient.get<GameStats>(`/stats/game/${gameId}`)
    } catch (error: unknown) {
      if ((error as { status?: number }).status === 404) {
        return null
      }
      throw error
    }
  }

  /**
   * Statistiques de tous les joueurs pour un jeu
   */
  static async getAllPlayersStatsForGame(
    gameId: number
  ): Promise<PlayerGameStats[]> {
    return apiClient.get<PlayerGameStats[]>(`/stats/game/${gameId}/players`)
  }

  /**
   * Statistiques de tous les jeux pour un joueur
   */
  static async getAllGameStatsForPlayer(
    playerId: number
  ): Promise<PlayerGameStats[]> {
    return apiClient.get<PlayerGameStats[]>(`/stats/player/${playerId}/games`)
  }

  /**
   * Recalcule les statistiques (après modification de sessions)
   */
  static async recalculateStats(): Promise<void> {
    return apiClient.post<void>('/stats/recalculate', {})
  }

  /**
   * Utilitaires de formatage
   */
  static formatWinRate(wins: number, totalGames: number): string {
    if (totalGames === 0) return '0%'
    const rate = (wins / totalGames) * 100
    return `${rate.toFixed(1)}%`
  }

  static formatAverageScore(score: number): string {
    return score.toFixed(1)
  }

  static formatLastGameDate(date?: string): string {
    if (!date) return 'Jamais joué'
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  /**
   * Calculs de tendances
   */
  static getPerformanceColor(winRate: number): string {
    if (winRate >= 60) return 'text-green-600'
    if (winRate >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  static getPerformanceIcon(winRate: number): string {
    if (winRate >= 60) return '🔥'
    if (winRate >= 40) return '⚡'
    return '📈'
  }
}
