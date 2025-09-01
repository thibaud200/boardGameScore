// Fixture conforme au schéma de la table current_game
export const currentGameFixture = [
  {
    id: 1,
    game_data: JSON.stringify({ game_id: 1, session_id: 1, state: 'in_progress' }),
    created_at: '2025-09-01T14:00:00Z',
    updated_at: '2025-09-01T14:05:00Z'
  },
  {
    id: 2,
    game_data: JSON.stringify({ game_id: 2, session_id: 2, state: 'completed' }),
    created_at: '2025-09-01T15:00:00Z',
    updated_at: '2025-09-01T15:10:00Z'
  }
];
