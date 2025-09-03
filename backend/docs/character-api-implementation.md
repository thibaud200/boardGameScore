# API Personnages de Jeux de Société - Plan d'Implémentation

## 🎯 Problématique Identifiée

- **BGG API** : Excellente pour les extensions, mais **ne liste pas les personnages/rôles**
- **Besoin** : API pour récupérer les personnages de jeux comme Citadels, This War of Mine, etc.
- **Contrainte** : Données externes principalement en anglais
- **Solution** : Créer notre propre API avec scraping + traduction

## 🏗️ Architecture Mise en Place

### 1. **Service de Scraping Externe**

```typescript
// backend/src/services/externalGameDataService.ts
class ExternalGameDataService {
  // Mapping BGG ID -> UltraBoardGames slug
  private GAME_URL_MAPPING = {
    478: 'citadels', // Citadels
    188920: 'this-war-of-mine', // This War of Mine
    197831: 'dark-souls', // Dark Souls
    113924: 'zombicide', // Zombicide
    15987: 'arkham-horror' // Arkham Horror
  }

  // Scraping des personnages depuis UltraBoardGames
  async scrapeGameData(bggGameId: number): Promise<GameExternalData>
}
```

### 2. **Service de Traduction Multilingue**

```typescript
// backend/src/services/gameTranslationService.ts
class GameTranslationService {
  // Recherche "citadelles" -> trouve "Citadels" (BGG ID 478)
  searchGames(query: string, language: string): SearchResult[]

  // Table game_translations pour mapper FR ↔ EN
  addTranslation(translation: GameTranslation): number
}
```

### 3. **Table de Traduction**

```sql
CREATE TABLE game_translations (
  game_id_bgg INTEGER,
  language_code VARCHAR(5),  -- 'fr', 'en'
  translated_name VARCHAR(255), -- 'Citadelles' / 'Citadels'
  alternative_names TEXT,    -- JSON: ["Citadelle", "Citadelles Classique"]
  search_keywords TEXT       -- "médiéval cartes rôles construction"
);
```

## 🔗 Nouvelles Routes API

### Recherche Multilingue

```http
GET /api/games/search?q=citadelles&lang=fr
```

**Réponse :**

```json
{
  "query": "citadelles",
  "language": "fr",
  "results": [
    {
      "game_id_bgg": 478,
      "translated_name": "Citadelles",
      "match_reason": "exact",
      "relevance_score": 100
    }
  ]
}
```

### Données Externes (Personnages)

```http
GET /api/games/478/external-data
```

**Réponse :**

```json
{
  "basic_info": {
    "name": "Citadels",
    "min_players": 2,
    "max_players": 8
  },
  "characters": [
    {
      "name": "Assassin",
      "description": "Can eliminate another character",
      "abilities": ["Murder another character"],
      "language": "en"
    }
  ],
  "source": "ultraboardgames",
  "scraped_at": "2025-09-03T..."
}
```

### Jeux Supportés

```http
GET /api/external/supported-games
```

## 📋 État d'Avancement

### ✅ **Implémenté**

- [x] Service de scraping externe (structure)
- [x] Service de traduction multilingue
- [x] Table de traductions avec index
- [x] Routes API pour recherche et données externes
- [x] Mapping des 5 jeux principaux
- [x] Traductions par défaut (FR/EN)

### 🔄 **En Cours**

- [ ] Scraping HTML réel avec Cheerio/JSdom
- [ ] Test des nouvelles routes (redémarrage serveur nécessaire)
- [ ] Validation des URLs UltraBoardGames

### 📝 **À Faire**

- [ ] Parser HTML spécifique pour chaque jeu
- [ ] Gestion d'erreurs robuste
- [ ] Cache des données scrapées
- [ ] Synchronisation périodique
- [ ] Interface admin pour traductions

## 🎮 Jeux Priorisés

1. **Citadels** (478) ✅ Confirmé sur UltraBoardGames
2. **This War of Mine** (188920) ⚠️ À vérifier
3. **Dark Souls** (197831) ⚠️ À vérifier
4. **Zombicide** (113924) ⚠️ À vérifier
5. **Arkham Horror** (15987) ⚠️ À vérifier

## ⚡ Avantages de cette Approche

1. **Recherche Intelligente** : "citadelles" trouve "Citadels"
2. **Données Riches** : Descriptions, capacités, images des personnages
3. **Extensible** : Facile d'ajouter de nouveaux jeux/sources
4. **Multilingue** : Support FR/EN avec possibilité d'extension
5. **Complémentaire à BGG** : Extensions via BGG, personnages via scraping

## 🚨 Limites Acceptées

- **Données en anglais** : Source UltraBoardGames principalement EN
- **Maintenance** : Scraping nécessite maintenance si structure HTML change
- **Couverture partielle** : Tous les jeux ne sont pas sur UltraBoardGames
- **Latence** : Scraping plus lent que API native

## 🎯 Prochaines Étapes

1. **Redémarrer le serveur** pour tester les nouvelles routes
2. **Valider les URLs** UltraBoardGames pour les 5 jeux
3. **Implémenter le scraping HTML** réel avec Cheerio
4. **Tester la recherche** "citadelles" → "Citadels" → données scrapées
5. **Itérer** sur les autres jeux prioritaires
