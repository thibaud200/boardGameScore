# 📚 Documentation Technique de Référence - Board Game Score Tracker

## 📋 Vue d'ensemble

Ce document centralise toutes les références vers les documentations officielles des technologies utilisées dans le projet, avec les mots-clés spécifiques et leurs relations.

**🎯 Objectif :** Fournir un point d'entrée unique vers toutes les ressources externes nécessaires au développement et à la maintenance du projet.

---

## 🔧 Technologies Frontend

### ⚛️ React 19

**Documentation officielle :** https://react.dev/

**Mots-clés du projet :**

- `useState`, `useEffect`, `useCallback` - Hooks de gestion d'état
- `JSX` - Syntaxe JavaScript étendue
- `components` - Composants fonctionnels
- `props`, `children` - Propriétés des composants
- `React.StrictMode` - Mode strict pour détecter les problèmes

**Utilisé dans :**

- `src/pages/*.tsx` - Pages principales de l'application
- `src/components/*.tsx` - Composants réutilisables
- `src/main.tsx` - Point d'entrée de l'application

**Liens spécifiques :**

- Hooks API : https://react.dev/reference/react
- JSX Transform : https://react.dev/blog/2020/09/22/introducing-the-new-jsx-transform
- React 19 Features : https://react.dev/blog/2024/04/25/react-19

### 🧭 React Router 7

**Documentation officielle :** https://reactrouter.com/

**Mots-clés du projet :**

- `BrowserRouter` - Routeur principal
- `Routes`, `Route` - Définition des routes
- `useParams`, `useNavigate` - Hooks de navigation
- `Link` - Navigation déclarative
- `useLocation` - Accès à l'URL courante

**Utilisé dans :**

- `src/main.tsx` - Configuration des routes
- `src/components/Layout.tsx` - Navigation globale
- `src/pages/*.tsx` - Navigation entre pages

**Liens spécifiques :**

- Router API : https://reactrouter.com/en/main/routers/browser-router
- Hooks Reference : https://reactrouter.com/en/main/hooks/use-navigate

### 🎨 Tailwind CSS 4

**Documentation officielle :** https://tailwindcss.com/

**Mots-clés du projet :**

- `className` - Application des classes utilitaires
- `@tailwindcss/forms` - Plugin pour les formulaires
- `responsive`, `hover`, `focus` - États interactifs
- `grid`, `flex` - Layouts
- `bg-`, `text-`, `border-` - Couleurs et styles

**Configuration :**

- `tailwind.config.js` - Configuration principale
- `postcss.config.cjs` - Intégration PostCSS

**Liens spécifiques :**

- Installation : https://tailwindcss.com/docs/installation
- Utility Classes : https://tailwindcss.com/docs/utility-first
- Forms Plugin : https://github.com/tailwindlabs/tailwindcss-forms

### ⚡ Vite 7

**Documentation officielle :** https://vitejs.dev/

**Mots-clés du projet :**

- `defineConfig` - Configuration Vite
- `@vitejs/plugin-react` - Plugin React
- `HMR` - Hot Module Replacement
- `import.meta.env` - Variables d'environnement
- `vite-env.d.ts` - Types TypeScript

**Configuration :**

- `vite.config.ts` - Configuration principale

**Liens spécifiques :**

- Config Reference : https://vitejs.dev/config/
- React Plugin : https://github.com/vitejs/vite-plugin-react
- Environment Variables : https://vitejs.dev/guide/env-and-mode.html

### 📘 TypeScript 5

**Documentation officielle :** https://www.typescriptlang.org/

**Mots-clés du projet :**

- `interface`, `type` - Définition de types
- `export`, `import` - Modules ES6
- `React.ReactElement`, `React.ReactNode` - Types React
- `useState<Type>`, `useEffect` - Hooks typés
- `as`, `typeof` - Assertions de type

**Configuration :**

- `tsconfig.json` - Configuration principale
- `tsconfig.eslint.json` - Configuration pour ESLint

**Types spécifiques :**

- `src/types/index.ts` - Types métier
- `src/types/bgg.types.ts` - Types BoardGameGeek

**Liens spécifiques :**

- Handbook : https://www.typescriptlang.org/docs/
- React TypeScript : https://react-typescript-cheatsheet.netlify.app/

---

## 🔧 Technologies Backend

### 🌐 Express.js 5

**Documentation officielle :** https://expressjs.com/

**Mots-clés du projet :**

- `app.get()`, `app.post()`, `app.put()`, `app.delete()` - Routes HTTP
- `req.body`, `req.params`, `req.query` - Données de requête
- `res.json()`, `res.status()` - Réponses HTTP
- `middleware` - Fonctions intermédiaires
- `express.json()` - Parser JSON
- `CORS` - Cross-Origin Resource Sharing

**Utilisé dans :**

- `backend/src/server.ts` - Serveur principal
- API routes pour toutes les entités

**Liens spécifiques :**

- Express 5 Guide : https://expressjs.com/en/5x/api.html
- Routing : https://expressjs.com/en/guide/routing.html
- Middleware : https://expressjs.com/en/guide/using-middleware.html

### 🗄️ SQLite + better-sqlite3

**Documentation SQLite :** https://sqlite.org/docs.html **Documentation better-sqlite3 :** https://github.com/WiseLibs/better-sqlite3

**Mots-clés du projet :**

- `Database()` - Connexion à la base
- `.prepare()` - Requêtes préparées
- `.run()`, `.get()`, `.all()` - Exécution de requêtes
- `INTEGER`, `TEXT`, `BOOLEAN`, `DATETIME` - Types de données
- `PRIMARY KEY`, `FOREIGN KEY` - Contraintes
- `CREATE TABLE`, `INSERT`, `UPDATE`, `DELETE` - SQL DDL/DML

**Utilisé dans :**

- `backend/src/initDatabase.ts` - Initialisation de la base
- `backend/src/services/*.ts` - Services de données

**Spécificités du projet :**

- Conversion booléens : `true/false` → `1/0`
- Gestion des `null` vs `undefined`
- Données JSON stockées comme `TEXT`

**Liens spécifiques :**

- SQLite Tutorial : https://www.sqlitetutorial.net/
- better-sqlite3 API : https://github.com/WiseLibs/better-sqlite3/blob/HEAD/docs/api.md

### 🎲 BoardGameGeek API

**Documentation officielle :** https://boardgamegeek.com/wiki/page/BGG_XML_API2

**Mots-clés du projet :**

- `xml2js` - Parser XML
- `node-fetch` - Client HTTP
- BGG endpoints : `/search`, `/thing`
- Rate limiting, cache TTL
- XML → JSON conversion

**Utilisé dans :**

- `backend/src/services/bggService.ts` - Service BGG

**Liens spécifiques :**

- API Terms : https://boardgamegeek.com/thread/909209/xml-api-terms-use
- xml2js : https://github.com/Leonidas-from-XIV/node-xml2js

---

## 🧪 Technologies de Test

### 🏃 Vitest

**Documentation officielle :** https://vitest.dev/

**Mots-clés du projet :**

- `describe`, `it`, `expect` - Structure des tests
- `beforeEach`, `afterEach` - Setup/teardown
- `vi.mock()` - Mocking
- `test.concurrent` - Tests parallèles
- `testTimeout` - Configuration timeout

**Utilisé dans :**

- `__tests__/backend/*.test.ts` - Tests unitaires
- `__tests__/integration/*.test.ts` - Tests d'intégration

**Configuration :**

- `vite.config.ts` - Configuration des tests

**Liens spécifiques :**

- API Reference : https://vitest.dev/api/
- Mocking : https://vitest.dev/guide/mocking.html

### 🌐 Supertest

**Documentation officielle :** https://github.com/ladjs/supertest

**Mots-clés du projet :**

- `request(app)` - Requêtes de test
- `.get()`, `.post()`, `.put()`, `.delete()` - Méthodes HTTP
- `.send()` - Corps de requête
- `.expect()` - Assertions de réponse
- `.status()` - Code de statut

**Utilisé dans :**

- Tests d'intégration des APIs

**Liens spécifiques :**

- Supertest README : https://github.com/ladjs/supertest#readme

### 📊 Test Fixtures

**Mots-clés du projet :**

- `wipeAllFixtures()` - Nettoyage base de test
- `injectFixtures()` - Injection de données
- `playersFixture`, `gamesFixture` - Données de test
- Isolation des tests

**Utilisé dans :**

- `__tests__/fixtures/*.ts` - Données de test

---

## 🔍 Outils de Qualité de Code

### 🔎 ESLint 9

**Documentation officielle :** https://eslint.org/

**Mots-clés du projet :**

- `eslint.config.cjs` - Configuration flat
- `@typescript-eslint` - Plugin TypeScript
- `eslint-plugin-react` - Plugin React
- `eslint-plugin-react-hooks` - Plugin hooks React
- `eslint-plugin-prettier` - Intégration Prettier
- `no-explicit-any`, `react-hooks/exhaustive-deps` - Règles spécifiques

**Scripts disponibles :**

```bash
npm run lint        # Vérification complète
npm run lint:fix    # Correction automatique
npm run lint:frontend # Frontend uniquement
npm run lint:backend  # Backend uniquement
```

**Liens spécifiques :**

- ESLint 9 Config : https://eslint.org/docs/latest/use/configure/configuration-files
- TypeScript ESLint : https://typescript-eslint.io/
- React ESLint : https://github.com/jsx-eslint/eslint-plugin-react

### 🎨 Prettier 3

**Documentation officielle :** https://prettier.io/

**Mots-clés du projet :**

- `.prettierrc.cjs` - Configuration
- `printWidth`, `tabWidth`, `singleQuote` - Options de formatage
- Auto-formatage sur sauvegarde

**Configuration :**

```javascript
printWidth: 80,
tabWidth: 2,
singleQuote: true,
semi: false
```

**Liens spécifiques :**

- Configuration : https://prettier.io/docs/en/configuration.html
- Options : https://prettier.io/docs/en/options.html

### 🔧 Husky 9 + Commitlint

**Documentation Husky :** https://typicode.github.io/husky/ **Documentation Commitlint :** https://commitlint.js.org/

**Mots-clés du projet :**

- Pre-commit hooks
- Conventional commits : `feat:`, `fix:`, `docs:`
- `commitlint.config.cjs`

**Liens spécifiques :**

- Conventional Commits : https://www.conventionalcommits.org/

---

## 📁 Structure et Patterns

### 🏗️ Architecture en Services

**Pattern utilisé :** Service Layer Pattern

**Structure :**

```
backend/src/services/
├── playerService.ts      # CRUD joueurs
├── gameService.ts        # CRUD jeux
├── gameSessionService.ts # Sessions de jeu
├── currentGameService.ts # Partie en cours
├── statsService.ts       # Statistiques
└── bggService.ts         # API externe BGG
```

**Mots-clés :**

- `getAllX()`, `getXById()` - Récupération
- `createX()`, `updateX()` - Création/modification
- `deleteX()` - Suppression
- Interfaces `XInput` - Types d'entrée
- Validation des données

### 🎛️ State Management Frontend

**Pattern utilisé :** Local State with Custom Hooks

**Mots-clés :**

- `useState` - État local
- `useEffect` - Effets de bord
- `useCallback` - Optimisation re-renders
- Service calls dans les composants

**Structure :**

```
src/
├── pages/           # Pages avec état
├── components/      # Composants réutilisables
├── services/        # API calls
└── types/           # Types TypeScript
```

---

## 🔗 Relations entre Technologies

### Frontend → Backend

```
React Components → Services → Express Routes → SQLite Database
     ↓               ↓            ↓              ↓
  useState        fetch()      app.get()     db.prepare()
  useEffect     try/catch    res.json()      .get()/.all()
```

### Testing Flow

```
Vitest → Supertest → Express App → Test Database
   ↓        ↓           ↓             ↓
describe  request()   routes      fixtures
   it      .expect()   handlers    isolated data
expect     .status()   responses
```

### Quality Assurance

```
TypeScript → ESLint → Prettier → Git Hooks → CI/CD
     ↓         ↓         ↓          ↓         ↓
  Compile   Rules    Format    Pre-commit  Pipeline
  Errors   Check    Fix       Block       Gates
```

---

## 🛠️ Scripts de Développement

### Scripts Principal

```bash
npm run dev          # Frontend + Backend parallèle
npm run dev:frontend # Vite dev server (port 5173)
npm run dev:backend  # Express server (port 3001)
npm run build        # Build production
npm run preview      # Preview build
```

### Scripts Qualité

```bash
npm run lint         # ESLint complet
npm run lint:fix     # Auto-fix ESLint
npm run format       # Prettier
npm run test         # Tests Vitest (33 tests)
npm run test:watch   # Tests en mode watch
```

### Scripts Base de Données

```bash
# Initialisation manuelle si nécessaire
node backend/src/initDatabase.ts     # Base production
node backend/src/initTestDatabase.ts # Base de test
```

---

## 📚 Ressources Additionnelles

### Documentation du Projet

- `README.md` - Guide principal
- `docs/backend/API_DOC.md` - Documentation API
- `backend/database/docs/database-structure.md` - Schéma DB
- `docs/general/LINTING.md` - Guide linting complet

### Outils de Développement

- **VS Code Extensions recommandées :**
  - ESLint
  - Prettier
  - TypeScript Importer
  - Tailwind CSS IntelliSense

### Performance et Monitoring

- **Vite Dev Tools** : HMR, Build analyzer
- **React DevTools** : Component tree, hooks
- **SQLite Browser** : DB inspection

---

## ⚠️ Notes Importantes

### Types JavaScript ↔ SQLite

```typescript
// ❌ Problème
boolean → SQLite   // Erreur
undefined → SQLite // Erreur

// ✅ Solution
boolean ? 1 : 0    // Pour SQLite
value ?? null      // undefined → null
```

### Gestion des Erreurs

```typescript
// Pattern uniforme dans tout le projet
try {
  const result = await service.method()
  setState(result)
} catch (error) {
  setError('Message utilisateur')
  console.error('Debug info:', error)
}
```

### Testing Best Practices

```typescript
// Isolation des tests
beforeEach(async () => {
  await wipeAllFixtures(db)
})

// Tests descriptifs
describe('Service method', () => {
  it('should handle expected case', () => {
    // Arrange, Act, Assert
  })
})
```

---

_Cette documentation est maintenue automatiquement et reflète l'état actuel des technologies utilisées dans le projet._

**Dernière mise à jour :** 2 septembre 2025  
**Version des technologies :** React 19, Express.js 5, TypeScript 5, Vite 7, ESLint 9
