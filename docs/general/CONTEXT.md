# 🤖 Contexte IA — #### Frontend (Architecture complète) ✅

- **Structure** : Layout, pages, services, types en place
- **Dashboard** : Page d'accueil avec statistiques fonctionnelle
- **Pages CRUD** : Players et Games avec opérations complètes ✅
- **API Integration** : Client HTTP robuste avec gestion d'erreurs
- **Types** : Interfaces TypeScript complètes et synchronisées ✅
- **Navigation** : React Router 7 configuré
- **Gestion des données** : Conversion TypeScript ↔ SQLite optimisée
- **Intégration BGG** : Service BoardGameGeek avec types complets ✅
- **Composants** : BGGSearch pour import automatique depuis BGG ✅me Score Tracker

Ce fichier est destiné aux agents IA pour garantir que toutes les actions, suggestions et modifications respectent les standards, la structure et les objectifs du projet. Il doit être lu et pris en compte avant toute intervention automatique.

---

## 🎯 Objectif du projet

Board Game Score Tracker est une application web pour gérer les parties de jeux de société, avec suivi multi-modes, gestion des personnages, statistiques avancées et intégration BoardGameGeek.

## ✅ État du Projet (Septembre 2025)

### Backend (100% fonctionnel) ✅

- **API REST** : 10 endpoints avec validation complète
- **Base de données** : SQLite avec schéma complet et fixtures
- **Tests** : 33/33 tests passent (22 intégration + 11 unitaires)
- **Services** : 10 modules métier complets
- **Infrastructure** : Isolation DB, fixtures automatiques

### Frontend (Architecture complète) ✅

- **Structure** : Layout, pages, services, types en place
- **Dashboard** : Page d'accueil avec statistiques fonctionnelle
- **Pages CRUD** : Players et Games avec opérations complètes
- **API Integration** : Client HTTP robuste avec gestion d'erreurs
- **Types** : Interfaces TypeScript complètes et synchronisées
- **Navigation** : React Router 7 configuré
- **Gestion des données** : Conversion TypeScript ↔ SQLite optimisée

### CI/CD & Quality (100% fonctionnel) ✅

- **Pipeline GitHub Actions** : Lint, Build, Test automatisés
- **Linting** : 0 erreur ESLint sur tout le projet
- **Build** : Production builds optimisés sans erreur
- **Tests** : Exécutés automatiquement, 100% de réussite
- **Hooks Git** : Pre-commit avec lint et tests obligatoires

### Développements Frontend Récents (Septembre 2025) ✅

- **BGGSearch Component** : Intégration complète BoardGameGeek avec recherche et import
- **Pages CRUD complètes** : Players et Games avec validation robuste
- **Types TypeScript avancés** : Interfaces BGG, Game, Player avec gestion hybride
- **Services API** : BGGService, PlayersService, GamesService avec gestion d'erreurs
- **UX optimisée** : Interface BGG conditionnelle, workflow de pré-remplissage
- **Documentation complète** : Components, Services, Types documentés (docs/frontend/)

---

## 🏗️ Principes SOLID

Le projet suit les principes SOLID pour garantir un code maintenable, extensible et robuste :

### **S** - Single Responsibility Principle (SRP)

- **Principe** : Une classe/module ne devrait avoir qu'une seule raison de changer
- **Application** : Chaque service gère une seule entité (`playerService`, `gameService`, etc.)
- **Exemple** : `gameSessionService` gère uniquement les sessions, pas les statistiques

### **O** - Open/Closed Principle (OCP)

- **Principe** : Ouvert à l'extension, fermé à la modification
- **Application** : Architecture modulaire permettant l'ajout de nouvelles fonctionnalités
- **Exemple** : Nouveaux services ajoutables sans modifier l'infrastructure existante

### **L** - Liskov Substitution Principle (LSP)

- **Principe** : Les sous-classes doivent pouvoir remplacer leurs classes parentes
- **Application** : Interfaces cohérentes pour tous les services
- **Exemple** : Tous les services respectent le même contrat d'API

### **I** - Interface Segregation Principle (ISP)

- **Principe** : Ne pas forcer à dépendre d'interfaces non utilisées
- **Application** : Interfaces TypeScript spécialisées par domaine
- **Exemple** : `Player`, `Game`, `GameSession` plutôt qu'une interface monolithique

### **D** - Dependency Inversion Principle (DIP)

- **Principe** : Dépendre d'abstractions, pas de concrétions
- **Application** : Services utilisent des abstractions pour la DB
- **Exemple** : Services dépendent de types TypeScript, pas d'implémentations SQLite directes

### 🎯 Bénéfices dans le projet

- **Testabilité** : Chaque module peut être testé indépendamment (33/33 tests)
- **Maintenabilité** : Modifications localisées, impacts limités
- **Extensibilité** : Ajout facile de nouvelles fonctionnalités (BGG, templates)
- **Robustesse** : Architecture résistante aux changements

---

## � Problématiques Techniques Spécifiques

### 🔧 Gestion des Types JavaScript ↔ SQLite

**Problématique identifiée** : Incompatibilité entre les types JavaScript/TypeScript et SQLite.

#### Booléens

- **SQLite** : Stocke les booléens comme `INTEGER` (0 ou 1)
- **JavaScript** : Utilise les booléens natifs `true`/`false`
- **Solution** : Conversion explicite dans le backend

  ```typescript
  // ❌ Erreur SQLite
  stmt.run(data.has_characters) // boolean

  // ✅ Correct
  stmt.run(data.has_characters ? 1 : 0) // integer
  ```

#### Valeurs Nulles

- **SQLite** : Accepte uniquement `null`, pas `undefined`
- **TypeScript** : Utilise `undefined` par défaut pour les propriétés optionnelles
- **Solution** : Conversion et types hybrides

  ```typescript
  // Types supportant null ET undefined
  interface CreateGameRequest {
    game_description?: string | null
    supports_cooperative?: boolean | null
  }

  // Nettoyage avant envoi SQLite
  const cleanedData = {
    ...formData,
    game_description: formData.game_description || null
  }
  ```

#### Formulaires React

- **React** : Les inputs n'acceptent pas `null` comme valeurs
- **Backend** : Nécessite `null` pour SQLite
- **Solution** : Valeurs par défaut dans le frontend
  ```typescript
  // ✅ Dans les inputs React
  value={formData.game_description || ''}
  checked={formData.supports_campaign || false}
  ```

**Points d'attention pour les développeurs IA** :

1. Toujours convertir les booléens en entiers (0/1) avant insertion SQLite
2. Utiliser `|| null` pour les chaînes vides avant envoi au backend
3. Utiliser `|| false` pour les booléens undefined dans les checkboxes React
4. Maintenir la cohérence des types entre frontend et backend

---

## �🗝️ Stack technique

| Composant       | Technologie             | Version | Status |
| --------------- | ----------------------- | ------- | ------ |
| Node            | Node.js                 | 24.x    | ✅     |
| React           | React                   | 19.x    | ✅     |
| Router          | React Router            | 7.x     | ✅     |
| TypeScript      | TypeScript              | 5.x     | ✅     |
| Build           | Vite                    | 7.1.4   | ✅     |
| Styling         | Tailwind CSS            | 4.x     | ✅     |
| Backend         | Express.js              | 5.x     | ✅     |
| Base de données | SQLite + better-sqlite3 | 3.x     | ✅     |
| Tests           | Vitest                  | 3.x     | ✅     |
| Linting         | ESLint + Prettier       | 9.x/3.x | ✅     |
| CI/CD           | GitHub Actions          | -       | ✅     |

### ✅ Infrastructure Tests Complète

| Composant         | Status               | Détails                   |
| ----------------- | -------------------- | ------------------------- |
| Tests Backend     | 33/33 réussissent ✅ | 100% coverage critique    |
| Tests Intégration | 22 tests ✅          | Tous les endpoints API    |
| Tests Unitaires   | 11 tests ✅          | Tous les services backend |
| Isolation DB      | Complète ✅          | Tests en série            |
| Fixtures          | Automatiques ✅      | FK cohérentes             |
| CI/CD Pipeline    | Fonctionnelle ✅     | GitHub Actions            |
| Build Production  | Optimisé ✅          | Vite + TypeScript         |
| Linting           | 0 erreur ✅          | ESLint + Prettier         |

### 🎯 Prochaines Étapes

| Phase | Composant           | Statut      | Priorité |
| ----- | ------------------- | ----------- | -------- |
| 1     | Page Players CRUD   | 🔄 À faire  | Haute    |
| 2     | Page Games          | ⏳ Planifié | Haute    |
| 3     | Page Sessions       | ⏳ Planifié | Moyenne  |
| 4     | API BGG Integration | ⏳ Planifié | Basse    |

## ⚠️ Contraintes spécifiques IA

### 🚫 Interdictions strictes

- **JAMAIS** utiliser le type `any` en TypeScript
- **JAMAIS** mélanger logique backend/frontend dans le même fichier
- **JAMAIS** modifier la DB sans migration + tests + documentation
- **JAMAIS** de code sans tests associés pour les features critiques
- **JAMAIS** ignorer les erreurs ESLint ou les warnings TypeScript
- **JAMAIS** casser les tests existants sans justification
- **JAMAIS** faire de commit sans passer les hooks Husky

### 📋 Obligations systématiques

- **TOUJOURS** respecter les conventions TypeScript strict
- **TOUJOURS** documenter les APIs et interfaces publiques
- **TOUJOURS** fournir des exemples d'utilisation
- **TOUJOURS** inclure des tests pour les nouvelles fonctionnalités
- **TOUJOURS** respecter les conventions de nommage du projet
- **TOUJOURS** valider les entrées utilisateur côté backend
- **TOUJOURS** gérer les erreurs de manière appropriée
- **TOUJOURS** synchroniser types DB ↔ backend ↔ frontend
- **TOUJOURS** utiliser la documentation existante pour maintenir la cohérence
- **TOUJOURS** proposer des solutions modulaires et maintenables
- **TOUJOURS** les fichiers de documentation doivent toujours se trouver dans le répertoire `docs/` sauf le README.md de la racine

- **POSSIBLE** de créer un fichier de travail temporaire supprimé après utilisation si nécessaire pour le développement

### Documentation

- **JAMAIS** créer de nouveaux fichiers de documentation
- **TOUJOURS** Faire les modifications de documentation dans les fichiers suivants :
- **POSSIBLE** de créer un fichier de travail temporaire supprimé après utilisation si nécessaire
  - **API Docs** : `docs/API_DOC.md` - Documentation complète des endpoints
  - **database** : `backend/database/docs/database-structure.md` - Détails techniques de la structure de la base de données
  - **components** : `docs/components.md` - Documentation des composants UI
  - **services** : `docs/services.md` - Documentation des services backend
  - **types** : `docs/types.md` - Documentation des types TypeScript
  - **Architecture Complete** : `docs/general/ARCHITECTURE_COMPLETE.md` - Architecture, principes SOLID et état technique
  - **Contexte** : `docs/CONTEXT.md` - Contexte pour les IA
  - **Guidelines** : `docs/general/TECHNICAL_GUIDELINES.md` - Bonnes pratiques techniques et conventions SQLite/JavaScript
  - **Linting** : `docs/LINTING.md` - Règles de linting et formatage
  - **Roadmap** : `docs/ROADMAP.md` - Planification et étapes de développement
  - **Tests Complete** : `docs/tests/TESTS_COMPLETE.md` - Documentation complète des tests (progression, commandes, roadmap)
  - **Session Journal** : `docs/SESSION_JOURNAL.md` - Journal de développement session 2 Sept (fichier Temporaire)
  - **Technical References** : `docs/TECHNICAL_REFERENCES.md` - Détails techniques et choix d'architecture
  - **Technical Issues** : `docs/TECHNICAL_ISSUES.md` - Problèmes techniques et solutions (fichier Temporaire)
  - **Readme** : `README.md` - Vue d'ensemble du projet, instructions d'installation et de contribution
  - **Readme** : `docs/README.md` - Documentation du projet, y compris les API et les composants
  - **Readme** : `backend/README.md` - Documentation spécifique au backend, y compris les API et les services
  - **Readme** : `__tests__/backend/README.md` - Documentation des tests, y compris les stratégies et les outils

### 🔧 Standards de Qualité

- **Architecture** : Services séparés, composants réutilisables
- **Tests** : Coverage critique à 100%, tests d'intégration obligatoires
- **Documentation** : README.md, docs/CONTEXT.md, API_DOC.md à jour
- **Linting** : ESLint 0 erreur obligatoire → [Documentation complète](LINTING.md)
- **Sécurité** : Validation inputs, gestion erreurs, pas d'exposition de données sensibles
- **Performance** : Builds optimisés, requêtes DB efficaces
- **Conventions** : Commits conventionnels, lint automatique, formatage uniforme

### 🔍 Standards de Qualité Appliqués

- **Configuration stricte** : TypeScript strict, ESLint rules, Prettier automatique
- **CI/CD obligatoire** : GitHub Actions avec lint/build/test automatisés
- **Hooks Git** : Pre-commit avec Husky (lint + tests obligatoires)
- **Zero-error policy** : 0 erreur ESLint, 0 warning TypeScript tolérés
- **Documentation vivante** : README.md, docs/CONTEXT.md, API_DOC.md synchronisés
- **Tests automatisés** : 33/33 tests passent, coverage critique 100%
- **Builds optimisés** : Vite production builds sans erreur
- **Conventions** : Commits conventionnels via Commitlint

### 🔧 Corrections Récentes Appliquées

- **Line endings** : CRLF → LF normalisé pour compatibilité cross-platform
- **TypeScript** : moduleResolution `bundler` pour React Router 7
- **PostCSS** : Migration @tailwindcss/postcss pour Tailwind CSS 4
- **ESLint** : Résolution caractères non-échappés et interfaces vides
- **CI/CD** : Pipeline npm fonctionnelle (migration depuis yarn)
- **Build process** : Production builds optimisés et stables

---

## 🛠️ Règles de développement

### Backend ✅ (Complété)

- **Modularité** : 10 services indépendants avec interfaces claires
- **TypeScript strict** : Aucun `any`, types explicites partout
- **Base de données** : SQLite avec migrations versionnées
- **Tests** : 33/33 tests (22 intégration + 11 unitaires)
- **API** : 10 endpoints REST avec validation complète
- **Sécurité** : Validation inputs, gestion erreurs robuste

### Frontend 🔄 (En cours)

- **Architecture** : Services/composants/pages/types séparés
- **React 19** : Hooks modernes, optimisations automatiques
- **TypeScript strict** : Types synchronisés avec backend
- **Tailwind CSS 4** : Design system cohérent
- **Tests** : React Testing Library à venir
- **État** : Dashboard fonctionnel, structure complète en place

### Standards Qualité 📋

- **Tests obligatoires** : Coverage critique 100%, tests d'intégration systématiques
- **Conventions** : Commits conventionnels, nommage cohérent
- **Performance** : Builds optimisés, requêtes DB efficaces
- **Sécurité** : Validation systématique, pas d'exposition de données sensibles
- **Maintenance** : Documentation à jour, migrations versionnées
  - Tests d'intégration frontend-backend (à venir)

---

## 🛠️ Outils de développement et qualité

### Outils complémentaires de référence IA :

```json
{
  "husky": "^9.0.0", // Git hooks
  "lint-staged": "^15.0.0", // Linting sur staged files
  "commitizen": "^4.3.0", // Commits conventionnels
  "semantic-release": "^24.0.0" // Release automatisée
}
```

### Documentation projet obligatoire :

- **ADR** (Architecture Decision Records) pour tracer les choix techniques
- **Changelog** automatisé avec conventional commits
- **Guide de contribution** pour standardiser les PR
- Générée automatiquement à partir du code et des commentaires
- Maintenue à jour (TypeDoc, JSDoc, Storybook si applicable)

---

## 📁 Structure du Projet (Bonnes pratiques 2025)

```bash
boardGameScore/
├── src/                # Frontend React 19 + TypeScript + Vite (standard 2025)
│   ├── components/     # Composants UI réutilisables
│   ├── pages/          # Pages principales (Dashboard, Players, Games, Sessions)
│   ├── services/       # Client API pour consommer le backend
│   ├── hooks/          # Custom React hooks (useApi, useLocalStorage, etc.)
│   ├── types/          # TypeScript interfaces partagées
│   ├── utils/          # Utilitaires frontend (formatters, validators)
│   └── styles/         # Styles globaux et thèmes
├── backend/            # Express + SQLite (100% fonctionnel ✅)
│   ├── src/            # Services, routes, middleware
│   │   ├── services/   # Services métier (11 services ✅)
│   │   └── server.ts   # Point d'entrée Express
│   └── database/       # SQLite + migrations + documentation
├── __tests__/          # Infrastructure tests complète (33/33 ✅)
│   ├── backend/        # Tests unitaires services (11 tests ✅)
│   ├── integration/    # Tests d'intégration API (22 tests ✅)
│   ├── fixtures/       # Données de test cohérentes
│   └── frontend/       # Tests frontend (à venir)
├── public/             # Assets statiques (images, icons)
└── docs/               # Documentation technique
```

**Conformité aux standards 2025 :**

- ✅ Structure recommandée par Vite/React team
- ✅ Configuration TypeScript standard
- ✅ Séparation claire des responsabilités
- ✅ Maintenabilité et scalabilité

---

## 🚀 Scripts disponibles

### Tests

```bash
npm test             # Suite complète (52/52 ✅)
npm run test:watch   # Tests en mode watch
npm run test:coverage # Tests avec couverture
npm run test:unit    # Tests unitaires uniquement
npm run test:integration # Tests d'intégration uniquement
```

### Qualité

```bash
npm run lint         # ESLint
npm run lint:fix     # ESLint avec correction auto
npm run format       # Prettier
npm run type-check   # Vérification TypeScript
npm run quality      # Lint + Format + Type-check combinés
```

### Développement

```bash
npm run dev          # Frontend (Vite) + Backend (Express) en parallèle
npm run dev:frontend # Frontend seul (Vite dev server)
npm run dev:backend  # Backend seul (Express + nodemon)
npm run preview      # Preview build production
```

### Base de données

```bash
npm run db:migrate   # Exécuter migrations
npm run db:seed      # Données de test
npm run db:reset     # Reset complet
```

---

## 📄 Liens importants

- [PRD](../src/prd.md) — Spécifications produit
- [ROADMAP](ROADMAP.md) — Feuille de route
- [LINTING](LINTING.md) — Configuration ESLint et bonnes pratiques
- [Tests](../tests/README.md) — Infra de tests
- [SECURITY](../SECURITY.md) — Politique de sécurité
- [Structure DB](../backend/database/docs/database-structure.md) — Tables et relations

---

## 📚 Ressources de référence

### Frontend

#### React + TypeScript

- Documentation officielle React TypeScript : https://fr.react.dev/learn/typescript
- Guide détaillé 2025 : https://blog.espero-soft.com/bonnes-pratiques-dans-reactjs-en-2025-guide-detaille/
- Meilleures pratiques React : https://kinsta.com/fr/blog/meilleures-pratiques-react/
- Évolution React 2025 : https://fr.sourcetrail.com/javascript/dernières-évolutions--fonctionnalités-et-tendances-de-React-pour-2025/

#### Styling - Tailwind CSS + Radix UI

- Documentation Tailwind CSS : https://tailwindcss.com/docs/installation
- Radix UI Documentation : https://www.radix-ui.com/primitives/docs/overview/introduction
- Shadcn/ui (basé sur Radix + Tailwind) : https://ui.shadcn.com/

#### Build - Vite

- Documentation officielle Vite : https://vitejs.dev/guide/
- Vite avec React : https://vitejs.dev/guide/features.html#jsx

#### Tests - Jest + React Testing Library

- React Testing Library : https://testing-library.com/docs/react-testing-library/intro/
- Jest Documentation : https://jestjs.io/docs/getting-started
- Guide testing React : https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

#### Icons - Phosphor Icons

- Phosphor Icons React : https://phosphoricons.com/
- GitHub Phosphor React : https://github.com/phosphor-icons/react

### Backend

#### Express.js

- Documentation officielle Express.js : https://expressjs.com/
- Guide sécurité Express : https://expressjs.com/en/advanced/best-practice-security.html
- Meilleures pratiques Express : https://expressjs.com/en/advanced/best-practice-performance.html

#### Base de données - SQLite + better-sqlite3

- better-sqlite3 GitHub : https://github.com/WiseLibs/better-sqlite3
- Documentation SQLite : https://sqlite.org/docs.html
- SQLite Tutorial : https://www.sqlitetutorial.net/

#### API externe - BoardGameGeek XML API

- Documentation BGG API : https://boardgamegeek.com/wiki/page/BGG_XML_API2
- Guide d'utilisation BGG API : https://boardgamegeek.com/thread/909209/xml-api-terms-use

---

## 💡 Exemples de réponses attendues

### Format de modification de fichier

```typescript
// ✅ Exemple attendu
interface GameCharacter {
  id: string
  name: string
  classType?: string
  description?: string
  abilities?: string[]
  imageUrl?: string
  source?: 'manual' | 'api_boardgamegeek' | string
  externalId?: string
  createdAt?: string
}

interface GameSession {
  id: string
  gameId: number
  players: Player[]
  startedAt: Date
  completedAt?: Date
}

// ❌ À éviter
const gameData: any = {
  /* ... */
}
```

### Structure de documentation pour nouveaux modules

````typescript
/**
 * Service de gestion des sessions de jeu
 * @description Gère le cycle de vie des parties de jeux de société
 * @example
 * ```typescript
 * const character: GameCharacter = {
 *   id: "brute",
 *   name: "Brute",
 *   classType: "Tank",
 *   description: "Personnage robuste, encaisse les dégâts.",
 *   abilities: ["Shield", "Taunt"],
 *   imageUrl: "/images/brute.png",
 *   source: "manual",
 *   createdAt: "2025-08-31T12:00:00Z"
 * };
 * const session = await GameSessionService.create({
 *   gameId: 174430,
 *   players: [player1, player2],
 *   characters: [character]
 * });
 * ```
 */
export class GameSessionService {
  // ...
}
````

### Style de commit conventionnel

```bash
feat: add game session management
fix: resolve BGG API timeout issues
docs: update API documentation
test: add unit tests for GameService
refactor: optimize database queries
perf: improve BGG API response caching
```

---

## 🔄 Workflow de développement attendu

### 1. Avant toute modification

- Analyser l'impact sur l'architecture existante
- Vérifier la compatibilité avec les versions des dépendances
- Identifier les tests nécessaires
- Vérifier la cohérence des types entre frontend, backend et BDD (exemple : GameCharacter[])

### 2. Pendant le développement

- Respecter la structure modulaire
- Appliquer les patterns établis
- Documenter les choix techniques complexes
- Synchroniser les types et les interfaces sur toute la chaîne de données

### 3. Après modification

- Proposer les tests associés
- Suggérer la migration DB si nécessaire
- Vérifier la conformité qualité

---

## 🕐 Mise à jour du contexte

- **Version** : 2025-08-31
- **Mainteneur** : thibaud200
- **Dernière mise à jour** : 31 août 2025
- **Prochaine révision** : À définir selon l'évolution du projet

---

**Note IA** : Ce contexte doit être respecté intégralement. Toute suggestion non conforme à ces règles sera rejetée.
