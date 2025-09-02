# 📚 Documentation - Board Game Score Tracker

## 🗂️ Navigation

### 📄 **Documentation Générale**

- **[CONTEXT.md](general/CONTEXT.md)** - Règles IA, standards et workflow (✅ Mis à jour)
- **[ARCHITECTURE_COMPLETE.md](general/ARCHITECTURE_COMPLETE.md)** - Architecture, principes SOLID et état technique (✅ Consolidé)
- **[TECHNICAL_GUIDELINES.md](general/TECHNICAL_GUIDELINES.md)** - Bonnes pratiques techniques (✅ Renommé)
- **[LINTING.md](general/LINTING.md)** - Configuration ESLint et qualité code (✅ Mis à jour)
- **[TECHNICAL_STATE.md](general/TECHNICAL_STATE.md)** - État technique et configurations (✅ Mis à jour)
- **[ROADMAP.md](general/ROADMAP.md)** - Feuille de route et fonctionnalités (✅ Mis à jour)

### 🔌 **Documentation Backend**

- **[API_DOC.md](backend/API_DOC.md)** - Documentation complète des endpoints REST (✅ Mis à jour)
- **[database-structure.md](../backend/database/docs/database-structure.md)** - Structure complète de la base de données (✅ Mis à jour)

### ⚛️ **Documentation Frontend**

- **Components** : BGGSearch (intégration BoardGameGeek), Pages CRUD complètes
- **Services** : BGGService (API externe), PlayersService, GamesService
- **Types** : Interfaces TypeScript complètes (game.types.ts, bgg.types.ts)

---

## 🚀 Démarrage rapide

### Pour développeurs

1. **Commencer par** : [CONTEXT.md](general/CONTEXT.md) - Règles et standards (✅ Actualisé)
2. **Puis** : [TECHNICAL_GUIDELINES.md](general/TECHNICAL_GUIDELINES.md) - Bonnes pratiques techniques (✅ Renommé)
3. **Architecture** : [ARCHITECTURE_COMPLETE.md](general/ARCHITECTURE_COMPLETE.md) - Principes design et état technique (✅ Consolidé)

### Pour backend

1. **API** : [API_DOC.md](backend/API_DOC.md) - Tous les endpoints (✅ Actualisé)
2. **Base de données** : [database-structure.md](../backend/database/docs/database-structure.md) - Schéma complet (✅ Actualisé)

### Pour frontend

1. **État technique** : [TECHNICAL_STATE.md](general/TECHNICAL_STATE.md) - Configuration React/Vite (✅ Actualisé)
2. **Qualité** : [LINTING.md](general/LINTING.md) - ESLint et bonnes pratiques (✅ Actualisé)

---

## 📅 Dernière Mise à Jour : Septembre 2025

### ✅ Nouveautés Documentées

- **Frontend complet** : Pages Players et Games avec CRUD fonctionnel
- **Intégration BGG** : Service BoardGameGeek avec types TypeScript complets
- **Composants** : BGGSearch pour import automatique depuis BoardGameGeek
- **Types hybrides** : Gestion JavaScript ↔ SQLite (booléens, null/undefined)
- **UX optimisée** : Interface BGG conditionnelle, workflow de pré-remplissage
- **Documentation organisée** : Structure cohérente avec statuts de mise à jour

### 🎯 État Actuel

- **Backend** : 100% fonctionnel (33/33 tests ✅)
- **Frontend** : CRUD Players/Games complet avec intégration BGG
- **Documentation** : Complète et à jour
- **Qualité** : 0 erreurs ESLint, TypeScript strict

---

## 📋 Structure du projet

```
📁 docs/
├── 📄 README.md (ce fichier)
├── 📁 general/ (documentation transversale)
│   ├── ARCHITECTURE_COMPLETE.md (principes SOLID + état technique - ✅ Consolidé)
│   ├── CONTEXT.md
│   ├── TECHNICAL_GUIDELINES.md
│   ├── LINTING.md
│   └── ROADMAP.md
├── 📁 backend/ (documentation backend)
│   └── API_DOC.md
├── 📁 frontend/ (documentation frontend - ✅ Actualisé)
│   ├── components.md (BGGSearch, CRUD forms)
│   ├── services.md (BGGService, API clients)
│   └── types.md (TypeScript interfaces)
└── 📁 tests/ (documentation tests)
    └── TESTS_COMPLETE.md (progression, commandes, roadmap - ✅ Consolidé)
```

---

_Tous les documents sont interconnectés avec des références croisées pour une navigation fluide._
