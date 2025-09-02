/**
 * Fixture de jeux pour tests unitaires
 * @description Données de test pour la table games
 */
export const gamesFixture = [
  {
    game_id: 1,
    game_id_bgg: '12345',
    game_name: 'Catan',
    game_description: 'Jeu de gestion et de stratégie.',
    game_image: '/images/catan.png',
    has_characters: 0,
    characters: '[]',
    min_players: 3,
    max_players: 4,
    supports_cooperative: 0,
    supports_competitive: 1,
    supports_campaign: 0,
    default_mode: 'competitive',
    created_at: '2025-09-01T10:00:00Z'
  },
  {
    game_id: 2,
    game_id_bgg: '67890',
    game_name: 'Gloomhaven',
    game_description: 'Jeu d’aventure coopératif.',
    game_image: '/images/gloomhaven.png',
    has_characters: true,
    characters: '[{"id":"brute","name":"Brute"}]',
    min_players: 1,
    max_players: 4,
    supports_cooperative: true,
    supports_competitive: false,
    supports_campaign: true,
    default_mode: 'cooperative',
    created_at: '2025-09-01T10:10:00Z'
  }
]
