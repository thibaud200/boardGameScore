## Jeux

### GET /api/games
- Liste tous les jeux
- 200: tableau de jeux

### GET /api/games/:id
- Récupère un jeu par id
- 200: jeu
- 404: jeu non trouvé

### POST /api/games
- Crée un jeu
- Body: `{ ... }`
- 201: jeu créé
- 400: erreur de validation

### DELETE /api/games/:id
- Supprime un jeu
- 204: succès

## Sessions de jeu

### GET /api/game-sessions
- Liste toutes les sessions
- 200: tableau de sessions

### GET /api/game-sessions/:id
- Récupère une session par id
- 200: session
- 404: session non trouvée

### POST /api/game-sessions
- Crée une session
- Body: `{ ... }`
- 201: session créée
- 400: erreur de validation

### DELETE /api/game-sessions/:id
- Supprime une session
- 204: succès

## Personnages de jeu

### GET /api/game-characters
- Liste tous les personnages
- 200: tableau de personnages

### GET /api/game-characters/:id
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
    "error": "Player not found"
  }
  ```

---

À compléter avec les autres routes (games, sessions, stats, etc.)

## Exemples d’appels

### curl
```sh
curl -X POST http://localhost:3001/api/players -H "Content-Type: application/json" -d '{"player_name":"Alice"}'
```

### fetch (JS)
```js
fetch('/api/players', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ player_name: 'Alice' })
})
```
