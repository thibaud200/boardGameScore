# 🛣️ Roadmap — Board Game Score Tracker

## ✅ Réalisé

### Septembre 2025 - Foundation Technique ✅

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
- ✅ Documentation des standards et contraintes IA (docs/CONTEXT.md)
- ✅ Documentation complète des endpoints API (API_DOC.md) 
- ✅ Mise à jour du README.md avec scripts et structure
- ✅ Documentation des tests backend (README.md)
- ✅ **Résolution complète des problèmes d'isolation et de base de données**
- ✅ **Principes SOLID** : Documentation et application des bonnes pratiques architecture

#### Frontend React + TypeScript (Partiellement Fonctionnel)

##### Pages Complètement Fonctionnelles ✅
- ✅ **Players.tsx** : CRUD complet avec validation et gestion d'erreurs
- ✅ **Games.tsx** : Gestion complète avec modes de jeu et personnages  
- ✅ **CurrentGame.tsx** : Workflow complet de gestion des parties en cours
  - Création nouvelles parties (sélection jeu + joueurs)
  - Affichage partie en cours avec détails
  - Terminer partie (création automatique session dans game_sessions)
  - Annuler partie (suppression sans sauvegarde)
- ✅ **Dashboard** : Navigation et vue d'ensemble

##### Architecture & Services ✅
- ✅ **Navigation React Router** : Toutes les routes intégrées et fonctionnelles
- ✅ **Services API** : apiClient structuré avec gestion d'erreurs
- ✅ **Types TypeScript** : Interfaces complètes synchronisées avec BDD
- ✅ **UI/UX Tailwind** : Interface moderne avec états loading/error

#### Résolutions Techniques Critiques ✅
- ✅ **Problématique booléens SQLite** : Conversion automatique JavaScript boolean → SQLite integer (0/1)
- ✅ **Gestion valeurs null/undefined** : Harmonisation frontend React ↔ backend SQLite  
#### Frontend React (Pages CRUD Complètes ✅)
- ✅ **Page Players** : CRUD complet (liste, création, édition, suppression)
- ✅ **Page Games** : CRUD complet avec intégration BoardGameGeek
- ✅ **Navigation responsive** : Menu entre pages, états UI cohérents
- ✅ **Formulaires robustes** : Validation, feedback utilisateur, gestion d'erreurs
- ✅ **Types TypeScript hybrides** : Support `| null` pour compatibilité SQLite
- ✅ **Validation robuste** : Nettoyage des données avant envoi API

#### Intégration BoardGameGeek (Complète ✅)
- ✅ **Service BGG backend** : XML parsing typé, rate limiting, cache 24h
- ✅ **Service BGG frontend** : BGGService avec types TypeScript complets ✅
- ✅ **Recherche intelligente** : Auto-complétion temps réel avec debouncing  
- ✅ **Import automatique** : Métadonnées complètes (nom, joueurs, durée, description)
- ✅ **Détection modes** : Coopératif/compétitif/campagne basée sur mécaniques BGG
- ✅ **Conversion automatique** : BGG → format base de données local
- ✅ **Interface conditionnelle** : BGG visible uniquement lors ajout/modification
- ✅ **Composant BGGSearch** : Composant réutilisable d'intégration BGG ✅
- ✅ **Workflow UX** : Pré-remplissage formulaire au lieu d'import direct ✅

#### Qualité & Documentation ✅
- ✅ **Typage TypeScript complet** : Suppression de tous les types `any`
- ✅ **0 erreurs ESLint** : Code quality stricte maintenue
- ✅ **Documentation organisée** : Structure docs/{backend,frontend,general}/
- ✅ **Linting documenté** : Guide complet ESLint avec bonnes pratiques
- ✅ **Documentation frontend** : Components, Services, Types documentés ✅
- ✅ **Types hybrides** : Gestion JavaScript ↔ SQLite documentée ✅
- ✅ **BGG Integration** : Service et composants documentés ✅

### Anciens accomplissements (Historique)
- ✅ Mise en place d'un utilitaire injectFixtures.ts pour automatiser l'injection des fixtures
- ✅ Exemples d'utilisation dans les tests avec injection automatique des fixtures
- ✅ Documentation des endpoints API avec exemples d'appels, paramètres et codes de retour

## � En Cours de Finalisation

### Pages Créées mais Backend à Implémenter

#### 🚧 PlayerStats.tsx (70% complété)
- ✅ **UI complète** : Design et composants terminés
- ✅ **Service frontend** : statsService.ts avec formatage données
- ❌ **Backend logique** : Calculs statistiques réels (actuellement données mockées)
- ❌ **APIs réelles** : `/api/stats/players/:id` avec agrégations SQL

#### 🚧 GameStats.tsx (70% complété)  
- ✅ **UI complète** : Affichage podiums et performance joueurs
- ✅ **Service frontend** : Intégration statsService
- ❌ **Backend logique** : Statistiques par jeu (popularité, performances)
- ❌ **APIs réelles** : `/api/stats/games/:id` avec calculs réels

#### 🚧 Sessions.tsx (60% complété)
- ✅ **UI et navigation** : Filtrage par jeu/joueur, breadcrumbs
- ✅ **Service frontend** : gameSessionsService.ts créé
- ❌ **Enrichissement données** : Jointures avec players/games pour noms complets
- ❌ **Backend filtrage** : Logique de filtrage avancé côté serveur

### Travail Backend Manquant

#### Services de Statistiques Réelles
- ❌ **Calculs joueurs** : Parties jouées, victoires, scores moyens, performance par jeu
- ❌ **Calculs jeux** : Popularité, durée moyenne, distribution scores, podiums
- ❌ **PlayerGameStats** : Statistiques croisées avec historique détaillé
- ❌ **Optimisation SQL** : Requêtes agrégées performantes

#### Enrichissement des Sessions
- ❌ **Données complètes** : Jointures avec players/games pour affichage noms
- ❌ **Filtrage avancé** : Critères multiples (date, durée, score, etc.)
- ❌ **Pagination** : Gestion listes importantes de sessions

## 📅 Prochaines Étapes Prioritaires

### Priorité 1: 🔧 Backend Statistiques (1-2 semaines)
1. **Implémenter calculs réels** dans `backend/src/services/statsService.ts`
2. **Remplacer données mockées** par requêtes SQL agrégées
3. **Enrichir sessions** avec jointures players/games
4. **Tester APIs** avec vraies données volumétriques

### Priorité 2: ✅ Validation Frontend (3-5 jours)
1. **Tester PlayerStats.tsx** avec vraies données backend
2. **Valider GameStats.tsx** avec podiums réels
3. **Valider Sessions.tsx** avec filtrage fonctionnel
4. **Tests navigation** entre toutes les pages

### Priorité 3: 🧪 Tests & Documentation (1 semaine)
1. **Tests backend** pour nouvelles APIs statistiques
2. **Tests frontend** pour nouvelles pages
3. **Documentation API** mise à jour
4. **Guide utilisateur** pour fonctionnalités complètes

---

## 📊 Récapitulatif État Actuel

**🟢 Fonctionnel à 100%** : Backend API, Players, Games, CurrentGame, Dashboard  
**🟡 Fonctionnel à 70%** : PlayerStats, GameStats, Sessions (UI complète, backend à finaliser)  
**🔴 À implémenter** : Calculs statistiques réels, enrichissement sessions

**Prochaine milestone** : Finalisation backend statistiques pour avoir toutes les pages 100% fonctionnelles

## 📋 Fonctionnalités Futures (Non Prioritaires)

### 🧪 Tests Manquants Identifiés (Septembre 2025)

#### ❌ **Tests Backend Manquants - BGG Service**
- **BGGService backend** : Aucun test unitaire ou d'intégration pour le service BGG côté serveur
  - Tests de parsing XML BGG (searchGames, getGameDetails)
  - Tests de cache intelligent (24h TTL, invalidation)
  - Tests de rate limiting API BGG (1s entre requêtes)
  - Tests de gestion d'erreurs API BGG (timeout, 503, XML malformé)
  - Tests des endpoints `/api/bgg/search` et `/api/bgg/game/:id`
  - Tests de conversion BGG → format local (détection modes de jeu)

#### ❌ **Tests Frontend Manquants (Critique)**
- **Aucun test frontend** : 0 tests pour React components, services, hooks
  - **Pages** : Players.tsx, Games.tsx, Dashboard.tsx (formulaires, CRUD, navigation)
  - **Components** : BGGSearch.tsx (recherche, sélection, import), Layout.tsx
  - **Services** : BGGService.ts, playersService.ts, gamesService.ts, apiClient.ts
  - **Types** : Validation des interfaces TypeScript et conversions hybrides

#### ❌ **Tests d'Intégration Frontend-Backend**
- Communication API complète (frontend ↔ backend)
- Workflow BGGSearch → import → formulaire → sauvegarde
- Gestion d'erreurs réseau côté frontend
- Validation formulaires avec types hybrides (JavaScript ↔ SQLite)

#### ❌ **Infrastructure Tests Frontend**
- Configuration React Testing Library + Vitest
- Setup mocks pour API calls
- Configuration coverage frontend
- Tests snapshots pour composants UI

#### ✅ **Tests Existants (Complets)**
- **Backend services** : 11 tests unitaires ✅
- **API endpoints** : 22 tests d'intégration ✅  
- **Database** : Fixtures et isolation complètes ✅

---

### 🎨 Phase 3: Refonte UI/UX Globale
**Statut** : � Prochaine priorité - Foundation technique complète ✅  
**Priorité** : Haute

#### Design System & Cohérence Visuelle
- **Audit UI actuel** : Identification des incohérences et points d'amélioration
- **Design System unifié** : Palette de couleurs, typographie, espacements cohérents
- **Composants réutilisables** : Buttons, Cards, Forms, Modals standardisés
- **Iconographie cohérente** : Remplacement des icônes emoji par Lucide React
- **Guide de style** : Documentation des composants UI et patterns

#### Amélioration UX
- **Navigation repensée** : Menu principal plus intuitif, breadcrumbs
- **Responsive design** : Optimisation mobile/tablette/desktop
- **États d'interface** : Loading states, empty states, error states améliorés
- **Feedback utilisateur** : Notifications toast, confirmations d'actions
- **Accessibilité** : Support clavier, lecteurs d'écran, contrastes

#### Refactoring Techniques
- **Composants atomiques** : Découpage en composants réutilisables
- **Hooks personnalisés** : Logique métier externalisée
- **Types TypeScript** : Amélioration de la sécurité des types UI
- **Tests frontend** : React Testing Library pour composants critiques

### Phase 4: 🛠️ Fonctionnalités Avancées
- **Multi-modes de jeu** avec templates configurables
- **Export/Import** données CSV/JSON
- **Graphiques avancés** avec Chart.js
- **Mode PWA** pour installation et offline

### Phase 5: 🔌 Intégration BoardGameGeek Avancée
- **Service BGG** avec recherche et import automatique
- **Métadonnées enrichies** depuis base BGG
- **Auto-détection** modes et personnages

---

*Dernière mise à jour : Septembre 2025*
- **Pagination** : Gestion des grandes collections
- **Compression** : Optimisation des réponses API

#### Intégration BoardGameGeek API côté serveur
**Statut** : 🔗 Support Phase 2 frontend  
**Priorité** : Moyenne

- **Proxy BGG** : Contournement CORS pour requêtes BGG
- **Cache BGG** : Éviter les rate limits, optimiser performances
- **Parsing XML** : Transformation données BGG en JSON

#### Migrations & Base de données
**Statut** : 🗄️ Infrastructure future  
**Priorité** : Basse

- **Migrations automatiques** : Évolution schéma sans perte de données
- **Backup automatique** : Sauvegarde périodique base SQLite
- **Audit logs** : Traçabilité des modifications

### 🔮 Vision Long Terme

#### Phase 5: 🏕️ Mode Campagne Multi-Scénarios
**Statut** : � Vision lointaine - Q4 2026  
**Priorité** : Basse

- **Gestion multi-sessions** : Liaison parties en campagne
- **Progression personnages** : Évolution stats, équipements
- **Scénarios** : Bibliothèque, création custom, partage
- **Sauvegarde état** : Persistence entre sessions
- **Narratif** : Journal de campagne, timeline événements

#### Phase 6: 🚀 Déploiement & Distribution
**Statut** : 🌐 Vision lointaine - 2027  
**Priorité** : Basse

- **PWA complète** : Installation navigateur, offline complet
- **Docker containers** : Déploiement serveur facilité
- **Application Electron** : Version desktop multi-platform
- **Mobile responsive** : Optimisation mobile avancée

## 🎯 Prochaines Actions Concrètes

### Immédiat (cette semaine)
1. ✅ **Page Players** : CRUD complet avec playersService - TERMINÉ
2. ✅ **Page Games** : CRUD complet avec BGG integration - TERMINÉ
3. 🚨 **Tests Frontend** : Setup React Testing Library + premiers tests BGGSearch
4. 🚨 **Tests BGG Backend** : Tests unitaires bggService.ts
5. **Navigation** : ✅ Layout amélioré avec routes fonctionnelles - TERMINÉ

### Court terme (ce mois)
1. 🧪 **Infrastructure tests frontend** : Configuration complète Vitest + RTL
2. 🧪 **Tests composants critiques** : BGGSearch, Players, Games forms
3. 🧪 **Tests services frontend** : BGGService, playersService, gamesService
4. 🧪 **Tests intégration** : Frontend ↔ Backend communication
5. **Architecture SOLID** : ✅ Refactoring composants selon principes SOLID - TERMINÉ

### Moyen terme (trimestre)
1. **Intégration BGG** : Service de recherche et import
2. **Templates jeux** : Configuration flexible
3. **Statistiques** : Dashboard avec graphiques

---

**Note** : Cette roadmap se concentre sur une architecture simple avec une seule base SQLite, évitant la complexité base distante/locale de l'ancien projet.

## 📅 Historique

- **Septembre 2025** : Backend complet, 33/33 tests réussissent, infrastructure DB robuste, documentation à jour
- **Août 2025** : Backend initial, DB, scripts d'initialisation de base

---

Ce fichier est mis à jour à chaque étape majeure du projet.