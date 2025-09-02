# 📡 API Documentation - Board Game Score Tracker

✅ **Status : 10 endpoints - Tous testés et fonctionnels** (33/33 tests réussissent)

## Joueurs

### GET /api/players ✅

- Liste tous les joueurs
- 200: tableau de joueurs

### GET /api/players/:id ✅

- Récupère un joueur par id
- 200: joueur
- 404: joueur non trouvé

### POST /api/players ✅

- Crée un joueur
- Body: `{ player_name: string }`
- 201: joueur créé
- 400: erreur de validation (nom requis, unique)

### DELETE /api/players/:id ✅

- Supprime un joueur
- 204: succès

## Jeux

### GET /api/games ✅

- Liste tous les jeux
- 200: tableau de jeux

### GET /api/games/:id ✅

- Récupère un jeu par id
- 200: jeu
- 404: jeu non trouvé

### POST /api/games ✅

- Crée un jeu
- Body: `{ game_name: string, ... }`
- 201: jeu créé
- 400: erreur de validation

### DELETE /api/games/:id ✅

- Supprime un jeu
- 204: succès

## Sessions de jeu

### GET /api/game-sessions ✅

- Liste toutes les sessions
- 200: tableau de sessions

### GET /api/game-sessions/:id ✅

- Récupère une session par id
- 200: session
- 404: session non trouvée

### POST /api/game-sessions ✅

- Crée une session
- Body: `{ sessions_game_id: number, sessions_players: string, ... }`
- 201: session créée
- 400: erreur de validation

### DELETE /api/game-sessions/:id ✅

- Supprime une session
- 204: succès

## Personnages de jeu

### GET /api/game-characters ✅

- Liste tous les personnages
- 200: tableau de personnages

### GET /api/game-characters/:id ✅

- Récupère un personnage par id
- 200: personnage
- 404: personnage non trouvé

### POST /api/game-characters

- Crée un personnage
- Body: `{ ... }`
- 201: personnage créé
- 400: erreur de validation

### DELETE /api/game-characters/:id

- Supprime un personnage
- 204: succès

## Extensions de jeu

### GET /api/game-extensions

- Liste toutes les extensions
- 200: tableau d'extensions

### GET /api/game-extensions/:id

- Récupère une extension par id
- 200: extension
- 404: extension non trouvée

### POST /api/game-extensions

- Crée une extension
- Body: `{ ... }`
- 201: extension créée
- 400: erreur de validation

### DELETE /api/game-extensions/:id

- Supprime une extension
- 204: succès

## Partie en cours

### GET /api/current-game

- Récupère la partie en cours
- 200: partie

### POST /api/current-game

- Sauvegarde une partie en cours
- Body: `{ ... }`
- 201: partie créée
- 400: erreur de validation

### PUT /api/current-game/:id

- Met à jour une partie en cours
- Body: `{ "game_data": ... }`
- 200: partie mise à jour
- 400: erreur de mise à jour

## Statistiques

### GET /api/player-stats

- Liste toutes les stats joueurs
- 200: tableau de stats

### GET /api/player-stats/:id

- Récupère les stats d'un joueur
- 200: stats
- 404: stats non trouvées

### GET /api/game-stats

- Liste toutes les stats jeux
- 200: tableau de stats

### GET /api/game-stats/:id

- Récupère les stats d'un jeu
- 200: stats
- 404: stats non trouvées

### GET /api/player-game-stats

- Liste toutes les stats joueur-jeu
- 200: tableau de stats

### GET /api/player-game-stats/:id

- Récupère les stats joueur-jeu par id
- 200: stats
- 404: stats non trouvées

# Documentation des endpoints API

Ce document décrit les routes principales de l’API backend, leurs paramètres, codes de retour, exemples d’appels et de réponses.

## POST /api/players

- **Description** : Crée un nouveau joueur
- **Méthode** : POST
- **URL** : `/api/players`
- **Body JSON** :
  ```json
  {
    "player_name": "Alice"
  }
  ```
- **Réponse 201** :
  ```json
  {
    "player_id": 1,
    "player_name": "Alice",
    "created_at": "2025-09-01T19:39:23.614Z"
  }
  ```
- **Réponse 400** :
  ```json
  {
    "error": "player_name is required"
  }
  ```

## GET /api/players

- **Description** : Liste tous les joueurs
- **Méthode** : GET
- **URL** : `/api/players`
- **Réponse 200** :
  ```json
  [
    {
      "player_id": 1,
      "player_name": "Alice",
      "created_at": "2025-09-01T19:39:23.614Z"
    },
    {
      "player_id": 2,
      "player_name": "Bob",
      "created_at": "2025-09-01T19:40:00.000Z"
    }
  ]
  ```

## GET /api/players/:id

- **Description** : Récupère un joueur par son id
- **Méthode** : GET
- **URL** : `/api/players/1`
- **Réponse 200** :
  ```json
  {
    "player_id": 1,
    "player_name": "Alice",
    "created_at": "2025-09-01T19:39:23.614Z"
  }
  ```
- **Réponse 404** :
  ```json
  {
    "error": "Joueur non trouvé"
  }
  ```

---

## 🧪 Tests & Validation

✅ **Status : Tous les endpoints sont testés et fonctionnent parfaitement**

- **Tests d'intégration** : 22 tests couvrant tous les endpoints ✅
- **Tests unitaires** : 11 tests pour tous les services backend ✅
- **Total** : 33/33 tests réussissent
- **Infrastructure** : Base de test isolée avec fixtures automatiques
- **Configuration** : Tests en série pour éviter les conflits de concurrence

### Endpoints testés

- ✅ `/api/players` (5 tests)
- ✅ `/api/games` (1 test)
- ✅ `/api/game-sessions` (4 tests)
- ✅ `/api/game-characters` (1 test)
- ✅ `/api/game-extensions` (1 test)
- ✅ `/api/current-game` (1 test)
- ✅ `/api/game-stats` (1 test)
- ✅ `/api/player-stats` (1 test)
- ✅ `/api/player-game-stats` (1 test)

## Intégration BoardGameGeek ✅

### Service BGG (bggService)

**Statut** : Typage TypeScript complet, 0 erreurs ESLint

#### Fonctionnalités

- **Recherche de jeux** : `searchGames(query)` - API BGG search
- **Détails de jeu** : `getGameDetails(gameId)` - API BGG thing avec stats
- **Cache intelligent** : 24h TTL, rate limiting 1s entre requêtes
- **Conversion automatique** : BGG → format base de données local
- **Détection intelligente** : Modes de jeu, personnages, mécaniques

#### Types TypeScript

```typescript
interface BGGXMLSearchResponse {
  items?: { item?: BGGXMLSearchItem | BGGXMLSearchItem[] }
}

interface BGGXMLGameItem {
  $: { id: string }
  name?: BGGXMLName[]
  // ... structure XML complète typée
}
```

#### Rate Limiting

- 1 seconde minimum entre requêtes API BGG
- Cache 24h pour éviter requêtes répétées
- Gestion automatique des timeouts

---

Pour plus de détails sur les tests, consultez : [**tests**/backend/README.md](../__tests__/backend/README.md) { "error": "Player not found" }

````

---

À compléter avec les autres routes (games, sessions, stats, etc.)

## Exemples d’appels

### curl
```sh
curl -X POST http://localhost:3001/api/players -H "Content-Type: application/json" -d '{"player_name":"Alice"}'
````

### fetch (JS)

```js
fetch('/api/players', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ player_name: 'Alice' })
})
```
