# 🛣️ Roadmap — Board Game Score Tracker

## ✅ Réalisé

### Septembre 2025 - Backend & Tests Complets ✅

#### Infrastructure & Base de données
- ✅ Audit et documentation complète du schéma de base de données (database-structure.md)
- ✅ Création des scripts d'initialisation de la base principale et de test (initDatabase.ts, initTestDatabase.ts)
- ✅ Automatisation du choix de la base (prod/test) selon l'environnement
- ✅ Séparation explicite du backend et du frontend pour plus de clarté

#### Backend Express.js + SQLite (100% Fonctionnel)
- ✅ Backend Express.js strictement typé (TypeScript)
- ✅ Services modulaires pour chaque table (players, games, game_sessions, etc.)
- ✅ Routes RESTful pour toutes les entités (10 endpoints)
- ✅ Validation des entrées et gestion des erreurs sur l'API
- ✅ Correction complète des erreurs de lint et formatage

#### Tests & Qualité (33/33 tests réussissent ✅)
- ✅ **Tests d'intégration complets** : 22 tests couvrant tous les endpoints API
- ✅ **Tests unitaires backend** : 11 tests pour tous les services 
- ✅ **Système de fixtures automatique** : injection de données de test cohérentes
- ✅ **Isolation des bases** : résolution complète des conflits de concurrence
- ✅ **Configuration Vitest** : tests en série pour éliminer les conflits de DB
- ✅ **Infrastructure robuste** : gestion FK, contraintes UNIQUE, sérialisation JSON
- ✅ **Couverture >80%** : 100% des fonctionnalités critiques testées

#### Documentation & Standards  
- ✅ Documentation des standards et contraintes IA (CONTEXT.md)
- ✅ Documentation complète des endpoints API (API_DOC.md) 
- ✅ Mise à jour du README.md avec scripts et structure
- ✅ Documentation des tests backend (README.md)
- ✅ **Résolution complète des problèmes d'isolation et de base de données**

### Anciens accomplissements (Historique)
- ✅ Mise en place d'un utilitaire injectFixtures.ts pour automatiser l'injection des fixtures
- ✅ Exemples d'utilisation dans les tests avec injection automatique des fixtures
- ✅ Documentation des endpoints API avec exemples d'appels, paramètres et codes de retour

## 🕒 À venir

### Backend (Express.js + SQLite)
- Optimisation des performances et sécurité backend
	- Optimisation des requêtes SQL (index, jointures, pagination)
	- Réduction des accès inutiles à la base
	- Mise en cache des données critiques
	- Sécurisation des endpoints (validation, authentification, gestion des erreurs)
	- Audit et limitation des risques d'injection SQL et de fuite de données
- Intégration BoardGameGeek API côté serveur
    - Permettre la récupération automatique d'informations sur les jeux depuis la base BoardGameGeek.
- Ajout des migrations automatiques pour la base
    - Mettre en place un système pour faire évoluer le schéma de la base sans perte de données.

### Frontend (React + Vite) - En cours de développement

#### Phase 1 : Infrastructure Frontend ⏳
- Structure des dossiers (`components/`, `pages/`, `services/`, `types/`)
- Layout principal avec navigation responsive
- Configuration du client API pour consommer le backend

#### Phase 2 : Pages principales ⏳  
- Dashboard/Accueil avec vue d'ensemble
- Page Players avec CRUD complet (Create, Read, Update, Delete)
- Page Games avec CRUD et préparation API BGG future
- Navigation entre les pages

#### Phase 3 : Fonctionnalités avancées (À venir)
- Sessions de jeu avec gestion des scores
- Statistiques et graphiques
- Intégration BoardGameGeek API
- Recherche et filtres avancés

#### Prérequis techniques
- Développement complet de l'interface utilisateur React
- Amélioration de l'UI (Radix UI, Phosphor Icons)
- Couverture de tests >80% sur le frontend
- Internationalisation (i18n)
- Ajout de tests d'intégration et end-to-end frontend
- Connexion avec l'API backend fonctionnelle ✅

## 📅 Historique

- **Septembre 2025** : Backend complet, 33/33 tests réussissent, infrastructure DB robuste, documentation à jour
- **Août 2025** : Backend initial, DB, scripts d'initialisation de base

---

Ce fichier est mis à jour à chaque étape majeure du projet.
