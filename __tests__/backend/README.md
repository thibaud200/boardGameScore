# 🧪 Tests Backend — Board Game Score Tracker

✅ **Status : 33/33 tests réussissent** (Septembre 2025) 🚨 **Manques identifiés : BGGService non testé**

Ce dossier contient les tests automatisés pour le backend (Express.js + SQLite).

## 📊 Vue d'ensemble

- **Tests d'intégration** : 22 tests couvrant tous les endpoints API ✅
- **Tests unitaires** : 11 tests pour tous les services backend ✅
- **🚨 BGGService** : Non testé (critique pour intégration BGG) ❌
- **Coverage** : 100% des fonctionnalités critiques database/API
- **Framework** : Vitest avec configuration série pour éviter les conflits de DB

### ❌ Tests Manquants Critiques

- **bggService.ts** : Parsing XML, cache, rate limiting, conversion BGG
- **Endpoints BGG** : `/api/bgg/search`, `/api/bgg/game/:id`
- **Integration BGG** : CORS, timeout, gestion erreurs API

## Base de données utilisée

**Isolation complète** : Tous les tests utilisent automatiquement la base de test (`backend/database/test.db`). La sélection est faite dynamiquement dans le code d'initialisation (`initDatabase.ts`).

### Système de fixtures automatique

- **Injection automatique** : `wipeAllFixtures()` réinitialise et peuple la base de test
- **Données cohérentes** : FK correctes, contraintes respectées
- **Isolation parfaite** : Aucun conflit entre tests

## Lancer les tests

Sous PowerShell ou bash :

```powershell
npm run test
```

✅ **Résultat attendu : 33/33 tests réussissent**

Aucune variable d'environnement n'est nécessaire, la base de test est sélectionnée automatiquement.

## Configuration Vitest

Tests configurés en **mode série** (`singleFork: true`) pour éliminer les conflits de concurrence de base de données.

## Structure des tests

### Tests d'intégration (`__tests__/integration/`)

- `players.integration.test.ts` - API joueurs (5 tests)
- `games.integration.test.ts` - API jeux (1 test)
- `game_sessions.integration.test.ts` - API sessions (4 tests)
- `game_characters.integration.test.ts` - API personnages (1 test)
- `game_extensions.integration.test.ts` - API extensions (1 test)
- `current_game.integration.test.ts` - API partie courante (1 test)
- `game_stats.integration.test.ts` - API stats jeux (1 test)
- `player_stats.integration.test.ts` - API stats joueurs (1 test)
- `player_game_stats.integration.test.ts` - API stats joueur-jeu (1 test)

### Tests unitaires (`__tests__/backend/`)

- Tests pour tous les services backend (11 tests)
- Mocks et fixtures cohérents

## Structure recommandée

- Tests unitaires : `__tests__/backend/`
- Tests d'intégration : `__tests__/integration/`
- Fixtures et mocks : `__tests__/fixtures/`
- **Coverage : 100% des fonctionnalités critiques** ✅

## Bonnes pratiques

✅ **Accomplies**

- ✅ Isolation complète des bases de données (prod/test)
- ✅ Nettoyage automatique de la base de test entre chaque suite
- ✅ Tests pour chaque fonctionnalité (100% coverage des critiques)
- ✅ Configuration série pour éviter les conflits de concurrence
- ✅ Fixtures cohérentes avec FK correctes
- ✅ Gestion des contraintes UNIQUE et sérialisation JSON

## Problèmes résolus

- ✅ **Conflits de concurrence** : Configuration Vitest en série
- ✅ **Isolation des bases** : Services utilisent `initDatabase.ts` avec sélection automatique
- ✅ **Contraintes FK** : Gestion correcte de l'ordre d'injection des fixtures
- ✅ **Contraintes UNIQUE** : Élimination des injections en double
- ✅ **Sérialisation JSON** : Parsing correct de `session_ids` en array

---

Pour plus d'informations, voir le README principal à la racine du projet.
