# 🎯 Board Game Score Tracker

## 🚀 Status du Projet

### ✅ Foundation Technique Complète (Septembre 2025)

- **Backend Express.js + SQLite** : 10 endpoints, 33/33 tests ✅
- **Frontend React + TypeScript** : Pages CRUD Players & Games complètes ✅
- **Intégration BoardGameGeek** : Service BGG complet, composant BGGSearch ✅
- **Types TypeScript** : Interfaces complètes pour Game, Player, BGG avec gestion hybride ✅
- **Services Frontend** : BGGService, PlayersService, GamesService documentés ✅
- **Documentation** : Structure complète docs/{backend,frontend,general}/ ✅
- **Qualité Code** : 0 erreurs ESLint, typage TypeScript strict ✅

### 🎨 Prochaine Phase : UI/UX Refonte

Foundation technique solide permettant de se concentrer sur l'amélioration de l'interface utilisateur et de l'expérience globale.

---

## Commit automatique au format Conventional Commits

Un hook Husky corrige automatiquement le message de commit si ## Database

### ✅ Infrastructure complète

- ## Tests

✅ **Status : Infrastructure complète et robuste**

- **Framework** : Vitest avec configuration série pour éviter les conflits de DB
- **Coverage** :La structure complète, les tables, relations, migrations et requêtes sont ## Documentation

### 📚 Docum- Séparation stLa structure complète, les tables, relations, migrations et requêtes sont documentées dans : ➡️ [docs/backend/database-structure.md](docs/backend/database-structure.md)icte frontend/backend

- Modularité et tests obligatoires
- Migrations pour toute modif DB
- Validation et sécurité systématiques
- Documentation à jour (docs/general/CONTEXT.md, docs/backend/database-structure.md, README.md)
- Conventions de commit et scripts qualité

## Documentation

- [docs/README.md](docs/README.md) : Index navigation complète
- [docs/general/CONTEXT.md](docs/general/CONTEXT.md) : Règles IA, standards, workflow
- [docs/backend/database-structure.md](docs/backend/database-structure.md) : Structure DB
- [commitlint.config.cjs](commitlint.config.cjs) : Convention de commit
- [eslint.config.cjs](eslint.config.cjs) : Linting
- [.prettierrc.cjs](.prettierrc.cjs) : Formatageipale
- **[README.md](README.md)** : Documentation générale du projet (ce fichier)
- **[docs/general/ROADMAP.md](docs/general/ROADMAP.md)** : Feuille de route et planning des fonctionnalités
- **[docs/general/CONTEXT.md](docs/general/CONTEXT.md)** : Règles IA, standards, workflow et contraintes
- **[docs/general/ARCHITECTURE.md](docs/general/ARCHITECTURE.md)** : Principes SOLID, bonnes pratiques architecture
- **[docs/general/TECHNICAL_STATE.md](docs/general/TECHNICAL_STATE.md)** : État technique & configuration complète

### 🔌 Documentation API & Backend

- **[docs/backend/API_DOC.md](docs/backend/API_DOC.md)** : Documentation complète des endpoints REST
- **[docs/backend/database-structure.md](docs/backend/database-structure.md)** : Structure complète de la base de données
- **[backend/README.md](backend/README.md)** : Documentation spécifique du backend

### 🧪 Documentation Tests

- **[**tests**/backend/README.md](**tests**/backend/README.md)** : Documentation des tests backend

### 🔍 Documentation Qualité & Linting

- **[docs/general/LINTING.md](docs/general/LINTING.md)** : Configuration ESLint, règles et bonnes pratiques

### ⚙️ Configuration

- **[commitlint.config.cjs](commitlint.config.cjs)** : Convention de commit
- **[eslint.config.cjs](eslint.config.cjs)** : Configuration linting
- **[.prettierrc.cjs](.prettierrc.cjs)** : Configuration formatage
- **[tsconfig.json](tsconfig.json)** : Configuration TypeScript
- **[vite.config.ts](vite.config.ts)** : Configuration build Vitetées dans : ➡️ [backend/database/docs/database-structure.md](backend/database/docs/database-structure.md)

## Standards & Best Practices

### 🎯 Règles de Développement

- **Pas de type `any`** : TypeScript strict appliqué
- **Séparation frontend/backend** : APIs REST uniquement
- **Modularité obligatoire** : Services, composants, types séparés
- **Tests obligatoires** : Coverage critique à 100%
- **Migrations DB** : Toute modification nécessite une migration
- **Validation** : Entrées validées côté backend
- **Documentation** : À jour à chaque feature

### 🔧 Outils de Qualité

- **EditorConfig** : Formatage uniforme (LF, UTF-8, 2 spaces)
- **Prettier** : Formatage automatique du code
- **ESLint** : Linting strict (React, TypeScript, Hooks)
- **Husky** : Hooks Git (pre-commit, commit-msg)
- **Commitlint** : Messages conventionnels obligatoires

### 📝 Conventions de Commit

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: mise à jour documentation
style: formatage, lint
refactor: refactoring sans changement fonctionnel
test: ajout/modification tests
chore: tâches de maintenance
```

## Historique des Corrections

### 🛠️ Corrections Récentes (Septembre 2025)

- **Line endings** : Normalisé CRLF → LF pour compatibilité lint
- **TypeScript config** : moduleResolution `bundler` pour React Router 7
- **PostCSS** : Migration vers @tailwindcss/postcss pour Tailwind v4
- **ESLint** : Correction caractères non-échappés et interfaces vides
- **CI/CD** : Pipeline GitHub Actions fonctionnelle avec npm
- **Build** : Production builds optimisés sans erreur

### ✅ État Actuel

- **0 erreur** ESLint sur tout le projet → [Documentation Linting](docs/LINTING.md)
- **33/33 tests** passent en série
- **Build** production fonctionnel
- **Pipeline CI/CD** verte sur GitHub Actions
- **Architecture frontend** prête pour développement CRUD

## Documentation

### 📚 Références

- **[docs/README.md](docs/README.md)** : Index navigation complète
- **[docs/general/CONTEXT.md](docs/general/CONTEXT.md)** : Règles IA, standards, workflow
- **[docs/general/DEVELOPMENT_GUIDELINES.md](docs/general/DEVELOPMENT_GUIDELINES.md)** : Guide des bonnes pratiques
- **[docs/general/LINTING.md](docs/general/LINTING.md)** : Configuration ESLint et bonnes pratiques
- **[docs/general/TECHNICAL_STATE.md](docs/general/TECHNICAL_STATE.md)** : État technique & configuration complète
- **[docs/backend/database-structure.md](docs/backend/database-structure.md)** : Structure complète DB
- **[docs/backend/API_DOC.md](docs/backend/API_DOC.md)** : Documentation endpoints REST
- **[docs/general/ROADMAP.md](docs/general/ROADMAP.md)** : Feuille de route fonctionnalités

### ⚠️ Points d'attention développement

- **Types SQLite** : Conversion booléens → entiers (voir [DEVELOPMENT_GUIDELINES.md](docs/general/DEVELOPMENT_GUIDELINES.md))
- **Valeurs null/undefined** : Gestion spécifique JavaScript ↔ SQLite
- **Formulaires React** : Valeurs par défaut obligatoires pour inputs

### 🔄 Maintenance

- **Tests** : Exécutés automatiquement sur chaque commit
- **Linting** : Vérifié avant chaque commit via Husky
- **Documentation** : Mise à jour avec chaque feature
- **Migrations** : Versionnées et documentées
- **Dependencies** : Audit de sécurité régulier33/33 tests réussissent (100% des fonctionnalités critiques)
- **Types de tests** :
  - Tests d'intégration API (22 tests)
  - Tests unitaires services (11 tests)
- **Isolation** : Base de test séparée avec fixtures automatiques
- **CI/CD** : Husky empêche les commits si tests ou lint échouent
- **Configuration** : Tests en série (`singleFork: true`) pour éliminer les conflits de concurrencee principale\*\* : `backend/database/database.db` - Base de production avec schéma complet
- **Base de test** : `backend/database/test.db` - Base isolée pour les tests automatisés
- **Sélection automatique** : Le système choisit la bonne base selon l'environnement
- **Fixtures** : Système d'injection de données de test avec FK cohérentes
- **Tests** : 33/33 tests passent avec isolation complète des bases

### Initialisation des bases de données

```bash
# Base principale (production)
node backend/src/initDatabase.ts

# Base de test (développement)
node backend/src/initTestDatabase.ts
```

La structure complète, les tables, relations et migrations sont documentées dans :  
➡️ [backend/database/docs/database-structure.md](backend/database/docs/database-structure.md)Conventional Commit n'est pas respecté. Si tu fais un commit avec un message libre, il sera préfixé par `chore:` pour garantir la conformité.

Exemple :

```
git commit -m "ajout doc et tests"
```

devient automatiquement :

```
chore: ajout doc et tests
```

Ce mécanisme permet de ne jamais bloquer les commits à cause du format.

# Board Game Score Tracker

Application web pour gérer les parties de jeux de société, suivi multi-modes, gestion des personnages, statistiques avancées, et intégration BoardGameGeek.

![Screenshot](assets/screenshot.png)

## ✅ État du Projet - Septembre 2025

- **Backend** : 100% fonctionnel avec 33/33 tests qui passent ✅
- **API REST** : 10 endpoints avec validation complète ✅
- **Base de données** : SQLite avec schéma complet et fixtures ✅
- **Tests d'intégration** : Coverage complète des endpoints ✅
- **Tests unitaires** : Tous les services backend testés ✅
- **Frontend** : Architecture en place, dashboard fonctionnel ✅
- **CI/CD** : Pipeline GitHub Actions fonctionnelle ✅
- **Linting** : Aucune erreur ESLint ✅
- **Build** : Production builds sans erreur ✅

## About

Board Game Score Tracker propose une stack moderne, des outils de qualité et une structure modulaire pour le suivi des jeux de société.

## Stack Technique

### Frontend

- **React 19** avec TypeScript 5.x
- **React Router 7** pour la navigation
- **Tailwind CSS 4** avec @tailwindcss/forms
- **Vite 7** comme bundler
- **API client** avec gestion d'erreurs robuste

### Backend

- **Node.js 24** avec Express.js 5
- **TypeScript 5.x** strict
- **better-sqlite3** pour SQLite
- **Architecture en services** modulaires

### Outils de Développement

- **Vitest** pour les tests
- **ESLint 9** + Prettier 3\*\* pour la qualité du code
- **Husky 9** + Commitlint pour les conventions Git
- **GitHub Actions** pour CI/CD

## Frontend Architecture

### 📁 Structure

```
src/
├── components/          # Composants réutilisables
│   └── Layout.tsx      # Layout principal avec navigation
├── pages/              # Pages de l'application
│   └── Dashboard.tsx   # Page d'accueil avec statistiques
├── services/           # Services API
│   ├── apiClient.ts    # Client HTTP avec gestion d'erreurs
│   ├── playersService.ts
│   └── gamesService.ts
├── types/              # Types TypeScript
│   └── index.ts        # Interfaces complètes (Player, Game, etc.)
├── main.tsx           # Point d'entrée avec React Router
└── index.css          # Styles Tailwind
```

### 🎯 Pages Implémentées ✅

- **Dashboard** : Vue d'ensemble avec statistiques en temps réel
- **Players** : CRUD complet (liste, création, édition, suppression)
- **Games** : CRUD complet avec intégration BoardGameGeek
- **Layout** : Navigation responsive avec menu principal

### 🔗 API Integration ✅

- Client HTTP robuste avec gestion d'erreurs
- Services typés pour chaque endpoint backend
- Types TypeScript synchronisés avec la base de données
- **Intégration BoardGameGeek** : Recherche, import automatique, cache intelligent

## Backend Architecture

### 📁 Structure

```
backend/
├── src/
│   ├── services/           # Services métier (10 modules)
│   ├── database.ts         # Configuration SQLite
│   └── server.ts          # Serveur Express
└── database/
    ├── database.db         # Base de production
    ├── test.db            # Base de test
    └── docs/
        └── database-structure.md
```

### 🚀 API Endpoints (10) ✅

- **Players** : CRUD complet + statistiques
- **Games** : Gestion des jeux avec métadonnées BGG
- **Game Sessions** : Sessions de jeu avec scores
- **Game Characters** : Personnages par jeu
- **Game Extensions** : Extensions/DLC
- **Game Stats** : Statistiques des parties
- **BGG Service** : Intégration BoardGameGeek (recherche, import, cache)
- **Player Stats** : Statistiques des joueurs
- **Player Game Stats** : Stats croisées joueur/jeu
- **Current Game** : Partie en cours

## Documentation API

Consultez la documentation complète des endpoints backend ici : [docs/API_DOC.md](./docs/API_DOC.md)

## Tests automatisés

✅ **Status : 33/33 tests réussissent** (Septembre 2025)

### 🧪 Types de Tests

- **Tests d'intégration API** : 22 tests couvrant tous les endpoints
- **Tests unitaires backend** : 11 tests pour tous les services
- **Coverage** : 100% des fonctionnalités critiques
- **Isolation** : Tests en série pour éviter les conflits SQLite
- **Fixtures** : Système d'injection automatique avec FK cohérentes

### 🔧 Configuration

- **Framework** : Vitest avec `singleFork: true`
- **Bases séparées** : `database.db` (prod) / `test.db` (tests)
- **Fixtures automatiques** : Injection de données cohérentes
- **CI/CD** : Tests obligatoires avant merge

### 📊 Détails par Service

- **Players** : 5 tests (CRUD + validation)
- **Game Sessions** : 4 tests (création + relations)
- **Tous les autres services** : 2 tests chacun (get + create)

Consultez la documentation détaillée : [**tests**/backend/README.md](./__tests__/backend/README.md)

## Configuration et Standards

### 🔧 Build & Development

```bash
# Installation
npm install

# Développement (frontend + backend)
npm run dev

# Tests (tous les tests)
npm test

# Build production
npm run build

# Linting (aucune erreur)
npm run lint

# Formatage automatique
npm run format
```

### 📋 Configuration TypeScript

- **moduleResolution** : `bundler` (compatibilité React Router 7)
- **target** : `ESNext`
- **strict** : `true`
- **skipLibCheck** : `true`

### 🎨 Configuration ESLint/Prettier

- **ESLint 9** avec configuration flat
- **Prettier 3** avec formatage automatique
- **Règles strictes** : React, TypeScript, Hooks
- **Format sur sauvegarde** activé

## Project Structure

```
boardGameScore/
├── 📁 src/                     # Frontend React + TypeScript
│   ├── components/
│   │   └── Layout.tsx          # Layout avec navigation
│   ├── pages/
│   │   └── Dashboard.tsx       # Page d'accueil
│   ├── services/
│   │   ├── apiClient.ts        # Client HTTP
│   │   ├── playersService.ts   # Service joueurs
│   │   └── gamesService.ts     # Service jeux
│   ├── types/
│   │   └── index.ts           # Types TypeScript
│   ├── main.tsx               # Point d'entrée
│   └── index.css              # Styles Tailwind
├── 📁 backend/
│   ├── src/
│   │   ├── services/          # 10 services métier
│   │   ├── database.ts        # Config SQLite
│   │   ├── server.ts          # Serveur Express
│   │   └── init*.ts           # Scripts d'initialisation
│   ├── database/
│   │   ├── database.db        # Base de production
│   │   ├── test.db           # Base de test
│   │   └── docs/
│   │       └── database-structure.md
│   └── tsconfig.json
├── 📁 __tests__/              # Tests automatisés
│   ├── integration/           # 22 tests d'intégration API
│   ├── backend/              # 11 tests unitaires
│   └── fixtures/             # Données de test
├── 📁 .github/
│   └── workflows/
│       └── ci.yml            # Pipeline GitHub Actions
├── 📁 .husky/                # Hooks Git
├── 📄 Configuration
│   ├── .editorconfig
│   ├── .prettierrc.cjs
│   ├── commitlint.config.cjs
│   ├── eslint.config.cjs
│   ├── postcss.config.cjs    # Config Tailwind CSS 4
│   ├── tailwind.config.js
│   ├── tsconfig.json         # Config TypeScript
│   └── vite.config.ts
├── 📄 Documentation
│   ├── README.md             # Ce fichier
│   └── docs/                 # Documentation technique organisée
│       ├── README.md         # Index navigation
│       ├── backend/          # Documentation backend
│       │   ├── API_DOC.md    # Endpoints REST
│       │   └── database-structure.md # Schéma DB
│       ├── frontend/         # Documentation frontend
│       │   └── (à venir)
│       └── general/          # Documentation générale
│           ├── CONTEXT.md    # Standards et règles IA
│           ├── ARCHITECTURE.md # Principes SOLID
│           ├── DEVELOPMENT_GUIDELINES.md # Guide développement
│           ├── LINTING.md    # Configuration ESLint & qualité
│           ├── ROADMAP.md    # Feuille de route
│           └── TECHNICAL_STATE.md # État technique & config
└── package.json
```

## CI/CD Pipeline

### 🚀 GitHub Actions

```yaml
name: CI
on: [push, pull_request]
jobs:
  lint: # ESLint sur src, backend/src, __tests__
  build: # npm run build (Vite + TypeScript)
  test: # npm test (33 tests Vitest)
```

### 🔒 Quality Gates

- **Husky hooks** : Lint + tests avant commit
- **Commitlint** : Messages de commit conventionnels
- **Pipeline obligatoire** : Tous les jobs doivent passer
- **Aucune erreur tolérée** : 0 warning ESLint

## Initialisation Database

### 🗄️ Scripts d'Initialisation

```bash
# Base principale (production)
node backend/src/initDatabase.ts

# Base de test (développement)
node backend/src/initTestDatabase.ts
```

### 📊 Fixtures Automatiques

- **Données cohérentes** : FK automatiques, timestamps réalistes
- **Joueurs** : Alice, Bob avec historiques
- **Jeux** : Catan, 7 Wonders avec métadonnées
- **Sessions** : Parties avec scores et statistiques
- **Relations** : Personnages, extensions, stats croisées

La structure complète est documentée dans :  
➡️ [backend/database/docs/database-structure.md](backend/database/docs/database-structure.md)

![](assets/template-usage.png)

## 🚀 Démarrage

### ⚡ Démarrage Rapide (Recommandé)

```bash
# Clone et installation
git clone https://github.com/thibaud200/boardGameScore.git
cd boardGameScore
npm install

# Démarrage complet (frontend + backend)
npm run dev:full
# ➡️ Frontend: http://localhost:5173
# ➡️ Backend: http://localhost:3001
```

### 🔧 Démarrage Séparé

#### Frontend uniquement

```bash
npm run dev
# ➡️ http://localhost:5173
```

#### Backend uniquement

```bash
npm run dev:backend
# ➡️ http://localhost:3001
# Affiche: "Server running on port 3001"
```

#### Démarrage manuel backend

```bash
cd backend
npm install
tsx src/server.ts
# ➡️ Base de données initialisée automatiquement
```

### ✅ Vérification du Démarrage Backend

Le serveur backend affiche au démarrage :

```
Base de données initialisée avec le schéma.
Server running on port 3001
```

**Tests de connectivité :**

```bash
# Test API Players
curl http://localhost:3001/api/players
# Réponse: [] (liste vide)

# Test intégration BGG
curl "http://localhost:3001/api/bgg/search?q=Catan"
# Réponse: JSON avec résultats BGG
```

## Scripts

- `npm run dev` : Démarrage frontend/backend en mode développement
- `npm run lint` : Vérification ESLint (aucune erreur)
- `npm run format` : Formatage Prettier automatique
- `npm run test` : **33/33 tests réussissent** ✅
- `npm run build` : Build production optimisé

## Database

### Initialisation de la base de données

Deux scripts permettent d’initialiser les bases SQLite :

- **Base principale** : `node backend/src/initDatabase.ts` crée/initialise la base réelle (`database.db`) avec le schéma complet.
- **Base de test** : `node backend/src/initTestDatabase.ts` crée/initialise une base dédiée aux tests (`test.db`) avec le même schéma.

La structure complète, les tables, relations, migrations et requêtes sont documentées dans : ➡️ [backend/database/docs/database-structure.md](backend/database/docs/database-structure.md)

## Standards & Constraints

- Pas de type `any`
- Séparation stricte frontend/backend
- Modularité et tests obligatoires
- Migrations pour toute modif DB
- Validation et sécurité systématiques
- Documentation à jour (CONTEXT.md, database-structure.md, README.md)
- Conventions de commit et scripts qualité

## Documentation

- [CONTEXT.md](CONTEXT.md) : Règles IA, standards, workflow
- [backend/database/docs/database-structure.md](backend/database/docs/database-structure.md) : Structure DB
- [commitlint.config.cjs](commitlint.config.cjs) : Convention de commit
- [eslint.config.cjs](eslint.config.cjs) : Linting
- [.prettierrc.cjs](.prettierrc.cjs) : Formatage

## Tests

- **Vitest** : Tests unitaires backend/frontend
- **Coverage** : >80% requis
- **Husky** : Empêche les commits si tests ou lint échouent
