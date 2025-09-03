# 🌐 Documentation des Services Frontend

## 📋 Vue d'ensemble

Cette documentation détaille tous les services côté frontend pour l'accès aux APIs, la gestion des données et l'intégration avec des services externes.

---

## 🔌 API Client de Base

### Localisation

`src/services/apiClient.ts`

### Description

Client HTTP centralisé basé sur `fetch` avec gestion d'erreurs, types TypeScript et configuration unifiée.

### Configuration

```typescript
const BASE_URL = 'http://localhost:3001/api'

class ApiClient {
  private baseURL: string

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }
  // ... autres méthodes
}
```

### Avantages

- **Types génériques** : Sécurité TypeScript
- **Gestion d'erreurs** : Unified error handling
- **Configuration centralisée** : Base URL, headers communs
- **Extensibilité** : Ajout facile de middleware (auth, logging)

---

## 🎮 BGGService - Intégration BoardGameGeek

### Localisation

`src/services/BGGService.ts`

### Description

Service spécialisé pour l'intégration avec l'API BoardGameGeek, incluant recherche, détails de jeux et import automatique.

### Méthodes disponibles

#### 🔍 Recherche de jeux

```typescript
static async searchGames(query: string): Promise<BGGSearchResult[]>
```

- **Paramètres** : Requête de recherche (string)
- **Retour** : Liste des résultats avec id, nom, année
- **Usage** : Auto-complétion, recherche utilisateur

#### 📝 Détails de jeu

```typescript
static async getGameDetails(gameId: string): Promise<BGGGameDetails>
```

- **Paramètres** : ID du jeu BGG
- **Retour** : Détails complets (description, mécaniques, catégories, stats)
- **Usage** : Affichage enrichi, conversion pour import

#### 📥 Import de jeu

```typescript
static async importGame(gameId: string): Promise<Game>
```

- **Paramètres** : ID du jeu BGG
- **Retour** : Jeu créé dans notre base de données
- **Usage** : Import direct (alternative au pré-remplissage)

### Types BGG

#### BGGSearchResult

```typescript
interface BGGSearchResult {
  id: string
  name: string
  yearPublished?: number
}
```

#### BGGGameDetails

```typescript
interface BGGGameDetails extends BGGGame {
  expansions?: BGGExpansion[]
  designers?: string[]
  artists?: string[]
  publishers?: string[]
}
```

### Gestion d'erreurs BGG

- **Rate limiting** : Respect des limites API BGG
- **Timeouts** : Gestion des délais de réponse
- **XML parsing** : Validation des réponses XML
- **Cache côté backend** : Éviter requêtes répétées

---

## 👥 PlayersService - Gestion des Joueurs

### Localisation

`src/services/playersService.ts`

### Description

Service CRUD complet pour la gestion des joueurs avec validation et types TypeScript stricts.

### Méthodes CRUD

#### Récupération

```typescript
static async getAllPlayers(): Promise<Player[]>
static async getPlayerById(id: number): Promise<Player>
```

#### Création

```typescript
static async createPlayer(data: CreatePlayerRequest): Promise<Player>
```

- **Validation** : Nom obligatoire, unicité
- **Retour** : Joueur créé avec ID généré

#### Mise à jour

```typescript
static async updatePlayer(id: number, data: UpdatePlayerRequest): Promise<Player>
```

- **Validation** : Nom optionnel mais unique si fourni
- **Retour** : Joueur mis à jour

#### Suppression

```typescript
static async deletePlayer(id: number): Promise<void>
```

- **Vérifications** : Contraintes FK avec sessions

### Types Players

#### Player

```typescript
interface Player {
  player_id: number
  player_name: string
  created_at: string
}
```

#### CreatePlayerRequest

```typescript
interface CreatePlayerRequest {
  player_name: string
}
```

#### UpdatePlayerRequest

```typescript
interface UpdatePlayerRequest {
  player_name?: string
}
```

---

## 🎮 PlayersService - Documentation et Bonnes Pratiques (Septembre 2025)

- Service strictement typé, aucun `any` utilisé
- Méthodes CRUD : getAllPlayers, createPlayer, updatePlayer, deletePlayer
- Validation et gestion d'erreurs intégrées
- Utilisé dans la page Players et les tests
- Mock complet pour les tests unitaires
- Respect des standards CONTEXT.md

---

## 🎲 GamesService - Gestion des Jeux

### Localisation

`src/services/gamesService.ts`

### Description

Service CRUD pour les jeux avec support BGG, modes multi-jeux et validation complexe.

### Méthodes principales

#### Récupération

```typescript
static async getAllGames(): Promise<Game[]>
static async getGameById(id: number): Promise<Game>
```

#### Création avec BGG

```typescript
static async createGame(data: CreateGameRequest): Promise<Game>
```

- **Support BGG** : Intégration des données BoardGameGeek
- **Validation** : Modes de jeu, joueurs min/max
- **Types hybrides** : Gestion JavaScript ↔ SQLite

#### Mise à jour

```typescript
static async updateGame(id: number, data: UpdateGameRequest): Promise<Game>
```

- **Mise à jour partielle** : Seuls les champs fournis
- **Préservation** : Données existantes non écrasées

### Gestion des Types Hybrides

#### Problématique JavaScript ↔ SQLite

```typescript
// ❌ Problème : types JavaScript incompatibles SQLite
const gameData = {
  has_characters: true, // boolean → erreur SQLite
  game_description: undefined // undefined → erreur SQLite
}

// ✅ Solution : nettoyage avant envoi
const cleanedData: CreateGameRequest = {
  has_characters: formData.has_characters, // boolean → backend convertira en 0/1
  game_description: formData.game_description || null // undefined → null
}
```

#### Types Game

##### Game (complet)

```typescript
interface Game {
  game_id: number
  game_id_bgg?: string
  game_name: string
  game_description?: string
  game_image?: string
  has_characters: boolean
  characters?: string // JSON string
  min_players?: number
  max_players?: number
  supports_cooperative?: boolean
  supports_competitive?: boolean
  supports_campaign?: boolean
  default_mode?: string
  created_at: string
}
```

##### CreateGameRequest

```typescript
interface CreateGameRequest {
  game_id_bgg?: string
  game_name: string
  game_description?: string
  game_image?: string
  has_characters: boolean
  characters?: string
  min_players?: number
  max_players?: number
  supports_cooperative?: boolean
  supports_competitive?: boolean
  supports_campaign?: boolean
  default_mode?: string
}
```

---

## 🔄 Patterns de Service

### Gestion d'erreurs unifiée

```typescript
try {
  const data = await apiClient.get<Player[]>('/players')
  return data
} catch (error) {
  console.error('Error loading players:', error)
  throw new Error('Failed to load players')
}
```

### Validation TypeScript

```typescript
// Types stricts pour prévenir les erreurs
const createPlayer = async (data: CreatePlayerRequest): Promise<Player> => {
  // TypeScript vérifie automatiquement que data.player_name existe
  return apiClient.post<Player>('/players', data)
}
```

### Cache et optimisations

```typescript
// Cache simple côté client (future amélioration)
class CacheableService {
  private cache = new Map<string, { data: any; timestamp: number }>()

  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      // 5 min
      return cached.data
    }

    const data = await fetcher()
    this.cache.set(key, { data, timestamp: Date.now() })
    return data
  }
}
```

---

## 🛠️ Configuration et Variables

### Variables d'environnement

```typescript
// vite.config.ts ou .env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
```

### Configuration par environnement

```typescript
const config = {
  development: {
    apiUrl: 'http://localhost:3001/api',
    timeout: 10000
  },
  production: {
    apiUrl: '/api',
    timeout: 5000
  }
}
```

---

## 🧪 Tests des Services

### Structure de test

```typescript
// playersService.test.ts
describe('PlayersService', () => {
  beforeEach(() => {
    // Mock API client
  })

  describe('getAllPlayers', () => {
    it('should return list of players', async () => {
      // Arrange
      const mockPlayers = [{ player_id: 1, player_name: 'Alice' }]

      // Act
      const result = await PlayersService.getAllPlayers()

      // Assert
      expect(result).toEqual(mockPlayers)
    })
  })
})
```

---

## 🚧 Améliorations Futures

### Court Terme

- **Cache intelligent** : Invalidation sélective
- **Offline support** : Service Worker pour PWA
- **Batch operations** : Requêtes groupées

### Moyen Terme

- **GraphQL** : Alternative à REST pour optimisation
- **WebSocket** : Temps réel pour sessions collaboratives
- **Background sync** : Synchronisation en arrière-plan

### Long Terme

- **State management** : Redux/Zustand pour cache global
- **Optimistic updates** : UX améliorée
- **Real-time collaboration** : Sessions multi-joueurs

---

_Documentation des services maintenue à jour avec l'évolution de l'API._
