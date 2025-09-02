/**
 * Fixture de personnages de jeu pour tests unitaires
 * @description Données de test pour la table game_characters
 */
export const gameCharactersFixture = [
  {
    characters_id: 1,
    game_id: 2,
    characters_name: 'Brute',
    characters_description: 'Tank, encaisse les dégâts.',
    characters_abilities: '["Shield","Taunt"]',
    characters_image_url: '/images/brute.png',
    characters_source: 'manual',
    characters_external_id: null,
    class_type: 'Tank',
    created_at: '2025-09-01T10:15:00Z'
  },
  {
    characters_id: 2,
    game_id: 2,
    characters_name: 'Spellweaver',
    characters_description: 'Mage, contrôle les éléments.',
    characters_abilities: '["Fire","Ice"]',
    characters_image_url: '/images/spellweaver.png',
    characters_source: 'manual',
    characters_external_id: null,
    class_type: 'Mage',
    created_at: '2025-09-01T10:20:00Z'
  }
]
