# 🧩 Documentation des Composants Frontend

## 📋 Vue d'ensemble

Cette documentation détaille tous les composants React développés dans le projet Board Game Score Tracker, leurs props, leur utilisation et leurs responsabilités.

---

## 🔍 BGGSearch Component

### Localisation

`src/components/BGGSearch.tsx`

### Description

Composant d'intégration BoardGameGeek permettant la recherche et l'import automatique de jeux depuis l'API BGG. Utilisé dans le formulaire de création/modification de jeux.

### Props

```typescript
interface BGGSearchProps {
  onImport: (gameData: CreateGameRequest) => void // Callback pour pré-remplir le formulaire parent
}
```

### Fonctionnalités

- **Recherche temps réel** : API BGG search avec gestion d'erreurs
- **Détails enrichis** : Affichage complet (image, description, mécaniques, catégories)
- **Import intelligent** : Conversion automatique BGG → format local
- **UX optimisée** : Interface conditionnelle, feedback utilisateur
- **Rate limiting** : Respect des limitations API BGG

### États internes

```typescript
const [query, setQuery] = useState('') // Requête de recherche
const [searchResults, setSearchResults] = useState<BGGSearchResult[]>([]) // Résultats
const [selectedGame, setSelectedGame] = useState<BGGGameDetails | null>(null) // Jeu sélectionné
const [loading, setLoading] = useState(false) // État de chargement
const [importing, setImporting] = useState(false) // État d'import
const [error, setError] = useState<string | null>(null) // Gestion d'erreurs
```

### Méthodes principales

- `handleSearch()` : Recherche sur BGG
- `handleViewDetails()` : Récupération détails jeu
- `handleImport()` : Conversion et callback vers parent

### Conversion BGG → Local

```typescript
const gameData: CreateGameRequest = {
  game_id_bgg: gameId,
  game_name: gameDetails.name,
  game_description: gameDetails.description || '',
  game_image: gameDetails.image || '',
  has_characters:
    gameDetails.categories?.some(
      (cat) =>
        cat.toLowerCase().includes('character') ||
        cat.toLowerCase().includes('role playing')
    ) || false,
  supports_cooperative:
    gameDetails.mechanics?.some(
      (mech) =>
        mech.toLowerCase().includes('cooperative') ||
        mech.toLowerCase().includes('co-op')
    ) || false,
  supports_campaign:
    gameDetails.mechanics?.some(
      (mech) =>
        mech.toLowerCase().includes('campaign') ||
        mech.toLowerCase().includes('legacy')
    ) || false,
  default_mode: 'competitive' as const
}
```

### Utilisation

```tsx
<BGGSearch onImport={handleBGGImport} />
```

---

## 📄 Pages CRUD

### 👥 Players.tsx

#### Localisation

`src/pages/Players.tsx`

#### Description

Page complète de gestion des joueurs avec opérations CRUD, validation et feedback utilisateur.

#### Fonctionnalités

- **Liste responsive** : Tableau avec pagination potentielle
- **Création inline** : Formulaire intégré avec validation
- **Édition in-place** : Modification directe dans le tableau
- **Suppression confirmée** : Dialog de confirmation
- **Feedback temps réel** : États loading/error/success

#### États principaux

```typescript
const [players, setPlayers] = useState<Player[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const [isCreating, setIsCreating] = useState(false)
const [editingPlayer, setEditingPlayer] = useState<EditingPlayer | null>(null)
```

#### Actions CRUD

- `loadPlayers()` : Chargement initial
- `handleCreatePlayer()` : Création avec validation
- `handleUpdatePlayer()` : Mise à jour
- `handleDeletePlayer()` : Suppression avec confirmation

### 🎮 Games.tsx

#### Localisation

`src/pages/Games.tsx`

#### Description

Page de gestion des jeux avec intégration BGG, formulaires complexes et gestion des modes multi-jeux.

#### Fonctionnalités avancées

- **Intégration BGG** : Composant BGGSearch intégré
- **Formulaire complexe** : Modes de jeu, personnages, validation
- **Types hybrides** : Gestion JavaScript ↔ SQLite
- **UX optimisée** : Feedback BGG import, états conditionnels

#### Gestion des données

```typescript
// Nettoyage avant envoi API (SQLite compatibility)
const cleanedData: CreateGameRequest = {
  game_id_bgg: formData.game_id_bgg || null,
  game_name: formData.game_name,
  game_description: formData.game_description || null,
  has_characters: formData.has_characters,
  supports_cooperative:
    formData.supports_cooperative !== undefined
      ? formData.supports_cooperative
      : false
  // ... autres champs
}
```

#### Workflow BGG

```typescript
const handleBGGImport = (gameData: CreateGameRequest) => {
  setFormData(gameData) // Pré-remplir le formulaire
  setBggImported(true) // Afficher feedback utilisateur
}
```

---

## 🎨 Composants UI de Base

### Conventions de Style

- **Tailwind CSS 4** : Classes utilitaires modernes
- **États hover** : Transitions smooth
- **Responsive design** : Mobile-first approach
- **Accessibilité** : Focus states, contraste approprié

### Patterns communs

```tsx
// Bouton primaire standard
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">

// Champ input standard
<input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

// Alert success
<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">

// Alert error
<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
```

---

## 🔧 Bonnes Pratiques Appliquées

### Gestion d'État

- **État local** : useState pour données temporaires
- **Effet de bord** : useEffect pour chargements initiaux
- **Callbacks** : Props functions pour communication parent-enfant

### Validation

- **Frontend** : Validation temps réel avec feedback immédiat
- **Backend** : Validation serveur en backup
- **Types** : TypeScript strict pour prévention d'erreurs

### Performance

- **Éviter re-renders** : Callbacks memoizés si nécessaire
- **Chargement asynchrone** : États loading appropriés
- **Gestion mémoire** : Cleanup des états en unmount

### Accessibilité

- **Semantic HTML** : Utilisation appropriée des balises
- **Focus management** : autoFocus sur formulaires
- **Screen readers** : Labels appropriés

---

## 🚧 Améliorations Futures

### Court Terme

- **Tests composants** : React Testing Library
- **Storybook** : Documentation interactive
- **Validation avancée** : Schémas Zod/Yup

### Moyen Terme

- **Design System** : Composants atomiques réutilisables
- **State Management** : Context API ou Zustand si nécessaire
- **Internationalisation** : Support multi-langues

---

## 🧩 Players Page Component - Documentation (Septembre 2025)

- Page CRUD complète : création, édition, suppression, validation stricte
- UX enrichie : feedback instantané, preview avatar/couleur, gestion erreurs API
- Props et états documentés, typage strict
- Accessibilité : labels reliés aux inputs
- Tests unitaires et d'interaction exhaustifs

---

_Documentation maintenue à jour avec le développement des composants._
