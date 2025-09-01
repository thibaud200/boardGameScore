# 🛣️ Roadmap — Board Game Score Tracker

## ✅ Réalisé

### 2025

- Audit et documentation complète du schéma de base de données (database-structure.md)
- Création des scripts d’initialisation de la base principale et de test (initDatabase.ts, initTestDatabase.ts)
- Mise en place du backend Express.js strictement typé (TypeScript)
- Création des services modulaires pour chaque table (players, games, game_sessions, etc.)
- Ajout des routes RESTful pour toutes les entités
- Validation des entrées et gestion des erreurs sur l’API
- Génération des tests unitaires pour tous les services backend
- Correction des erreurs de lint et formatage
- Documentation des standards et contraintes IA (CONTEXT.md)
- Mise à jour du README.md avec les scripts et la structure

### Backend (Express.js + SQLite)
- Séparation explicite du backend et du frontend pour plus de clarté et faciliter la prise en main de la stack (débutant)
- Automatisation du choix de la base (prod/test) selon l’environnement
- Ajout de données de test et fixtures pour les tests unitaires
- Mise en place d'un utilitaire injectFixtures.ts pour automatiser l'injection des fixtures dans la base de test
- Exemple d'utilisation dans les tests :
	- Import des fixtures dans les tests unitaires
	- Utilisation de injectAllFixtures(db) dans le hook beforeEach pour garantir un état propre et reproductible
- Documentation des endpoints API et exemples d’utilisation
	- Rédiger une documentation claire pour chaque route, avec des exemples d’appels et de réponses.
	- Décrire les paramètres attendus (query, body, path).
	- Préciser les codes de retour et les cas d’erreur possibles.
	- Fournir des exemples de requêtes (curl, fetch, etc.) et de réponses JSON.
	- Centraliser la documentation dans un fichier ou un outil dédié (ex: Swagger, Postman, markdown).

## 🕒 À venir


### Backend (Express.js + SQLite)
- Ajout de tests d’intégration et end-to-end backend <!-- FIXME: problème d'isolation et de base de données, à corriger -->
    -Vérifier le fonctionnement global de l’API, l’enchaînement des appels et l’intégration des modules. Corriger l’isolation des bases pour éviter les effets de bord.
- Optimisation des performances et sécurité backend
	- Optimisation des requêtes SQL (index, jointures, pagination)
	- Réduction des accès inutiles à la base
	- Mise en cache des données critiques
	- Sécurisation des endpoints (validation, authentification, gestion des erreurs)
	- Audit et limitation des risques d’injection SQL et de fuite de données
- Couverture de tests >80% sur le backend <!-- FIXME: problème d'isolation et de base de données, à corriger -->
    - Augmenter le nombre de tests pour garantir la robustesse et la non-régression du backend.
- Intégration BoardGameGeek API côté serveur
    - Permettre la récupération automatique d’informations sur les jeux depuis la base BoardGameGeek.
- Ajout des migrations automatiques pour la base
    - Mettre en place un système pour faire évoluer le schéma de la base sans perte de données.


### Frontend (React + Vite)
- Séparation explicite du frontend et du backend pour plus de clarté et faciliter la prise en main de la stack (débutant)
- Amélioration de l’UI (Radix UI, Phosphor Icons)
- Couverture de tests >80% sur le frontend
- Internationalisation (i18n)
- Ajout de tests d’intégration et end-to-end frontend


## 📅 Historique

- Septembre 2025 : Backend, DB, tests, documentation, scripts d’initialisation

---

Ce fichier est mis à jour à chaque étape majeure du projet.
