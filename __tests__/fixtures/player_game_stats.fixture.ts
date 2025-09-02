/**
 * Fixture de statistiques joueur-jeu pour tests unitaires
 * @description Données de test pour la table player_game_stats
 */
export const playerGameStatsFixture = [
  {
    stat_id: 1,
    player_id: 1,
    game_id: 1,
    total_games_played: 3,
    total_wins: 2,
    total_losses: 1,
    total_score: 30,
    average_score: 10,
    last_game_date: '2025-09-01T11:00:00Z',
    created_at: '2025-09-01T11:00:00Z'
  },
  {
    stat_id: 2,
    player_id: 2,
    game_id: 2,
    total_games_played: 2,
    total_wins: 0,
    total_losses: 2,
    total_score: 14,
    average_score: 7,
    last_game_date: '2025-09-01T13:00:00Z',
    created_at: '2025-09-01T13:00:00Z'
  }
]
