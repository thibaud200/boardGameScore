# 📋 État Technique & Configuration - Board Game Score Tracker

## 🗂️ Structure des Fichiers de Configuration

### Frontend (React + TypeScript + Vite)

#### `package.json`
**Rôle** : Manifeste principal du projet avec dépendances et scripts  
**Contenu clé** :
- **Scripts** : `dev`, `build`, `test`, `lint`, `dev:backend`, `dev:full`
- **Dépendances production** : React 19, React Router 7, Tailwind CSS 4
- **Dépendances développement** : TypeScript 5, Vite 7, ESLint 9, Prettier 3

#### `vite.config.ts`
**Rôle** : Configuration du bundler Vite pour développement et build  
**Fonctionnalités** :
- Plugin React avec Fast Refresh
- Plugin ESLint intégré
- Configuration HMR (Hot Module Replacement)
- Optimisation des builds de production

#### `tsconfig.json`
**Rôle** : Configuration TypeScript principale pour le frontend  
**Paramètres clés** :
- `target: "ES2020"` - Support des fonctionnalités JavaScript modernes
- `moduleResolution: "bundler"` - Résolution optimisée pour Vite
- `strict: true` - Mode TypeScript strict activé
- Chemins d'import absolus avec baseUrl

#### `tsconfig.eslint.json`
**Rôle** : Configuration TypeScript spécifique pour ESLint  
**Usage** : Étend la configuration principale pour inclure tous les fichiers dans le linting

#### `eslint.config.cjs`
**Rôle** : Configuration ESLint 9 avec règles strictes  
**Règles activées** :
- `@typescript-eslint` - Vérifications TypeScript avancées
- `react-hooks` - Validation des hooks React
- `import` - Gestion des imports/exports
- Règles personnalisées pour les apostrophes et quotes

#### `tailwind.config.js`
**Rôle** : Configuration Tailwind CSS 4  
**Fonctionnalités** :
- Import CSS moderne avec `@import`
- Classes utilitaires étendues
- Configuration responsive
- Optimisation pour production (purge CSS)

#### `postcss.config.js`
**Rôle** : Configuration PostCSS pour Tailwind CSS 4  
**Plugins** :
- `@tailwindcss/postcss` - Plugin officiel Tailwind v4
- Traitement des imports CSS
- Optimisation pour builds de production

### Backend (Express.js + SQLite)

#### `backend/tsconfig.json`
**Rôle** : Configuration TypeScript spécifique au backend  
**Différences** :
- `target: "ES2022"` - Support Node.js moderne
- `moduleResolution: "node"` - Résolution Node.js standard
- Types Node.js inclus

#### `backend/src/database.ts`
**Rôle** : Configuration de la base de données SQLite  
**Fonctionnalités** :
- Connexion better-sqlite3
- Configuration WAL mode pour performances
- Gestion des erreurs de connexion

#### `backend/src/initDatabase.ts`
**Rôle** : Initialisation et création du schéma SQLite  
**Actions** :
- Création des tables si inexistantes
- Application des contraintes FK
- Injection de données par défaut

#### `backend/src/initTestDatabase.ts`
**Rôle** : Configuration base de données pour tests  
**Spécificités** :
- Base séparée (`test.db`)
- Isolation complète des tests
- Nettoyage automatique entre tests

### Qualité & CI/CD

#### `eslint.config.cjs`
**Rôle** : Configuration ESLint 9 avec règles strictes  
**Fonctionnalités** :
- Configuration flat config moderne
- Rules TypeScript, React, Import
- Intégration Prettier sans conflits
- **Documentation complète** : [LINTING.md](LINTING.md)

#### `.gitignore`
**Rôle** : Exclusions Git  
**Éléments exclus** :
- `node_modules/`, `dist/`, `.env`
- Bases de données SQLite (`*.db`)
- Fichiers temporaires et logs

#### `commitlint.config.cjs`
**Rôle** : Validation des messages de commit  
**Convention** : Conventional Commits
- Types autorisés : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Format obligatoire : `type: description`

#### `.husky/`
**Rôle** : Hooks Git automatisés  
**Hooks configurés** :
- `pre-commit` : ESLint + tests automatiques
- `commit-msg` : Validation du message avec Commitlint

#### `.github/workflows/`
**Rôle** : Pipeline CI/CD GitHub Actions  
**Actions** :
- Lint automatique sur PR/push
- Tests complets (33 tests)
- Build de production
- Validation multi-environnements

### Tests & Validation

#### `vitest.config.ts`
**Rôle** : Configuration des tests Vitest  
**Paramètres** :
- Tests en série (éviter conflits DB)
- Coverage configuré
- Environnement Node.js pour backend

#### `__tests__/fixtures/`
**Rôle** : Données de test automatisées  
**Contenu** :
- Injection de données cohérentes
- Nettoyage automatique
- Respect des contraintes FK

---

## 🔧 Configuration de Développement

### Variables d'Environnement

#### Frontend (optionnel)
```bash
VITE_API_URL=http://localhost:3001  # URL API backend
```

#### Backend (optionnel)
```bash
NODE_ENV=development|test|production
DATABASE_PATH=./database/database.db  # Chemin base principale
TEST_DATABASE_PATH=./database/test.db # Chemin base tests
```

### Scripts NPM Disponibles

#### Scripts Frontend
```bash
npm run dev          # Serveur développement Vite (port 5173)
npm run build        # Build production optimisé
npm run preview      # Prévisualisation build production
npm run lint         # ESLint sur tout le projet
npm run lint:fix     # Auto-correction ESLint
```

#### Scripts Backend
```bash
npm run dev:backend  # Serveur Express (port 3001)
npm run dev:full     # Frontend + Backend simultanés (recommandé)
```

#### Scripts Tests
```bash
npm run test         # Tests complets (33 tests)
npm run test:watch   # Tests en mode watch
npm run test:coverage # Tests avec coverage
```

### Démarrage Backend

#### ⚡ Démarrage Rapide
```bash
npm run dev:backend    # Depuis la racine
# OU
npm run dev:full       # Frontend + Backend ensemble
```

#### 🔧 Démarrage Manuel
```bash
cd backend
npm install            # Installation dépendances
tsx src/server.ts      # Lancement direct
```

#### ✅ Vérification
Le serveur affiche au démarrage :
```
Base de données initialisée avec le schéma.
Server running on port 3001
```

**Tests de connectivité :**
```bash
curl http://localhost:3001/api/players    # API REST
curl "http://localhost:3001/api/bgg/search?q=Catan"  # BGG
```

---

## 📊 Métriques Techniques Actuelles

### Performance
- **Build time** : ~3-5 secondes (Vite)
- **HMR** : <100ms (Hot Module Replacement)
- **Tests** : 33/33 passent en ~2-3 secondes
- **Lint** : 0 erreur sur 45+ fichiers

### Qualité Code
- **TypeScript strict** : 100% activé
- **ESLint** : 0 erreur, 0 warning
- **Test coverage** : >80% fonctionnalités critiques
- **Types safety** : 100% interfaces tipées

### Base de Données
- **Tables** : 8 tables principales
- **Relations** : FK cohérentes et testées
- **Fixtures** : Données de test automatisées
- **Migrations** : Schéma versionné

---

## 🚨 Points d'Attention

### Améliorations Récentes ✅
1. **Service BGG** : Typage TypeScript complet, suppression des types `any`
2. **UX Games** : Interface BGG conditionnelle (visible uniquement lors ajout/modification)
3. **Qualité Code** : 0 erreurs ESLint maintenues, linting strict respecté
4. **Documentation** : Structure organisée en docs/{backend,frontend,general}/
5. **Frontend Documentation** : Documentation complète des composants, services et types ✅
6. **BGGSearch Component** : Composant d'intégration BoardGameGeek avec workflow optimisé ✅
7. **Types Hybrides** : Gestion robuste JavaScript ↔ SQLite documentée ✅
8. **Services Frontend** : BGGService, PlayersService, GamesService avec types complets ✅

### Limitations Actuelles & Tests Manquants
1. **UI/UX** : Interface basique, refonte globale prévue (Phase 3 roadmap)
2. **Mobile** : Responsive limité, optimisation nécessaire
3. **Performance** : Pagination manquante pour grandes listes
4. **Tests frontend** : 🚨 CRITIQUE - Aucun test React, services, components ✅
5. **Tests BGG backend** : 🚨 MANQUANT - bggService.ts non testé ✅
6. **Tests intégration** : 🚨 MANQUANT - Frontend ↔ Backend workflow ✅

### 🧪 État des Tests (Détaillé)

#### ✅ Tests Backend Complets
- **Tests unitaires** : 11 tests pour tous les services (sauf BGG)
- **Tests intégration** : 22 tests couvrant tous les endpoints API
- **Coverage** : 100% fonctionnalités critiques database/API
- **Infrastructure** : Isolation DB, fixtures automatiques

#### ❌ Tests Manquants Critiques
1. **BGGService backend** (bggService.ts) :
   - Parsing XML BGG (searchGames, getGameDetails)
   - Cache intelligent (24h TTL, invalidation)
   - Rate limiting (1s entre requêtes)
   - Gestion erreurs (timeout, 503, XML malformé)
   - Conversion BGG → format local

2. **Frontend React (0 tests)** :
   - Pages : Players.tsx, Games.tsx, Dashboard.tsx
   - Components : BGGSearch.tsx, Layout.tsx
   - Services : BGGService.ts, playersService.ts, gamesService.ts
   - Types : Validation conversions JavaScript ↔ SQLite

3. **Tests Intégration Frontend-Backend** :
   - Communication API complète
   - Workflow BGG search → import → form → save
   - Gestion erreurs réseau frontend

#### 📋 Plan Tests à Implémenter
- **Priorité 1** : Setup React Testing Library + infrastructure
- **Priorité 2** : Tests BGGService backend (critique pour intégration)
- **Priorité 3** : Tests composants frontend critiques (BGGSearch, forms)
- **Priorité 4** : Tests intégration workflow complet

### Dépendances Critiques
- **React 19** : Version latest, stabilité confirmée
- **Node.js 20+** : Requis pour better-sqlite3
- **TypeScript 5** : Strict mode, types avancés
- **Vite 7** : Bundler moderne, performances optimales

### Sécurité
- **Validation input** : Backend + frontend
- **CORS** : Configuré pour localhost développement
- **SQL injection** : Protection via prepared statements
- **XSS** : React protection native + validation

---

*Cette documentation technique est maintenue automatiquement et reflète l'état actuel du projet.*
