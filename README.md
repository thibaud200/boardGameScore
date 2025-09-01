# Board Game Score Tracker

Application web pour gérer les parties de jeux de société, suivi multi-modes, gestion des personnages, statistiques avancées, et intégration BoardGameGeek.

![Screenshot](assets/screenshot.png)

## About

Board Game Score Tracker propose une stack moderne, des outils de qualité et une structure modulaire pour le suivi des jeux de société.

## Libraries

- **Node 24**
- **React 19**
- **React Router 6**
- **Tailwind CSS 3.4** (+ forms plugin)
- **TypeScript 5.x**
- **Vite 7**
- **Vitest**
- **Express.js 5** (backend)
- **better-sqlite3** (SQLite 3.x)
- **Radix UI**
- **Phosphor Icons React**

## Tools

- **Commitlint 19**
- **Conventional Commits**
- **EditorConfig**
- **ESLint 8**
- **Prettier 3**
- **Husky 8**
- **VS Code settings**


## Documentation API

Consultez la documentation complète des endpoints backend ici : [API_DOC.md](./API_DOC.md)

## Tests automatisés

Consultez la documentation des tests backend ici : [__tests__/backend/README.md](./__tests__/backend/README.md)

## Project Structure

```
boardGameScore/
├── assets/                # Images, screenshots
├── backend/
│   ├── database/
│   │   └── docs/
│   │       └── database-structure.md  # Documentation complète de la base
│   ├── src/
│   │   └── server.ts      # Serveur Express principal
│   └── tsconfig.json
├── src/                   # Frontend React + TypeScript
│   ├── App.tsx
│   ├── main.tsx
│   └── ...                # Styles, assets, etc.
├── __tests__/             # Tests unitaires
├── .husky/                # Hooks Git
├── .editorconfig
├── .prettierrc.cjs
├── commitlint.config.cjs
├── eslint.config.cjs
├── package.json
├── README.md
└── CONTEXT.md             # Règles IA et standards projet
```

## Usage

```bash
npm install
npm run dev
npm run test
```

![](assets/template-usage.png)

## Scripts

- `npm run dev` : Démarrage frontend/backend
- `npm run lint` : Vérification ESLint
- `npm run format` : Formatage Prettier
- `npm run test` : Tests unitaires
- `npm run build` : Build production

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
