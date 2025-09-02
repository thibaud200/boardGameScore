/**
 * Service pour la gestion des sessions de jeu (historique des parties)
 */
import { apiClient } from './apiClient'
import type { SessionWithDetails } from '../types'

export class GameSessionsService {
  /**
   * Récupère toutes les sessions
   */
  static async getAllSessions(): Promise<SessionWithDetails[]> {
    return apiClient.get<SessionWithDetails[]>('/game-sessions')
  }

  /**
   * Récupère les sessions d'un jeu spécifique
   */
  static async getSessionsByGame(
    gameId: number
  ): Promise<SessionWithDetails[]> {
    return apiClient.get<SessionWithDetails[]>(`/game-sessions/game/${gameId}`)
  }

  /**
   * Récupère les sessions d'un joueur spécifique
   */
  static async getSessionsByPlayer(
    playerId: number
  ): Promise<SessionWithDetails[]> {
    return apiClient.get<SessionWithDetails[]>(
      `/game-sessions/player/${playerId}`
    )
  }

  /**
   * Récupère une session par ID
   */
  static async getSessionById(sessionId: number): Promise<SessionWithDetails> {
    return apiClient.get<SessionWithDetails>(`/game-sessions/${sessionId}`)
  }

  /**
   * Supprime une session
   */
  static async deleteSession(sessionId: number): Promise<void> {
    return apiClient.delete<void>(`/game-sessions/${sessionId}`)
  }

  /**
   * Parse les données JSON des sessions
   */
  static parsePlayersData(playersJson: string): number[] {
    try {
      return JSON.parse(playersJson)
    } catch {
      return []
    }
  }

  static parseScoresData(scoresJson: string): Record<string, number> {
    try {
      return JSON.parse(scoresJson)
    } catch {
      return {}
    }
  }

  static parseCharactersData(charactersJson?: string): Record<string, string> {
    if (!charactersJson) return {}
    try {
      return JSON.parse(charactersJson)
    } catch {
      return {}
    }
  }

  /**
   * Formate les données pour l'affichage
   */
  static formatDuration(duration?: string): string {
    if (!duration) return 'Non spécifiée'
    const minutes = parseInt(duration)
    if (isNaN(minutes)) return duration

    if (minutes < 60) {
      return `${minutes} min`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`
    }
  }

  static formatGameMode(mode: string): string {
    const modes: Record<string, string> = {
      competitive: 'Compétitif',
      cooperative: 'Coopératif',
      campaign: 'Campagne'
    }
    return modes[mode] || mode
  }

  static formatCoopResult(result?: string): string {
    if (!result) return ''
    const results: Record<string, string> = {
      won: '🏆 Victoire',
      lost: '💀 Défaite'
    }
    return results[result] || result
  }
}
