/**
 * Service pour la gestion de la partie en cours
 */
import { apiClient } from './apiClient'
import type {
  CurrentGame,
  CurrentGameData,
  CreateCurrentGameRequest,
  UpdateCurrentGameRequest
} from '../types'

export class CurrentGameService {
  /**
   * Récupère la partie en cours (s'il y en a une)
   */
  static async getCurrentGame(): Promise<CurrentGame | null> {
    try {
      return await apiClient.get<CurrentGame>('/current-game')
    } catch (error: unknown) {
      if ((error as { status?: number }).status === 404) {
        return null // Aucune partie en cours
      }
      throw error
    }
  }

  /**
   * Démarre une nouvelle partie
   */
  static async startGame(
    gameData: CreateCurrentGameRequest
  ): Promise<CurrentGame> {
    // Le backend attend { game_data: string } où game_data est du JSON
    const payload = {
      game_data: JSON.stringify(gameData)
    }
    return apiClient.post<CurrentGame>('/current-game', payload)
  }

  /**
   * Met à jour l'état de la partie en cours
   */
  static async updateCurrentGame(
    currentGameId: number,
    updates: UpdateCurrentGameRequest
  ): Promise<CurrentGame> {
    // Le backend attend { game_data: string } où game_data est du JSON
    const payload = {
      game_data: JSON.stringify(updates)
    }
    return apiClient.put<CurrentGame>(`/current-game/${currentGameId}`, payload)
  }

  /**
   * Termine la partie en cours et la sauvegarde en session
   */
  static async finishCurrentGame(
    currentGameId: number,
    finalScores?: Record<string, unknown>
  ): Promise<{ success: boolean; sessionId?: number }> {
    const payload = finalScores ? { scores: finalScores } : {}
    return apiClient.post<{ success: boolean; sessionId?: number }>(
      `/current-game/${currentGameId}/finish`,
      payload
    )
  }

  /**
   * Annule la partie en cours sans la sauvegarder
   */
  static async cancelCurrentGame(currentGameId: number): Promise<void> {
    return apiClient.delete<void>(`/current-game/${currentGameId}`)
  }

  /**
   * Parse les données JSON de la partie
   */
  static parseGameData(gameDataJson: string): CurrentGameData {
    try {
      const parsed = JSON.parse(gameDataJson)

      // Si players est un tableau d'IDs, le convertir en tableau d'objets Player basiques
      if (Array.isArray(parsed.players) && parsed.players.length > 0) {
        if (typeof parsed.players[0] === 'number') {
          // Convertir les IDs en objets Player basiques
          parsed.players = parsed.players.map((id: number) => ({
            player_id: id,
            player_name: `Joueur ${id}`, // Nom temporaire
            created_at: new Date().toISOString()
          }))
        }
      }

      return parsed
    } catch {
      throw new Error('Données de partie invalides')
    }
  }
}
