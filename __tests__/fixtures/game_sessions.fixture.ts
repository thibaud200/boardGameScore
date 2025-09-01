/**
 * Fixture de sessions de jeu pour tests unitaires
 * @description Données de test pour la table game_sessions
 */
export const gameSessionsFixture = [
  {
    sessions_id: 1,
    sessions_game_id: 1,
    is_cooperative: 0,
    game_mode: 'competitive',
    sessions_players: '[1,2]',
    sessions_scores: '{"1":10,"2":8}',
    sessions_characters: null,
    sessions_extensions: null,
    sessions_winner: 1,
    win_condition: 'score',
    sessions_date: '2025-09-01',
    sessions_duration: '60',
    sessions_completed: 1,
    sessions_coop_result: null,
    sessions_dead_characters: null,
    sessions_new_character_names: null,
    sessions_character_history: null,
    created_at: '2025-09-01T11:00:00Z'
  },
  {
    sessions_id: 2,
    sessions_game_id: 2,
    is_cooperative: 1,
    game_mode: 'cooperative',
    sessions_players: '[1,2]',
    sessions_scores: '{"1":15,"2":12}',
    sessions_characters: '{"1":"brute","2":"spellweaver"}',
    sessions_extensions: '["Forgotten Circles"]',
    sessions_winner: null,
    win_condition: 'campaign',
    sessions_date: '2025-09-01',
    sessions_duration: '120',
    sessions_completed: 1,
    sessions_coop_result: 'won',
    sessions_dead_characters: '{"2":"spellweaver"}',
    sessions_new_character_names: null,
    sessions_character_history: '[{"event":"start"}]',
    created_at: '2025-09-01T13:00:00Z'
  }
];
