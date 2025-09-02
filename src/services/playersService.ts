/**
 * Service pour gérer les joueurs via l'API backend
 */
import { apiClient } from './apiClient'
import type { 
  Player, 
  CreatePlayerRequest, 
  UpdatePlayerRequest 
} from '../types'

export class PlayersService {
  /**
   * Récupère tous les joueurs
   */
  static async getAllPlayers(): Promise<Player[]> {
    return apiClient.get<Player[]>('/players')
  }

  /**
   * Récupère un joueur par son ID
   */
  static async getPlayerById(id: number): Promise<Player> {
    return apiClient.get<Player>(`/players/${id}`)
  }

  /**
   * Crée un nouveau joueur
   */
  static async createPlayer(data: CreatePlayerRequest): Promise<Player> {
    return apiClient.post<Player>('/players', data)
  }

  /**
   * Met à jour un joueur existant
   */
  static async updatePlayer(
    id: number, 
    data: UpdatePlayerRequest
  ): Promise<Player> {
    return apiClient.put<Player>(`/players/${id}`, data)
  }

  /**
   * Supprime un joueur
   */
  static async deletePlayer(id: number): Promise<void> {
    return apiClient.delete<void>(`/players/${id}`)
  }
}
