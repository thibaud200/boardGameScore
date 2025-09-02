# 🏗️ Architecture & État Technique - Board Game Score Tracker

Ce document consolide les principes architecturaux, l'état technique actuel et les configurations du projet pour une vision complète du système.

---

## 🎯 PRINCIPES SOLID

### **S** - Single Responsibility Principle (SRP)

**"Une classe ne devrait avoir qu'une seule raison de changer"**

#### ✅ Application dans le projet

- **Services backend** : Chaque service gère une seule entité
  - `playerService.ts` → Gestion des joueurs uniquement
  - `gameService.ts` → Gestion des jeux uniquement
  - `gameSessionService.ts` → Gestion des sessions uniquement
- **Composants React** : Responsabilité unique et claire
  - `PlayerForm` → Formulaire joueur uniquement
  - `GameCard` → Affichage carte jeu uniquement

#### 🚫 Anti-patterns à éviter

```typescript
// ❌ Mauvais : Service avec multiples responsabilités
class GamePlayerSessionService {
  createPlayer() { /* ... */ }
  updateGame() { /* ... */ }
  calculateStats() { /* ... */ }
  sendEmail() { /* ... */ }
}

// ✅ Bon : Services spécialisés
class PlayerService {
  createPlayer() { /* ... */ }
  updatePlayer() { /* ... */ }
}
```

### **O** - Open/Closed Principle (OCP)

**"Ouvert à l'extension, fermé à la modification"**

#### ✅ Application dans le projet

- **Architecture modulaire** : Nouveaux services ajoutables sans modification
- **Types TypeScript extensibles** : Interfaces permettant l'extension
- **API REST** : Nouveaux endpoints sans casser l'existant

#### 📝 Exemple concret

```typescript
// ✅ Interface extensible
interface BaseGameData {
  id: number
  name: string
}

// Extension sans modification de la base
interface BGGGameData extends BaseGameData {
  bggId: number
  rating: number
  complexity: number
}
```

### **L** - Liskov Substitution Principle (LSP)

**"Les sous-classes doivent pouvoir remplacer leurs classes parentes"**

#### ✅ Application dans le projet

- **Services cohérents** : Tous respectent le même contrat
- **Composants substituables** : Props interfaces cohérentes
- **Réponses API uniformes** : Structure standardisée

#### 📝 Exemple concret

```typescript
// ✅ Contrat respecté par tous les services
interface Service<T> {
  getAll(): Promise<T[]>
  getById(id: number): Promise<T | null>
  create(data: Omit<T, 'id'>): Promise<T>
  update(id: number, data: Partial<T>): Promise<T>
  delete(id: number): Promise<boolean>
}

// Tous les services respectent ce contrat
class PlayerService implements Service<Player> { /* ... */ }
class GameService implements Service<Game> { /* ... */ }
```

### **I** - Interface Segregation Principle (ISP)

**"Ne pas forcer à dépendre d'interfaces non utilisées"**

#### ✅ Application dans le projet

- **Types spécialisés** : `Player`, `Game`, `GameSession` séparés
- **Props composants** : Interfaces minimales et ciblées
- **API endpoints** : Réponses adaptées au besoin

#### 📝 Exemple concret

```typescript
// ✅ Interfaces spécialisées
interface PlayerBasicInfo {
  id: number
  name: string
}

interface PlayerFullProfile extends PlayerBasicInfo {
  email?: string
  createdAt: string
  stats: PlayerStats
}

// Composants utilisent ce dont ils ont besoin
const PlayerCard = ({ player }: { player: PlayerBasicInfo }) => { /* ... */ }
const PlayerProfile = ({ player }: { player: PlayerFullProfile }) => { /* ... */ }
```

### **D** - Dependency Inversion Principle (DIP)

**"Dépendre d'abstractions, pas de concrétions"**

#### ✅ Application dans le projet

- **Services** : Dépendent de types TypeScript, pas d'implémentations
- **API client** : Abstraction HTTP générique
- **Base de données** : Abstraction via services

#### 📝 Exemple concret

```typescript
// ✅ Dépendance sur abstraction
interface DatabaseAdapter {
  query(sql: string, params: any[]): Promise<any[]>
}

class PlayerService {
  constructor(private db: DatabaseAdapter) {} // Abstraction

  async getAll(): Promise<Player[]> {
    return this.db.query('SELECT * FROM players', [])
  }
}
```

---

## 🎨 ARCHITECTURE FRONTEND

### 📁 Structure des composants

```
src/
├── components/
│   ├── ui/           # Composants réutilisables (boutons, inputs)
│   ├── features/     # Composants métier (PlayerForm, GameCard)
│   └── layout/       # Composants layout (Header, Navigation)
├── pages/            # Pages principales
├── services/         # Clients API
├── types/            # Types TypeScript
└── utils/            # Utilitaires
```

### 🔧 Bonnes pratiques React

- **Composants fonctionnels** : Préférer les hooks aux classes
- **Props typées** : Interfaces TypeScript strictes
- **État local minimal** : Éviter la sur-utilisation du state
- **Réutilisabilité** : Composants génériques dans `ui/`

### 📋 Configuration Frontend

#### `package.json`
**Rôle** : Manifeste principal du projet avec dépendances et scripts  
**Scripts clés** : `dev`, `build`, `test`, `lint`, `dev:backend`, `dev:full`  
**Dépendances** : React 19, React Router 7, Tailwind CSS 4, TypeScript 5, Vite 7

#### `vite.config.ts`
**Rôle** : Configuration du bundler Vite  
**Fonctionnalités** : Plugin React avec Fast Refresh, ESLint intégré, HMR, optimisation production

#### `tsconfig.json`
**Paramètres clés** :
- `target: "ES2020"` - Support JavaScript moderne
- `moduleResolution: "bundler"` - Optimisé pour Vite
- `strict: true` - TypeScript strict activé

#### `eslint.config.cjs`
**Configuration ESLint 9** avec règles strictes :
- `@typescript-eslint` - Vérifications avancées
- `react-hooks` - Validation hooks React
- `import` - Gestion imports/exports

#### `tailwind.config.js`
**Configuration Tailwind CSS 4** :
- Import CSS moderne avec `@import`
- Classes utilitaires étendues
- Configuration responsive

---

## 🗄️ ARCHITECTURE BACKEND

### 📁 Structure des services

```
backend/src/
├── services/         # Logique métier
├── routes/           # Endpoints API
├── types/            # Types partagés
└── database/         # Configuration DB
```

### 🔧 Bonnes pratiques Express

- **Middleware** : Validation, erreurs, logging
- **Routes RESTful** : Convention HTTP claire
- **Gestion erreurs** : Codes HTTP appropriés
- **Validation** : Entrées utilisateur strictes

### 📋 Configuration Backend

#### `backend/tsconfig.json`
**Configuration TypeScript backend** :
- `target: "ES2022"` - Support Node.js moderne
- `moduleResolution: "node"` - Standard Node.js
- Types Node.js inclus

#### `backend/src/database.ts`
**Configuration SQLite** :
- Connexion better-sqlite3
- WAL mode pour performances
- Gestion erreurs connexion

#### `backend/src/initDatabase.ts`
**Initialisation schéma** :
- Création tables si inexistantes
- Contraintes FK appliquées
- Données par défaut injectées

#### `backend/src/initTestDatabase.ts`
**Base tests isolée** :
- Base séparée (`test.db`)
- Isolation complète
- Nettoyage automatique

---

## 🧪 ARCHITECTURE TESTS

### 🎯 Stratégie de tests

- **Tests unitaires** : Services individuels
- **Tests intégration** : API endpoints complets
- **Isolation** : Base de test séparée
- **Fixtures** : Données cohérentes

### 📝 Standards tests

```typescript
// ✅ Structure de test cohérente
describe('PlayerService', () => {
  beforeEach(() => {
    // Setup isolation
  })

  describe('create', () => {
    it('should create player with valid data', async () => {
      // Arrange, Act, Assert
    })
  })
})
```

### 📊 État Actuel des Tests

#### ✅ Tests Backend Complets
- **Tests unitaires** : 11 tests pour tous les services
- **Tests intégration** : 22 tests couvrant tous les endpoints API
- **Coverage** : 100% fonctionnalités critiques
- **Infrastructure** : Isolation DB, fixtures automatiques

#### 📋 Configuration Tests

#### `vitest.config.ts`
**Configuration Vitest** :
- Tests en série (éviter conflits DB)
- Coverage configuré
- Environnement Node.js pour backend

#### `__tests__/fixtures/`
**Données de test** :
- Injection automatisée
- Nettoyage automatique
- Contraintes FK respectées

---

## 🔧 CONFIGURATION DÉVELOPPEMENT

### Variables d'Environnement

#### Frontend (optionnel)
```bash
VITE_API_URL=http://localhost:3001  # URL API backend
```

#### Backend (optionnel)
```bash
NODE_ENV=development|test|production
DATABASE_PATH=./database/database.db  # Base principale
TEST_DATABASE_PATH=./database/test.db # Base tests
```

### Scripts NPM Disponibles

#### Scripts Frontend
```bash
npm run dev          # Serveur Vite (port 5173)
npm run build        # Build production
npm run preview      # Preview build
npm run lint         # ESLint
npm run lint:fix     # Auto-correction
```

#### Scripts Backend
```bash
npm run dev:backend  # Express (port 3001)
npm run dev:full     # Frontend + Backend (recommandé)
```

#### Scripts Tests
```bash
npm run test         # Tests complets (33 tests)
npm run test:watch   # Mode watch
npm run test:coverage # Avec coverage
```

### Démarrage Rapide

```bash
npm run dev:full       # Frontend + Backend ensemble
```

**Vérification** :
```bash
curl http://localhost:3001/api/players    # API REST
curl "http://localhost:3001/api/bgg/search?q=Catan"  # BGG
```

---

## 📊 MÉTRIQUES TECHNIQUES

### Performance
- **Build time** : ~3-5 secondes (Vite)
- **HMR** : <100ms (Hot Module Replacement)
- **Tests** : 33/33 passent en ~2-3 secondes
- **Lint** : 0 erreur sur 45+ fichiers

### Qualité Code
- **TypeScript strict** : 100% activé
- **ESLint** : 0 erreur, 0 warning
- **Test coverage** : >80% fonctionnalités critiques
- **Type safety** : 100% interfaces typées

### Base de Données
- **Tables** : 8 tables principales
- **Relations** : FK cohérentes et testées
- **Fixtures** : Données automatisées
- **Migrations** : Schéma versionné

---

## 🚨 POINTS D'ATTENTION

### Améliorations Récentes ✅

1. **Service BGG** : Typage TypeScript complet, suppression `any`
2. **UX Games** : Interface BGG conditionnelle
3. **Qualité Code** : 0 erreurs ESLint maintenues
4. **Documentation** : Structure organisée docs/{backend,frontend,general}/
5. **BGGSearch Component** : Intégration BoardGameGeek optimisée
6. **Types Hybrides** : Gestion JavaScript ↔ SQLite documentée
7. **Services Frontend** : BGGService, PlayersService, GamesService complets

### Limitations Actuelles

1. **UI/UX** : Interface basique, refonte prévue
2. **Mobile** : Responsive limité
3. **Performance** : Pagination manquante pour grandes listes

### Dépendances Critiques

- **React 19** : Version latest, stabilité confirmée
- **Node.js 20+** : Requis pour better-sqlite3
- **TypeScript 5** : Strict mode, types avancés
- **Vite 7** : Bundler moderne, performances optimales

### Sécurité

- **Validation input** : Backend + frontend
- **CORS** : Configuré pour localhost
- **SQL injection** : Protection prepared statements
- **XSS** : React protection native + validation

---

## 🚀 ÉVOLUTION ARCHITECTURE

### 📈 Extensibilité prévue

- **BGG Integration** : Service externe modulaire
- **Templates jeux** : Système configurable
- **Statistiques** : Module analytique séparé
- **Multi-langues** : Internationalisation

### 🎯 Maintien qualité

- **Code reviews** : Validation principes SOLID
- **Tests automatisés** : Couverture >80%
- **Linting** : Standards code stricts
- **Documentation** : Architecture à jour

---

## 📋 QUALITÉ & CI/CD

### Hooks Git
#### `.husky/`
**Hooks automatisés** :
- `pre-commit` : ESLint + tests automatiques
- `commit-msg` : Validation Commitlint

### Pipeline CI/CD
#### `.github/workflows/`
**GitHub Actions** :
- Lint automatique sur PR/push
- Tests complets (33 tests)
- Build production
- Validation multi-environnements

### Standards Qualité
#### `commitlint.config.cjs`
**Convention Commits** :
- Types : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Format : `type: description`

---

_Cette documentation architecture est maintenue automatiquement et reflète l'état actuel du projet._
