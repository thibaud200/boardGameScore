# Table de Traduction des Jeux de Société

## Structure de la table `game_translations`

```sql
CREATE TABLE game_translations (
    translation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id_bgg INTEGER NOT NULL,  -- Référence vers games.game_id_bgg
    language_code VARCHAR(5) NOT NULL,  -- 'fr', 'en', 'de', etc.
    translated_name VARCHAR(255) NOT NULL,
    alternative_names TEXT,  -- JSON array des noms alternatifs
    search_keywords TEXT,  -- Mots-clés pour améliorer la recherche
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (game_id_bgg) REFERENCES games(game_id_bgg),
    UNIQUE(game_id_bgg, language_code)
);
```

## Exemples de données

### Citadels

```json
{
  "game_id_bgg": 478,
  "translations": [
    {
      "language_code": "fr",
      "translated_name": "Citadelles",
      "alternative_names": ["Citadelles Classique"],
      "search_keywords": "médiéval, cartes, rôles, construction, ville"
    },
    {
      "language_code": "en",
      "translated_name": "Citadels",
      "alternative_names": ["Citadels Classic"],
      "search_keywords": "medieval, cards, roles, building, city"
    }
  ]
}
```

### This War of Mine

```json
{
  "game_id_bgg": 188920,
  "translations": [
    {
      "language_code": "fr",
      "translated_name": "This War of Mine",
      "alternative_names": [
        "Cette Guerre qui est Mienne",
        "La Guerre c'est l'Enfer"
      ],
      "search_keywords": "guerre, survie, coopératif, mature, guerre civile"
    },
    {
      "language_code": "en",
      "translated_name": "This War of Mine: The Board Game",
      "alternative_names": ["TWOM"],
      "search_keywords": "war, survival, cooperative, mature, civil war"
    }
  ]
}
```

### Dark Souls

```json
{
  "game_id_bgg": 197831,
  "translations": [
    {
      "language_code": "fr",
      "translated_name": "Dark Souls",
      "alternative_names": ["Dark Souls le Jeu de Plateau"],
      "search_keywords": "fantasy, difficile, coopératif, donjon, boss"
    },
    {
      "language_code": "en",
      "translated_name": "Dark Souls: The Board Game",
      "alternative_names": ["DS:TBG"],
      "search_keywords": "fantasy, difficult, cooperative, dungeon, boss"
    }
  ]
}
```

## Utilisation pour la recherche

1. **Recherche multilingue** : Permettre de chercher "Citadelles" et trouver "Citadels"
2. **Mots-clés** : Recherche par thème ou mécaniques
3. **Noms alternatifs** : Variantes et diminutifs
4. **Indexation** : Index sur translated_name et search_keywords pour performances
