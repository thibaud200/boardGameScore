# 🛠️ Guide de Développement - Board Game Score Tracker

## 🎯 Objectif

Ce guide fournit les bonnes pratiques et conventions spécifiques au projet pour maintenir la cohérence et éviter les erreurs communes.

---

## � Qualité Code et Linting

### ✅ Standards Obligatoires

- **ESLint 0 erreur** : Aucune erreur tolérée en développement
- **Pre-commit hooks** : Validation automatique avant chaque commit
- **CI/CD** : Vérification automatique sur chaque PR

### 📋 Configuration détaillée

Consultez la documentation complète : **[LINTING.md](LINTING.md)**

### 🛠️ Commands utiles

```bash
# Vérification complète
npm run lint

# Correction automatique
npm run lint:fix

# Linting ciblé
npm run lint:frontend
npm run lint:backend
```

---

## �🔄 Gestion des Types JavaScript ↔ SQLite

### 🚨 Problématiques Critiques

#### 1. Booléens JavaScript → SQLite

**Problème** : SQLite ne supporte pas les booléens natifs JavaScript.

```typescript
// ❌ ERREUR - Provoque "SQLite3 can only bind numbers, strings, bigints, buffers, and null"
const stmt = db.prepare('INSERT INTO games (has_characters) VALUES (?)')
stmt.run(true) // TypeError!

// ✅ SOLUTION - Conversion explicite
stmt.run(data.has_characters ? 1 : 0) // Correct
```

**Application dans le projet** :
```typescript
// backend/src/services/gameService.ts
const info = stmt.run(
  data.game_id_bgg ?? null,
  data.game_name,
  data.game_description ?? null,
  data.game_image ?? null,
  data.has_characters ? 1 : 0,              // ✅ Conversion booléen
  data.characters ?? null,
  data.min_players ?? null,
  data.max_players ?? null,
  data.supports_cooperative ? 1 : 0,        // ✅ Conversion booléen
  data.supports_competitive ? 1 : 0,        // ✅ Conversion booléen
  data.supports_campaign ? 1 : 0,           // ✅ Conversion booléen
  data.default_mode ?? null
)
```

#### 2. Valeurs undefined → SQLite

**Problème** : SQLite accepte `null` mais pas `undefined`.

```typescript
// ❌ ERREUR
stmt.run(data.game_description) // undefined → erreur SQLite

// ✅ SOLUTION
stmt.run(data.game_description ?? null) // undefined → null
```

#### 3. Types TypeScript Hybrides

**Problème** : Gérer les différences entre frontend (undefined) et backend (null).

```typescript
// ✅ Types hybrides supportant les deux
export interface CreateGameRequest {
  game_id_bgg?: string | null
  game_name: string
  game_description?: string | null
  game_image?: string | null
  has_characters: boolean
  characters?: string | null
  min_players?: number | null
  max_players?: number | null
  supports_cooperative?: boolean | null
  supports_competitive?: boolean | null
  supports_campaign?: boolean | null
  default_mode?: string | null
}
```

---

## 🖥️ Frontend React - Bonnes Pratiques

### Formulaires et Inputs

#### Gestion des valeurs null dans React

```typescript
// ❌ ERREUR - React n'accepte pas null comme valeur
<input value={formData.game_description} />  // Peut être null

// ✅ SOLUTION - Valeur par défaut
<input value={formData.game_description || ''} />
```

#### Checkboxes avec valeurs optionnelles

```typescript
// ❌ ERREUR - undefined/null non supporté
<input 
  type="checkbox" 
  checked={formData.supports_cooperative} 
/>

// ✅ SOLUTION - Valeur par défaut booléenne
<input 
  type="checkbox" 
  checked={formData.supports_cooperative || false} 
/>
```

#### Select avec valeurs optionnelles

```typescript
// ✅ Select avec valeur par défaut
<select value={formData.default_mode || 'competitive'}>
  <option value="competitive">Compétitif</option>
  <option value="cooperative">Coopératif</option>
  <option value="campaign">Campagne</option>
</select>
```

### Nettoyage des données avant envoi API

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // ✅ Nettoyage systématique avant envoi
  const cleanedData: CreateGameRequest = {
    game_id_bgg: formData.game_id_bgg || null,
    game_name: formData.game_name,
    game_description: formData.game_description || null,
    game_image: formData.game_image || null,
    has_characters: formData.has_characters,
    characters: formData.characters || null,
    min_players: formData.min_players || 1,
    max_players: formData.max_players || 4,
    supports_cooperative: formData.supports_cooperative !== undefined ? formData.supports_cooperative : false,
    supports_competitive: formData.supports_competitive !== undefined ? formData.supports_competitive : true,
    supports_campaign: formData.supports_campaign !== undefined ? formData.supports_campaign : false,
    default_mode: formData.default_mode || 'competitive'
  }
  
  await GamesService.createGame(cleanedData)
}
```

---

## 🔧 Backend Express - Bonnes Pratiques

### Services de Base de Données

#### Pattern de conversion systématique

```typescript
export function createGame(data: CreateGameRequest) {
  const stmt = db.prepare(`INSERT INTO games (
    game_id_bgg, game_name, game_description, game_image, 
    has_characters, characters, min_players, max_players, 
    supports_cooperative, supports_competitive, supports_campaign, default_mode
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  
  const info = stmt.run(
    data.game_id_bgg ?? null,           // string? → string|null
    data.game_name,                     // string → string
    data.game_description ?? null,      // string? → string|null
    data.game_image ?? null,            // string? → string|null
    data.has_characters ? 1 : 0,        // boolean → integer (0|1)
    data.characters ?? null,            // string? → string|null
    data.min_players ?? null,           // number? → number|null
    data.max_players ?? null,           // number? → number|null
    data.supports_cooperative ? 1 : 0,  // boolean? → integer (0|1)
    data.supports_competitive ? 1 : 0,  // boolean? → integer (0|1)
    data.supports_campaign ? 1 : 0,     // boolean? → integer (0|1)
    data.default_mode ?? null           // string? → string|null
  )
  
  return getGameById(info.lastInsertRowid as number)
}
```

#### Routes API avec validation

```typescript
app.put('/api/games/:id', (req, res) => {
  try {
    const gameId = Number(req.params.id)
    
    // Extraction avec destructuring
    const {
      game_id_bgg, game_name, game_description, game_image,
      has_characters, characters, min_players, max_players,
      supports_cooperative, supports_competitive, supports_campaign, default_mode
    } = req.body
    
    // Conversion avant requête SQLite
    const stmt = db.prepare(`UPDATE games SET 
      game_id_bgg = COALESCE(?, game_id_bgg),
      game_name = COALESCE(?, game_name),
      game_description = COALESCE(?, game_description),
      game_image = COALESCE(?, game_image),
      has_characters = COALESCE(?, has_characters),
      characters = COALESCE(?, characters),
      min_players = COALESCE(?, min_players),
      max_players = COALESCE(?, max_players),
      supports_cooperative = COALESCE(?, supports_cooperative),
      supports_competitive = COALESCE(?, supports_competitive),
      supports_campaign = COALESCE(?, supports_campaign),
      default_mode = COALESCE(?, default_mode)
    WHERE game_id = ?`)
    
    stmt.run(
      game_id_bgg,
      game_name,
      game_description,
      game_image,
      has_characters ? 1 : 0,        // ✅ Conversion booléen
      characters,
      min_players,
      max_players,
      supports_cooperative ? 1 : 0,  // ✅ Conversion booléen
      supports_competitive ? 1 : 0,  // ✅ Conversion booléen
      supports_campaign ? 1 : 0,     // ✅ Conversion booléen
      default_mode,
      gameId
    )
    
    const updated = db.prepare('SELECT * FROM games WHERE game_id = ?').get(gameId)
    res.json(updated)
  } catch (e) {
    res.status(400).json({ error: 'Update failed', details: String(e) })
  }
})
```

---

## ✅ Checklist de Développement

### Avant d'ajouter une nouvelle fonctionnalité CRUD :

- [ ] **Types TypeScript** : Propriétés optionnelles avec `| null`
- [ ] **Frontend React** : Valeurs par défaut dans tous les inputs (`|| ''`, `|| false`)
- [ ] **Backend Services** : Conversion booléens → entiers (`? 1 : 0`)
- [ ] **Backend Services** : Conversion undefined → null (`?? null`)
- [ ] **Routes API** : Gestion d'erreurs avec détails explicites
- [ ] **Tests** : Vérification des conversions de types

### Erreurs communes à éviter :

- ❌ Envoyer des booléens JavaScript à SQLite
- ❌ Utiliser `undefined` au lieu de `null` pour SQLite
- ❌ Valeurs null/undefined dans les inputs React
- ❌ Oublier les valeurs par défaut dans les checkboxes
- ❌ Ne pas nettoyer les données avant envoi API

---

## 🔍 Debugging

### Erreurs SQLite communes

```bash
# Erreur typique
"SQLite3 can only bind numbers, strings, bigints, buffers, and null"

# Causes possibles :
1. Booléen JavaScript envoyé directement
2. Valeur undefined au lieu de null
3. Object/Array non sérialisé en JSON
```

### Debugging des types

```typescript
// Ajout de logs pour debugging
console.log('Data avant envoi SQLite:', {
  has_characters: typeof data.has_characters, // Doit être "boolean"
  converted: data.has_characters ? 1 : 0,     // Doit être 0 ou 1
  description: data.game_description ?? null   // Doit être string ou null
})
```

---

*Ce guide doit être consulté pour toute modification impliquant la base de données ou les formulaires React.*
