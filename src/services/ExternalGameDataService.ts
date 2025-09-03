/**
 * Service pour l'intégration des données externes (characters, etc.) côté frontend
 */
import { apiClient } from './apiClient'

export interface ExternalGameSupport {
  isSupported: boolean
  hasCharacters: boolean
  characters?: string[]
}

interface ExternalGameData {
  gameId: string
  supported: boolean
  characters?: {
    name: string
    description?: string
    abilities?: string[]
  }[]
  extensions?: {
    name: string
    description?: string
  }[]
}

export class ExternalGameDataService {
  /**
   * Vérifie si un jeu est supporté par le service externe
   */
  static async isGameSupported(bggId: string): Promise<{ supported: boolean }> {
    return apiClient.get(`/external-game-data/support/${bggId}`)
  }

  /**
   * Récupère la liste des jeux supportés
   */
  static async getSupportedGames(): Promise<{ games: string[] }> {
    return apiClient.get('/external-game-data/supported-games')
  }

  /**
   * Récupère les données complètes d'un jeu depuis le service externe
   */
  static async getGameData(bggId: string): Promise<ExternalGameData> {
    return apiClient.get(`/external-game-data/game/${bggId}`)
  }
}
