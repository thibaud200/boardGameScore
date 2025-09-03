# 🎯 Board Game Score Tracker

## 🚀 Project Status

### ✅ Complete Infrastructure

- [docs/README.md](docs/README.md): Complete navigation index

### 🎯 Development Rules

- **No `any` type**: Strict TypeScript applied
- **Frontend/backend separation**: REST APIs only
- **Mandatory modularity**: Separate services, components, types
- **Mandatory tests**: 100% critical coverage
- **DB migrations**: Any change requires a migration
- **Validation**: Inputs validated on backend
- **Documentation**: Updated with every feature

### � Quality Tools

- **EditorConfig**: Uniform formatting (LF, UTF-8, 2 spaces)
- **Prettier**: Automatic code formatting
- **ESLint**: Strict linting (React, TypeScript, Hooks)
- **Husky**: Git hooks (pre-commit, commit-msg)
- **Commitlint**: Mandatory conventional messages

### � Commit Conventions

```
│   │   ├── database.ts        # SQLite config
│   │   ├── server.ts          # Express server
│   │   └── init*.ts           # Init scripts
│   ├── database/
│   │   ├── database.db        # Production DB
│   │   ├── test.db           # Test DB
│   │   └── docs/
```

## Correction History

### �️ Recent Fixes (September 2025)

- **Line endings**: Normalized CRLF → LF for lint compatibility
- **TypeScript config**: moduleResolution `bundler` for React Router 7
- **PostCSS**: Migration to @tailwindcss/postcss for Tailwind v4
- **ESLint**: Fixed unescaped characters and empty interfaces
- **CI/CD**: Functional GitHub Actions pipeline with npm
- **Build**: Optimized production builds without errors

### ✅ Current State

- **0 ESLint errors** on the whole project → [Linting Documentation](docs/LINTING.md)
- **33/33 tests** pass serially
- **Production build** functional
- **CI/CD pipeline** green on GitHub Actions
- **Frontend architecture** ready for CRUD development

## Documentation

### 📚 References

- **[docs/README.md](docs/README.md)**: Complete navigation index
- **[docs/general/CONTEXT.md](docs/general/CONTEXT.md)**: IA rules, standards, workflow
- **[docs/general/DEVELOPMENT_GUIDELINES.md](docs/general/DEVELOPMENT_GUIDELINES.md)**: Best practices guide
- **[docs/general/LINTING.md](docs/general/LINTING.md)**: ESLint configuration and best practices
- **[docs/general/TECHNICAL_STATE.md](docs/general/TECHNICAL_STATE.md)**: Technical state & full configuration
- **[docs/backend/database-structure.md](docs/backend/database-structure.md)**: Complete DB structure
- **[docs/backend/API_DOC.md](docs/backend/API_DOC.md)**: REST endpoints documentation
- **[docs/general/ROADMAP.md](docs/general/ROADMAP.md)**: Feature roadmap

### ⚠️ Development Notes

- **SQLite types**: Boolean conversion → integers (see [DEVELOPMENT_GUIDELINES.md](docs/general/DEVELOPMENT_GUIDELINES.md))
- **Null/undefined values**: Specific JavaScript ↔ SQLite handling
- **React forms**: Default values required for inputs

### � Maintenance

- **Tests**: Automatically run on every commit
- **Linting**: Checked before every commit via Husky
- **Documentation**: Updated with every feature
- **Migrations**: Versioned and documented
- **Dependencies**: Regular security audit
- **Test types**:
  - API integration tests (22 tests)
  - Service unit tests (11 tests)
- **Isolation**: Separate test DB with automatic fixtures
- **CI/CD**: Husky blocks commits if tests or lint fail
- **Configuration**: Serial tests (`singleFork: true`) to eliminate concurrency conflicts
- **Main DB**: `backend/database/database.db` - Production DB with full schema
- **Test DB**: `backend/database/test.db` - Isolated DB for automated tests
- **Automatic selection**: System chooses the right DB based on environment
- **Fixtures**: Test data injection system with consistent FKs
- **Tests**: 33/33 tests pass with full DB isolation

### Database Initialization

```bash
# Main database (production)
node backend/src/initDatabase.ts

# Test database (development)
node backend/src/initTestDatabase.ts
```

The complete structure, tables, relations, and migrations are documented at:  
➡️ [backend/database/docs/database-structure.md](backend/database/docs/database-structure.md)

# Board Game Score Tracker

Web application to manage board game sessions, multi-mode tracking, character management, advanced statistics, and BoardGameGeek integration.

![Screenshot](assets/screenshot.png)

## ✅ Project State - September 2025

│ │ └── database-structure.md │ └── tsconfig.json ├── 📁 **tests**/ # Automated tests │ ├── integration/ # 22 API integration tests │ ├── backend/ # 11 unit tests │ └── fixtures/ # Test data ├── 📁 .github/ │ └── workflows/ │ └── ci.yml # GitHub Actions pipeline ├── 📁 .husky/ # Git hooks ├── 📄 Configuration │ ├── .editorconfig │ ├── .prettierrc.cjs │ ├── commitlint.config.cjs │ ├── eslint.config.cjs │ ├── postcss.config.cjs # Tailwind CSS 4 config │ ├── tailwind.config.js │ ├── tsconfig.json # TypeScript config │ └── vite.config.ts ├── 📄 Documentation │ ├── README.md # This file │ └── docs/ # Organized technical docs │ ├── README.md # Navigation index │ ├── backend/ # Backend docs │ │ ├── API_DOC.md # REST endpoints │ │ └── database-structure.md # DB schema │ ├── frontend/ # Frontend docs │ │ └── (coming soon) │ └── general/ # General docs │ ├── CONTEXT.md # Standards and IA rules │ ├── ARCHITECTURE.md # SOLID principles │ ├── DEVELOPMENT_GUIDELINES.md # Dev guide │ ├── LINTING.md # ESLint & quality config │ ├── ROADMAP.md # Roadmap │ └── TECHNICAL_STATE.md # Technical state & config └── package.json

````

## CI/CD Pipeline

### 🚀 GitHub Actions

```yaml
name: CI
on: [push, pull_request]
jobs:
  lint: # ESLint on src, backend/src, __tests__
  build: # npm run build (Vite + TypeScript)
  test: # npm test (33 Vitest tests)
````

### 🔒 Quality Gates

- **Husky hooks**: Lint + tests before commit
- **Commitlint**: Conventional commit messages
- **Mandatory pipeline**: All jobs must pass
- **No errors tolerated**: 0 ESLint warnings

## Database Initialization

### 🗄️ Initialization Scripts

```bash
# Main database (production)
node backend/src/initDatabase.ts

# Test database (development)
node backend/src/initTestDatabase.ts
```

### 📊 Automatic Fixtures

- **Consistent data**: Automatic FKs, realistic timestamps
- **Players**: Alice, Bob with histories
- **Games**: Catan, 7 Wonders with metadata
- **Sessions**: Games with scores and statistics
- **Relations**: Characters, extensions, cross stats

Full structure documented at:  
➡️ [backend/database/docs/database-structure.md](backend/database/docs/database-structure.md)

![](assets/template-usage.png)

## 🚀 Getting Started

### ⚡ Quick Start (Recommended)

```bash
# Clone and install
git clone https://github.com/thibaud200/boardGameScore.git
cd boardGameScore
npm install

# Full start (frontend + backend)
npm run dev:full
# ➡️ Frontend: http://localhost:5173
# ➡️ Backend: http://localhost:3001
```

### 🔧 Separate Start

#### Frontend only

```bash
npm run dev
# ➡️ http://localhost:5173
```

#### Backend only

```bash
npm run dev:backend
# ➡️ http://localhost:3001
# Shows: "Server running on port 3001"
```

#### Manual backend start

```bash
cd backend
npm install
tsx src/server.ts
# ➡️ Database initialized automatically
```

### ✅ Backend Startup Verification

Backend server displays on startup:

```
Database initialized with schema.
Server running on port 3001
```

**Connectivity tests:**

```bash
# Test Players API
curl http://localhost:3001/api/players
# Response: [] (empty list)

# BGG integration test
curl "http://localhost:3001/api/bgg/search?q=Catan"
# Response: JSON with BGG results
```

## Scripts

- `npm run dev`: Start frontend/backend in development mode
- `npm run lint`: ESLint check (no errors)
- `npm run format`: Automatic Prettier formatting
- `npm run test`: **33/33 tests passing** ✅
- `npm run build`: Optimized production build

## Database

### Database Initialization

Two scripts initialize the SQLite databases:

- **Main database**: `node backend/src/initDatabase.ts` creates/initializes the real database (`database.db`) with the full schema.
- **Test database**: `node backend/src/initTestDatabase.ts` creates/initializes a dedicated test database (`test.db`) with the same schema.

Full structure, tables, relations, migrations, and queries are documented at: ➡️ [backend/database/docs/database-structure.md](backend/database/docs/database-structure.md)

## Standards & Constraints

- No `any` type
- Strict frontend/backend separation
- Mandatory modularity and tests
- Migrations for any DB change
- Systematic validation and security
- Up-to-date documentation (CONTEXT.md, database-structure.md, README.md)
- Commit conventions and quality scripts

## Documentation

- [CONTEXT.md](CONTEXT.md): IA rules, standards, workflow
- [backend/database/docs/database-structure.md](backend/database/docs/database-structure.md): DB structure
- [commitlint.config.cjs](commitlint.config.cjs): Commit convention
- [eslint.config.cjs](eslint.config.cjs): Linting
- [.prettierrc.cjs](.prettierrc.cjs): Formatting

## Tests

- **Vitest**: Backend/frontend unit tests
- **Coverage**: >80% required
- **Husky**: Prevents commits if tests or lint fail

---

## Translated continuation

- **Backend**: 100% functional with 33/33 passing tests ✅
- **REST API**: 10 endpoints with full validation ✅
- **Database**: SQLite with complete schema and fixtures ✅
- **Integration Tests**: Full coverage of endpoints ✅
- **Unit Tests**: All backend services tested ✅
- **Frontend**: Architecture in place, functional dashboard ✅
- **CI/CD**: Functional GitHub Actions pipeline ✅
- **Linting**: No ESLint errors ✅
- **Build**: Production builds without errors ✅

## About

Board Game Score Tracker offers a modern stack, quality tools, and modular structure for board game tracking.

## Technical Stack

### Frontend

- **React 19** with TypeScript 5.x
- **React Router 7** for navigation
- **Tailwind CSS 4** with @tailwindcss/forms
- **Vite 7** as bundler
- **API client** with robust error handling

### Backend

- **Node.js 24** with Express.js 5
- **Strict TypeScript 5.x**
- **better-sqlite3** for SQLite
- **Modular service architecture**

### Development Tools

- **Vitest** for testing
- **ESLint 9** + Prettier 3 for code quality
- **Husky 9** + Commitlint for Git conventions
- **GitHub Actions** for CI/CD

## Frontend Architecture

### 📁 Structure

```
src/
├── components/          # Reusable components
│   └── Layout.tsx      # Main layout with navigation
├── pages/              # Application pages
│   └── Dashboard.tsx   # Home page with statistics
├── services/           # API services
│   ├── apiClient.ts    # HTTP client with error handling
│   ├── playersService.ts
│   └── gamesService.ts
├── types/              # TypeScript types
│   └── index.ts        # Complete interfaces (Player, Game, etc.)
├── main.tsx           # Entry point with React Router
└── index.css          # Tailwind styles
```

### 🎯 Implemented Pages ✅

- **Dashboard**: Overview with real-time statistics
- **Players**: Full CRUD (list, create, edit, delete)
- **Games**: Full CRUD with BoardGameGeek integration
- **Layout**: Responsive navigation with main menu

### 🔗 API Integration ✅

- Robust HTTP client with error handling
- Typed services for each backend endpoint
- TypeScript types synchronized with the database
- **BoardGameGeek Integration**: Search, auto-import, smart cache

## Backend Architecture

### 📁 Structure

```
backend/
├── src/
│   ├── services/           # Business services (10 modules)
│   ├── database.ts         # SQLite configuration
│   └── server.ts          # Express server
└── database/
    ├── database.db         # Production database
    ├── test.db            # Test database
    └── docs/
        └── database-structure.md
```

### 🚀 API Endpoints (10) ✅

- **Players**: Full CRUD + statistics
- **Games**: Game management with BGG metadata
- **Game Sessions**: Game sessions with scores
- **Game Characters**: Characters per game
- **Game Extensions**: Extensions/DLC
- **Game Stats**: Game statistics
- **BGG Service**: BoardGameGeek integration (search, import, cache)
- **Player Stats**: Player statistics
- **Player Game Stats**: Cross player/game stats
- **Current Game**: Ongoing game

## API Documentation

See full backend endpoint documentation here: [docs/API_DOC.md](./docs/API_DOC.md)

## Automated Tests

✅ **Status: 33/33 tests passing** (September 2025)

### 🧪 Test Types

- **API integration tests**: 22 tests covering all endpoints
- **Backend unit tests**: 11 tests for all services
- **Coverage**: 100% of critical features
- **Isolation**: Serial tests to avoid SQLite conflicts
- **Fixtures**: Automatic injection system with consistent FKs

### 🔧 Configuration

- **Framework**: Vitest with `singleFork: true`
- **Separate databases**: `database.db` (prod) / `test.db` (tests)
- **Automatic fixtures**: Injection of consistent data
- **CI/CD**: Mandatory tests before merge

### 📊 Service Details

- **Players**: 5 tests (CRUD + validation)
- **Game Sessions**: 4 tests (creation + relations)
- **All other services**: 2 tests each (get + create)

See detailed documentation: [**tests**/backend/README.md](./__tests__/backend/README.md)

## Configuration and Standards

### 🔧 Build & Development

```bash
# Installation
npm install

# Development (frontend + backend)
npm run dev

# Tests (all tests)
npm test

# Production build
npm run build

# Linting (no errors)
npm run lint

# Automatic formatting
npm run format
```

### 📋 TypeScript Configuration

- **moduleResolution**: `bundler` (React Router 7 compatibility)
- **target**: `ESNext`
- **strict**: `true`
- **skipLibCheck**: `true`

### 🎨 ESLint/Prettier Configuration

- **ESLint 9** with flat config
- **Prettier 3** with automatic formatting
- **Strict rules**: React, TypeScript, Hooks
- **Format on save** enabled

## Project Structure

```
boardGameScore/
├── 📁 src/                     # Frontend React + TypeScript
│   ├── components/
│   │   └── Layout.tsx          # Layout with navigation
│   ├── pages/
│   │   └── Dashboard.tsx       # Home page
│   ├── services/
│   │   ├── apiClient.ts        # HTTP client
│   │   ├── playersService.ts   # Player service
│   │   └── gamesService.ts     # Game service
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   ├── main.tsx               # Entry point
│   └── index.css              # Tailwind styles
├── 📁 backend/
│   ├── src/
│   │   ├── services/          # 10 business services
│   │   ├── database.ts        # SQLite config
│   │   ├── server.ts          # Express server
│   │   └── init*.ts           # Init scripts
│   ├── database/
│   │   ├── database.db        # Production DB
│   │   ├── test.db           # Test DB
│   │   └── docs/
│   │       └── database-structure.md
│   └── tsconfig.json
├── 📁 __tests__/              # Automated tests
│   ├── integration/           # 22 API integration tests
│   ├── backend/              # 11 unit tests
│   └── fixtures/             # Test data
├── 📁 .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions pipeline
├── 📁 .husky/                # Git hooks
├── 📄 Configuration
│   ├── .editorconfig
│   ├── .prettierrc.cjs
│   ├── commitlint.config.cjs
│   ├── eslint.config.cjs
│   ├── postcss.config.cjs    # Tailwind CSS 4 config
│   ├── tailwind.config.js
│   ├── tsconfig.json         # TypeScript config
│   └── vite.config.ts
├── 📄 Documentation
│   ├── README.md             # This file
│   └── docs/                 # Organized technical docs
│       ├── README.md         # Navigation index
│       ├── backend/          # Backend docs
│       │   ├── API_DOC.md    # REST endpoints
│       │   └── database-structure.md # DB schema
│       ├── frontend/         # Frontend docs
│       │   └── (coming soon)
│       └── general/          # General docs
│           ├── CONTEXT.md    # Standards and IA rules
│           ├── ARCHITECTURE.md # SOLID principles
│           ├── DEVELOPMENT_GUIDELINES.md # Dev guide
│           ├── LINTING.md    # ESLint & quality config
│           ├── ROADMAP.md    # Roadmap
│           └── TECHNICAL_STATE.md # Technical state & config
└── package.json
```

## CI/CD Pipeline

### 🚀 GitHub Actions

```yaml
name: CI
on: [push, pull_request]
jobs:
  lint: # ESLint on src, backend/src, __tests__
  build: # npm run build (Vite + TypeScript)
  test: # npm test (33 Vitest tests)
```

### 🔒 Quality Gates

- **Husky hooks**: Lint + tests before commit
- **Commitlint**: Conventional commit messages
- **Mandatory pipeline**: All jobs must pass
- **No errors tolerated**: 0 ESLint warnings

## Database Initialization

### 🗄️ Initialization Scripts

```bash
# Main database (production)
node backend/src/initDatabase.ts

# Test database (development)
node backend/src/initTestDatabase.ts
```

### 📊 Automatic Fixtures

- **Consistent data**: Automatic FKs, realistic timestamps
- **Players**: Alice, Bob with histories
- **Games**: Catan, 7 Wonders with metadata
- **Sessions**: Games with scores and statistics
- **Relations**: Characters, extensions, cross stats

Full structure documented at:  
➡️ [backend/database/docs/database-structure.md](backend/database/docs/database-structure.md)

![](assets/template-usage.png)

## 🚀 Getting Started

### ⚡ Quick Start (Recommended)

```bash
# Clone and install
git clone https://github.com/thibaud200/boardGameScore.git
cd boardGameScore
npm install

# Full start (frontend + backend)
npm run dev:full
# ➡️ Frontend: http://localhost:5173
# ➡️ Backend: http://localhost:3001
```

### 🔧 Separate Start

#### Frontend only

```bash
npm run dev
# ➡️ http://localhost:5173
```

#### Backend only

```bash
npm run dev:backend
# ➡️ http://localhost:3001
# Shows: "Server running on port 3001"
```

#### Manual backend start

```bash
cd backend
npm install
tsx src/server.ts
# ➡️ Database initialized automatically
```

### ✅ Backend Startup Verification

Backend server displays on startup:

```
Database initialized with schema.
Server running on port 3001
```

**Connectivity tests:**

```bash
# Test Players API
curl http://localhost:3001/api/players
# Response: [] (empty list)

# BGG integration test
curl "http://localhost:3001/api/bgg/search?q=Catan"
# Response: JSON with BGG results
```

## Scripts

- `npm run dev`: Start frontend/backend in development mode
- `npm run lint`: ESLint check (no errors)
- `npm run format`: Automatic Prettier formatting
- `npm run test`: **33/33 tests passing** ✅
- `npm run build`: Optimized production build

## Database

### Database Initialization

Two scripts initialize the SQLite databases:

- **Main database**: `node backend/src/initDatabase.ts` creates/initializes the real database (`database.db`) with the full schema.
- **Test database**: `node backend/src/initTestDatabase.ts` creates/initializes a dedicated test database (`test.db`) with the same schema.

Full structure, tables, relations, migrations, and queries are documented at: ➡️ [backend/database/docs/database-structure.md](backend/database/docs/database-structure.md)

## Standards & Constraints

- No `any` type
- Strict frontend/backend separation
- Mandatory modularity and tests
- Migrations for any DB change
- Systematic validation and security
- Up-to-date documentation (CONTEXT.md, database-structure.md, README.md)
- Commit conventions and quality scripts

## Documentation

- [CONTEXT.md](CONTEXT.md): IA rules, standards, workflow
- [backend/database/docs/database-structure.md](backend/database/docs/database-structure.md): DB structure
- [commitlint.config.cjs](commitlint.config.cjs): Commit convention
- [eslint.config.cjs](eslint.config.cjs): Linting
- [.prettierrc.cjs](.prettierrc.cjs): Formatting

## Tests

- **Vitest**: Backend/frontend unit tests
- **Coverage**: >80% required
- **Husky**: Prevents commits if tests or lint fail
