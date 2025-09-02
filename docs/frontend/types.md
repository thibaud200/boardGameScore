# 🔧 Types TypeScript Frontend

## 📋 Vue d'ensemble

Cette documentation détaille tous les types et interfaces TypeScript utilisés côté frontend, leurs relations et les bonnes pratiques de typage dans le projet.

---

## 🎮 Types des Jeux (game.types.ts)

### Localisation

`src/types/game.types.ts`

### Interface Game (Complète)

```typescript
export interface Game {
  game_id: number // Clé primaire auto-incrémentée
  game_id_bgg?: string // ID BoardGameGeek (optionnel)
  game_name: string // Nom du jeu (obligatoire)
  game_description?: string // Description (optionnelle)
  game_image?: string // URL image (optionnelle)
  has_characters: boolean // Si le jeu a des personnages
  characters?: string // JSON des personnages (optionnel)
  min_players?: number // Nombre minimum de joueurs
  max_players?: number // Nombre maximum de joueurs
  supports_cooperative?: boolean // Support mode coopératif
  supports_competitive?: boolean // Support mode compétitif
  supports_campaign?: boolean // Support mode campagne
  default_mode?: string // Mode par défaut
  created_at: string // Timestamp création (ISO)
}
```

### Interface CreateGameRequest

```typescript
export interface CreateGameRequest {
  game_id_bgg?: string // ID BGG (pré-rempli si import BGG)
  game_name: string // Obligatoire
  game_description?: string // ⚠️ Types hybrides : undefined | null
  game_image?: string // ⚠️ Types hybrides : undefined | null
  has_characters: boolean // ⚠️ Conversion SQLite : boolean → 0|1
  characters?: string // JSON optionnel
  min_players?: number // Optionnel (défaut 1)
  max_players?: number // Optionnel (défaut 4)
  supports_cooperative?: boolean // ⚠️ Conversion SQLite : boolean → 0|1
  supports_competitive?: boolean // ⚠️ Conversion SQLite : boolean → 0|1
  supports_campaign?: boolean // ⚠️ Conversion SQLite : boolean → 0|1
  default_mode?: string // 'competitive' | 'cooperative' | 'campaign'
}
```

### Interface UpdateGameRequest

```typescript
export interface UpdateGameRequest {
  game_id_bgg?: string // Tous les champs optionnels
  game_name?: string // pour mise à jour partielle
  game_description?: string
  game_image?: string
  has_characters?: boolean
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

## 👥 Types des Joueurs (player.types.ts)

### Interface Player (Complète)

```typescript
export interface Player {
  player_id: number // Clé primaire auto-incrémentée
  player_name: string // Nom unique du joueur
  created_at: string // Timestamp création (ISO format)
}
```

### Interface CreatePlayerRequest

```typescript
export interface CreatePlayerRequest {
  player_name: string // Seul champ obligatoire
}
```

### Interface UpdatePlayerRequest

```typescript
export interface UpdatePlayerRequest {
  player_name?: string // Optionnel pour mise à jour partielle
}
```

---

## 🌐 Types BoardGameGeek (bgg.types.ts)

### Localisation

`src/types/bgg.types.ts`

### Interface BGGGame (Base)

```typescript
export interface BGGGame {
  id: string // ID BGG (toujours string)
  name: string // Nom du jeu
  yearPublished?: number // Année de publication
  minPlayers?: number // Joueurs minimum
  maxPlayers?: number // Joueurs maximum
  playingTime?: number // Temps de jeu moyen (minutes)
  minPlayingTime?: number // Temps minimum
  maxPlayingTime?: number // Temps maximum
  age?: number // Âge minimum
  description?: string // Description HTML
  image?: string // URL image haute résolution
  thumbnail?: string // URL thumbnail
  complexity?: number // Complexité (0-5)
  rating?: number // Note BGG (0-10)
  categories?: string[] // Catégories de jeu
  mechanics?: string[] // Mécaniques de jeu
  families?: string[] // Familles de jeu
}
```

### Interface BGGSearchResult

```typescript
export interface BGGSearchResult {
  id: string // ID pour requêtes détails
  name: string // Nom affiché dans résultats
  yearPublished?: number // Année pour disambiguation
}
```

### Interface BGGGameDetails (Enrichie)

```typescript
export interface BGGGameDetails extends BGGGame {
  expansions?: BGGExpansion[] // Liste des extensions
  designers?: string[] // Créateurs du jeu
  artists?: string[] // Artistes
  publishers?: string[] // Éditeurs
}
```

### Interface BGGExpansion

```typescript
export interface BGGExpansion {
  id: string // ID de l'extension
  name: string // Nom de l'extension
  yearPublished?: number // Année de publication
}
```

### Interface BGGToGameConversion

```typescript
export interface BGGToGameConversion {
  game_id_bgg: string // Mapping des types BGG
  game_name: string // vers format local
  game_description?: string
  game_image?: string
  has_characters: boolean // Détection automatique
  min_players?: number
  max_players?: number
  supports_cooperative?: boolean // Détection via mechanics
  supports_competitive?: boolean
  supports_campaign?: boolean // Détection via mechanics/families
  default_mode: string
}
```

### Interface BGGCacheEntry

```typescript
export interface BGGCacheEntry {
  id: string // ID du jeu en cache
  data: BGGGameDetails // Données complètes
  cachedAt: number // Timestamp cache
  expiresAt: number // Expiration (24h TTL)
}
```

---

## 🎯 Types de Sessions de Jeu

### Interface GameSession (Future)

```typescript
export interface GameSession {
  sessions_id: number
  sessions_game_id: number
  is_cooperative: boolean
  sessions_game_mode: 'competitive' | 'cooperative' | 'campaign'
  sessions_players: string // JSON array player IDs
  sessions_scores: string // JSON object scores
  sessions_characters?: string // JSON object character assignments
  sessions_extensions?: string // JSON array extension IDs
  sessions_winner?: number // Player ID (si compétitif)
  win_condition?: string
  sessions_date: string // ISO date
  sessions_duration?: string // Durée en minutes
  sessions_completed: boolean
  sessions_coop_result?: 'won' | 'lost' // Résultat coopératif
  created_at: string
}
```

---

## 🔄 Types Hybrides et Conversions

### Problématique JavaScript ↔ SQLite

#### Types Booléens

```typescript
// Frontend React : boolean
interface FormData {
  has_characters: boolean // true/false
  supports_cooperative: boolean
}

// Backend SQLite : integer
interface SQLiteData {
  has_characters: 0 | 1 // Conversion nécessaire
  supports_cooperative: 0 | 1
}

// Solution : Types hybrides
interface CreateGameRequest {
  has_characters: boolean // Frontend garde boolean
  // Backend fait la conversion : boolean ? 1 : 0
}
```

#### Types Null/Undefined

```typescript
// React inputs : ne supportent pas null
<input value={formData.game_description || ''} />

// SQLite : ne supporte pas undefined
interface SQLiteCompatible {
  game_description: string | null   // null accepté, undefined non
}

// Solution : Types optionnels avec conversion
interface CreateGameRequest {
  game_description?: string         // undefined en frontend
  // Backend conversion : value || null
}
```

### Patterns de Conversion

#### Frontend → Backend

```typescript
const cleanForBackend = (formData: FormData): CreateGameRequest => ({
  game_name: formData.game_name,
  game_description: formData.game_description || null,
  has_characters: formData.has_characters, // Backend convertira
  supports_cooperative: formData.supports_cooperative ?? false
})
```

#### Backend → Frontend

```typescript
const adaptForFrontend = (game: Game): DisplayGame => ({
  ...game,
  game_description: game.game_description || '', // null → empty string
  has_characters: Boolean(game.has_characters) // 0/1 → boolean
})
```

---

## 🛠️ Utilitaires de Types

### Type Guards

```typescript
// Vérification types runtime
export const isPlayer = (obj: any): obj is Player => {
  return (
    typeof obj === 'object' &&
    typeof obj.player_id === 'number' &&
    typeof obj.player_name === 'string'
  )
}

export const isGame = (obj: any): obj is Game => {
  return (
    typeof obj === 'object' &&
    typeof obj.game_id === 'number' &&
    typeof obj.game_name === 'string' &&
    typeof obj.has_characters === 'boolean'
  )
}
```

### Types Dérivés

```typescript
// Création de types à partir d'existants
export type GameBasicInfo = Pick<
  Game,
  'game_id' | 'game_name' | 'min_players' | 'max_players'
>
export type PlayerBasicInfo = Pick<Player, 'player_id' | 'player_name'>

// Types pour formulaires
export type GameFormData = Omit<CreateGameRequest, 'game_id_bgg'> & {
  game_id_bgg?: string
}

// Types pour affichage
export type GameDisplayData = Game & {
  player_count?: number // Calculé côté frontend
  last_played?: string // Calculé côté frontend
}
```

### Union Types

```typescript
// Modes de jeu
export type GameMode = 'competitive' | 'cooperative' | 'campaign'

// États de session
export type SessionStatus = 'setup' | 'playing' | 'completed' | 'abandoned'

// Types d'erreurs API
export type ApiErrorType = 'network' | 'validation' | 'server' | 'not_found'
```

---

## 📦 Organisation des Types

### Structure des fichiers

```
src/types/
├── index.ts              # Exports principaux
├── game.types.ts         # Types jeux
├── player.types.ts       # Types joueurs
├── session.types.ts      # Types sessions (future)
├── bgg.types.ts         # Types BoardGameGeek
├── api.types.ts         # Types API génériques
└── ui.types.ts          # Types composants UI
```

### Index.ts (Exports centralisés)

```typescript
// Export des types principaux
export type { Game, CreateGameRequest, UpdateGameRequest } from './game.types'
export type {
  Player,
  CreatePlayerRequest,
  UpdatePlayerRequest
} from './player.types'
export type { BGGGame, BGGGameDetails, BGGSearchResult } from './bgg.types'

// Export des utilitaires
export { isPlayer, isGame } from './type-guards'
export type { GameMode, SessionStatus, ApiErrorType } from './common.types'
```

---

## 🧪 Tests des Types

### Type Testing

```typescript
// test-types.ts (compilation checks)
import type { Game, CreateGameRequest } from './game.types'

// Vérification compatibilité types
const testGame: Game = {
  game_id: 1,
  game_name: 'Test Game',
  has_characters: true,
  created_at: new Date().toISOString()
}

const testCreateRequest: CreateGameRequest = {
  game_name: 'New Game',
  has_characters: false
}

// TypeScript vérifie automatiquement la cohérence
```

---

## 🚧 Évolutions Futures

### Améliorations prévues

- **Schemas Zod** : Validation runtime + types TypeScript
- **Generated types** : Depuis OpenAPI backend
- **Strict nullability** : Distinction claire null vs undefined
- **Branded types** : IDs typés (GameId, PlayerId)

### Exemple Zod (futur)

```typescript
import { z } from 'zod'

const GameSchema = z.object({
  game_id: z.number(),
  game_name: z.string().min(1),
  has_characters: z.boolean(),
  min_players: z.number().min(1).optional(),
  max_players: z.number().max(10).optional()
})

export type Game = z.infer<typeof GameSchema>
```

---

_Documentation des types maintenue en synchronisation avec l'évolution du backend et des besoins frontend._
