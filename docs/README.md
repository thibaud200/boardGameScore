# 📚 Documentation - Board Game Score Tracker

## 🗂️ Navigation

### 📄 **Documentation Générale**
- **[CONTEXT.md](general/CONTEXT.md)** - Règles IA, standards et workflow (✅ Mis à jour)
- **[ARCHITECTURE.md](general/ARCHITECTURE.md)** - Principes SOLID et bonnes pratiques (✅ Mis à jour)
- **[DEVELOPMENT_GUIDELINES.md](general/DEVELOPMENT_GUIDELINES.md)** - Guide développement (✅ Mis à jour)
- **[LINTING.md](general/LINTING.md)** - Configuration ESLint et qualité code (✅ Mis à jour)
- **[TECHNICAL_STATE.md](general/TECHNICAL_STATE.md)** - État technique et configurations (✅ Mis à jour)
- **[ROADMAP.md](general/ROADMAP.md)** - Feuille de route et fonctionnalités (✅ Mis à jour)

### 🔌 **Documentation Backend**
- **[API_DOC.md](backend/API_DOC.md)** - Documentation complète des endpoints REST (✅ Mis à jour)
- **[database-structure.md](backend/database-structure.md)** - Structure complète de la base de données (✅ Mis à jour)

### ⚛️ **Documentation Frontend**
- **Components** : BGGSearch (intégration BoardGameGeek), Pages CRUD complètes
- **Services** : BGGService (API externe), PlayersService, GamesService
- **Types** : Interfaces TypeScript complètes (game.types.ts, bgg.types.ts)

---

## 🚀 Démarrage rapide

### Pour développeurs
1. **Commencer par** : [CONTEXT.md](general/CONTEXT.md) - Règles et standards (✅ Actualisé)
2. **Puis** : [DEVELOPMENT_GUIDELINES.md](general/DEVELOPMENT_GUIDELINES.md) - Guide pratique (✅ Actualisé)
3. **Architecture** : [ARCHITECTURE.md](general/ARCHITECTURE.md) - Principes design (✅ Actualisé)

### Pour backend
1. **API** : [API_DOC.md](backend/API_DOC.md) - Tous les endpoints (✅ Actualisé)
2. **Base de données** : [database-structure.md](backend/database-structure.md) - Schéma complet (✅ Actualisé)

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
│   ├── ARCHITECTURE.md
│   ├── CONTEXT.md
│   ├── DEVELOPMENT_GUIDELINES.md
│   ├── LINTING.md
│   ├── ROADMAP.md
│   └── TECHNICAL_STATE.md
├── 📁 backend/ (documentation backend)
│   ├── API_DOC.md
│   └── database-structure.md
├── 📁 frontend/ (documentation frontend - ✅ Actualisé)
│   ├── components.md (BGGSearch, CRUD forms)
│   ├── services.md (BGGService, API clients)
│   └── types.md (TypeScript interfaces)
```

---

*Tous les documents sont interconnectés avec des références croisées pour une navigation fluide.*
