# 🚀 Roadmap - Board Game Score Tracker

## ✅ Complété (Septembre 2025)

### 🏗️ Architecture & Infrastructure
- [x] **Configuration projet complète** : TypeScript, ESLint, Prettier, Husky
- [x] **Pipeline CI/CD** : GitHub Actions avec tests automatisés
- [x] **Architecture relationnelle** : Migration du stockage JSON vers tables dédiées
- [x] **Normalisation DB** : Tables `game_extensions` et `game_characters` avec foreign keys
- [x] **Tests complets** : 33/33 tests avec isolation DB

### 🎮 Fonctionnalités Core
- [x] **Intégration BGG complète** : Recherche, détails, import automatique
- [x] **Service externe personnages** : Scraping UltraBoardGames.com
- [x] **Workflow optimisé** : BGG → Formulaire → Création intelligente
- [x] **Support multi-jeux** : 6 jeux avec détection automatique des personnages
- [x] **Extensions automatiques** : Récupération et stockage depuis BGG

### 🔧 Corrections Techniques
- [x] **Foreign key constraints** : Résolution problèmes intégrité référentielle
- [x] **Service de traduction** : Vérification existence jeux avant traduction
- [x] **Workflow création** : Mode intelligent BGG vs création manuelle
- [x] **Frontend normalisé** : Suppression références colonnes JSON supprimées

## 🎯 En Cours (Décembre 2025)

### 🎮 Interface Utilisateur
- [ ] **Page d'accueil** : Dashboard avec statistiques générales
- [ ] **Navigation améliorée** : Menu principal avec breadcrumbs
- [ ] **Responsive design** : Adaptation mobile/tablette
- [ ] **Thème sombre/clair** : Toggle utilisateur

### 📊 Gestion Avancée
- [ ] **Interface admin extensions** : CRUD complet pour les extensions
- [ ] **Interface admin personnages** : CRUD complet pour les personnages
- [ ] **Recherche avancée** : Filtres par extensions, personnages, mécaniques
- [ ] **Tri et pagination** : Tables optimisées pour grandes listes

## 🎯 Q1 2026 - Fonctionnalités Parties

### 🎲 Sessions de Jeu
- [ ] **Création partie** : Interface pour démarrer une session
- [ ] **Sélection personnages** : Choix des rôles/personnages par joueur
- [ ] **Suivi temps réel** : Scores en cours de partie
- [ ] **Finalisation partie** : Sauvegarde résultats et calcul statistiques

### 👥 Gestion Joueurs
- [ ] **Profils joueurs** : Informations détaillées et préférences
- [ ] **Historique personnel** : Parties jouées, performances
- [ ] **Comparaisons** : Statistiques entre joueurs
- [ ] **Achievements** : Système de badges/accomplissements

## 🎯 Q2 2026 - Analytics & Statistiques

### 📈 Statistiques Avancées
- [ ] **Dashboard analytics** : Métriques détaillées des parties
- [ ] **Graphiques temporels** : Évolution des performances
- [ ] **Analyse jeux** : Statistiques par jeu (durée moyenne, scores, etc.)
- [ ] **Tendances** : Jeux populaires, personnages préférés

### 🔍 Recherche & Découverte
- [ ] **Recommandations** : Suggestions basées sur l'historique
- [ ] **Filtres intelligents** : Recherche par complexité, durée, nombre de joueurs
- [ ] **Comparaison jeux** : Tableaux comparatifs des mécaniques
- [ ] **Wishlist** : Liste des jeux à acquérir

## 🎯 Q3 2026 - Extensions & Intégrations

### 🌐 Intégrations Externes
- [ ] **API BoardGameGeek étendue** : Import collections utilisateurs
- [ ] **Intégration BoardGameArena** : Synchronisation parties en ligne
- [ ] **Import/Export** : Données vers/depuis autres plateformes
- [ ] **API publique** : Documentation OpenAPI pour développeurs tiers

### 🎮 Extensions Service Externe
- [ ] **Support 20+ jeux** : Extension liste jeux avec personnages
- [ ] **Multiple sources** : Scraping sites additionnels (BGG, forums)
- [ ] **Données enrichies** : Images personnages, guides stratégiques
- [ ] **Communauté** : Système de contributions utilisateurs

## 🎯 Q4 2026 - Fonctionnalités Avancées

### 👥 Fonctionnalités Sociales
- [ ] **Partage parties** : Réseaux sociaux avec screenshots
- [ ] **Groupes de jeu** : Organisation communautés locales
- [ ] **Tournois** : Système de compétitions organisées
- [ ] **Chat intégré** : Communication pendant les parties

### 🔧 Outils Avancés
- [ ] **Générateur parties** : Suggestions setup optimales
- [ ] **Timer intégré** : Gestion temps par joueur/phase
- [ ] **Notes partie** : Annotations et photos souvenirs
- [ ] **Backup cloud** : Synchronisation données multi-appareils

## 🎯 2027+ - Vision Long Terme

### 🚀 Fonctionnalités Futuristes
- [ ] **IA recommandations** : ML pour suggestions personnalisées
- [ ] **Réalité augmentée** : Scan jeux pour import automatique
- [ ] **Assistant vocal** : Contrôle par commandes vocales
- [ ] **Blockchain scores** : Certification immuable des performances

### 🌍 Expansion
- [ ] **Multilingue complet** : Support 10+ langues
- [ ] **Base données globale** : Synchronisation communauté mondiale
- [ ] **Écosystème partenaires** : Intégrations éditeurs de jeux
- [ ] **Marketplace** : Plateforme échange/vente jeux

## 📋 Critères de Priorité

### 🔥 Urgent (Impact élevé, Effort faible)
- Interface admin extensions/personnages
- Page d'accueil avec dashboard
- Responsive design mobile

### ⭐ Important (Impact élevé, Effort moyen)
- Sessions de jeu complètes
- Statistiques avancées
- Recherche avec filtres

### 💎 Stratégique (Impact moyen, Effort élevé)
- Intégrations externes multiples
- Fonctionnalités sociales
- API publique

### 🎯 Innovation (Impact variable, Effort élevé)
- IA et machine learning
- Réalité augmentée
- Blockchain

## 🔄 Processus de Mise à Jour

### 📅 Révision Trimestrielle
- **Évaluation priorités** : Selon feedback utilisateurs
- **Ajustement planning** : Basé sur ressources disponibles
- **Nouvelles fonctionnalités** : Intégration suggestions communauté

### 📊 Métriques de Succès
- **Adoption utilisateurs** : Nombre d'utilisateurs actifs
- **Engagement** : Fréquence d'utilisation
- **Performance technique** : Temps de réponse, disponibilité
- **Satisfaction** : Feedback et évaluations

---

**Roadmap mise à jour : Septembre 2025**  
**Prochaine révision : Décembre 2025**

**Goal**: Determine if BGG provides usable data for extensions and characters

- ✅ **BGG has extensions**: `expansions` field in API confirmed
- ✅ **Sufficient quality**: Data usable for auto-import

- ⚠️ **BGG characters**: To be checked - data seems limited but investigation required

#### Final Database Structure

-- Extensions (with BGG integration)

- extension_bgg_id (for BGG auto-import)
- extension_name -- Characters (to be determined based on BGG investigation)
- character_name (manual or BGG depending on investigation)
- character_description (manual or BGG depending on investigation)

### 🔧 Update Database Schema if Needed

- **BGG Fields**: Add `extension_bgg_id`, enriched metadata
- **Migration**: Scripts to adapt structure
- **Types**: Update TypeScript

---

## 🎨 PHASE 2: GLOBAL UI/UX REDESIGN

**Priority**: HIGH | **Duration**: 2-3 weeks | **Status**: Planned

### 🏗️ Design System & Foundation

#### Core Components

- **Button**: Variants (primary, secondary, danger), sizes, icons
- **Card**: Unified game cards, player cards, stat cards
- **Form**: Inputs, selects, textareas with visual validation

#### Theme & Consistency

### 📱 Pages to Redesign (by priority)

- **Charts**: Charts.js for trends and distributions
- **Navigation**: Quick access to all sections

#### 2. Players (Team Management)

- **Player Cards**: Photos, stats, last activity
- **Modern Table**: Sort, filter, bulk actions
- **Form**: Modal with real-time validation
- **Individual Stats**: Detailed modal per player

#### 3. Games (Game Library)

- **Game Grid/List**: Toggle view, BGG images, metadata
- **BGG Integration**: Improved UI for import, preview
- **Game Board**: Interface during game (scores, timer)
- **Quick Actions**: Pause, notes, adjustments
- **Session Cards**: Visual summary (game, players, result)
- **Advanced Filters**: By game, player, period, mode
- **Analytics**: Trends and insights on history

- **Global Stats**: Overview of collection and activity
- **Comparisons**: Head-to-head players, games analytics
- **Game Extensions**: Manage per game, enable/disable
- **Import BGG**: Auto-discover extensions from BGG

#### Performance & UX

#### Responsive & Accessibility

- **Color Contrast**: WCAG guidelines compliance

**Priority**: MEDIUM | **Duration**: 1-2 weeks | **Status**: After UI

#### UI Component Tests

- **Design System**: Unit tests for all base components
- **Pages**: Integration tests for new UI

- **BGG Workflow**: Search → preview → full import

---

## 🚀 FUTURE PHASES (Post-UI)

### Phase 4: Advanced Features

- **Multi-modes**: Configurable templates per game
- **Export/Import**: CSV, JSON data portability
- **PWA**: Installation and offline mode
- **Performance**: Large dataset optimizations

### Phase 5: Premium Features

- **Mobile App**: Native iOS/Android application

### Day 1-2: BGG Extensions & Characters Audit

1. **✅ BGG Extensions**: Data available and usable via BGG API
2. **⚠️ BGG Characters**: Investigation required - data potentially available
3. **🔍 Characters Investigation**: Test BGG API for real character data
4. **📋 Final architecture decision**:

### Day 3-5: Design System Foundation

## 🎯 CLEAR PRIORITIES

### ❤️ CRITICAL (Blocks everything else)

1. **BGG Audit → DB**: Final structure before UI
2. **Design System**: Foundation for all pages

### 🧡 IMPORTANT (Final quality)

3. **Dashboard redesign**: Modern central hub
4. **Players & Games UI**: Main pages

### 💛 NICE TO HAVE (Polish)

5. **Stats & Analytics**: Advanced pages
6. **Frontend Tests**: After stable UI

7. **Advanced features**: PWA, export, etc.

---

**Philosophy**: UI first, features second. **Goal**: Modern, intuitive interface that makes you want to use the app.

_Last update: September 3, 2025_

- ✅ **Multiple Element Selection**: Fix ambiguous selectors
- ✅ **Test Isolation**: DOM cleanup between tests
- ✅ **Mock Strategy**: Simplified BGGSearch to avoid interference
- ✅ **Accessibility Patterns**: Robust selectors for React Testing Library

---

## 📋 Phase 3c: Dashboard Infrastructure - COMPLETED

### Dashboard Foundation ✅

- ✅ **Infrastructure Tests**: React Testing Library configuration validation
- ✅ **Basic Rendering**: Component doesn't crash with proper layout
- 📝 **Data Integration**: Merge real-time players/games/sessions data
- 📝 **Navigation**: User links and workflows

---

## 📋 Phase 4: Frontend Services - PLANNED

- 📝 **GamesService.ts**: CRUD operations with error handling

- 📝 **Players CRUD**: Pattern similar to Games page
- 📝 **Player Forms**: Validation and submission
- 📝 **Player Statistics**: Calculations and display
- 📝 **Integration Services**: API calls and responses

- 📝 **API Response Validation**: Schema compliance

### BGG Backend Error Handling 🔄

- **Priority**: Immediate Phase 4

### Performance Optimization 📝

- **BGG API Timeouts**: Sporadic tests due to external latency
- **Database Concurrency**: Improved isolation for parallel tests

### 🏆 Major Achievements Phase 3 ✅

- **Critical BGGService**: Main service 100% tested (unit + integration)
- **Games Page CRUD**: Full features, 7/7 tests passing
- **Test Architecture**: Scalable patterns established for future features

### � Current Status (September 2, 2025)

- **BGG Integration**: 5/9 passing (55% - depends on external API)

### 🔧 Immediate Work Phase 4

3. **Frontend Services Testing**: Advanced error handling (90 min)

### � Estimated Completion

- **Phase 4 Services**: 3h00 estimated
- **BGG Backend Fixes**: 0h30 remaining
- **Critical Coverage Complete**: ~3h30 for 95% coverage **Solid Foundation**: Multi-env test architecture proven  
  **Established Patterns**: Reproducible for all new features  
  **Business Critical**: BGG workflow 100% validated for production  
  **Developer Experience**: Exhaustive documentation for team

---

### Immediate Session (Phase 4a)

- **BGG Error Handling**: Semantic HTTP codes backend

### Next Session (Phase 4b)

### Long Term (Phase 5)

- **Production Monitoring**: Metrics and alerting

---

## � References and Documentation

- `docs/DEV_JOURNAL.md` - Development session journal
- `docs/EXECUTIVE_SUMMARY.md` - Full executive summary
- **Mock Strategies**: Unit vs Integration vs E2E
- **Multi-Environment**: Frontend (jsdom) / Backend (node)
- **Type Safety**: Strict TypeScript + runtime validation

**Last update**: September 2, 2025  
**Version**: Phase 3 Completed - BGG Critical Path Validated npm run test:frontend src/**tests**/pages/Players.test.tsx

# Frontend Services (to create)

npm run test:frontend src/**tests**/services/

---

**Last update**: Excellent progress with robust infrastructure established. 75% of critical tests successfully implemented. Final objectives achievable in the coming weeks.

- ✅ RESTful routes for all entities (10 endpoints)
- ✅ Input validation and error handling on API
- ✅ **Database isolation**: Complete resolution of concurrency conflicts
- ✅ **Vitest configuration**: Serial tests to eliminate DB conflicts
- ✅ Full API endpoint documentation (API_DOC.md)
- ✅ README.md updated with scripts and structure
- ✅ Backend test documentation (README.md)
- ✅ **Complete resolution of isolation and database issues**

##### Fully Functional Pages ✅

- ✅ **Players.tsx**: Full CRUD with validation and error handling
- ✅ **CurrentGame.tsx**: Full workflow for managing ongoing games
  - Create new games (select game + players)

##### Architecture & Services ✅

- ✅ **API Services**: Structured apiClient with error handling
- ✅ **TypeScript Types**: Complete interfaces synchronized with DB

#### Frontend React (Full CRUD Pages ✅)

- ✅ **BGG backend service**: Typed XML parsing, rate limiting, 24h cache
- ✅ **UX Workflow**: Pre-fill form instead of direct import ✅

- ✅ **0 ESLint errors**: Strict code quality maintained
- ✅ **Organized documentation**: Structure docs/{backend,frontend,general}/
- ✅ **Documented linting**: Complete ESLint guide with best practices
- ✅ **Frontend documentation**: Components, Services, Types documented ✅
- ✅ **Hybrid types**: JavaScript ↔ SQLite management documented ✅
- ✅ **BGG Integration**: Service and components documented ✅
- ✅ Usage examples in tests with automatic fixture injection
- ✅ API endpoint documentation with call examples, parameters, and return codes

#### 🚧 PlayerStats.tsx (70% complete)

- ❌ **Real APIs**: `/api/stats/players/:id` with SQL aggregations

#### 🚧 GameStats.tsx (70% complete)

#### 🚧 Sessions.tsx (60% complete)

- ❌ **Data enrichment**: Joins with players/games for full names
- ❌ **Backend filtering**: Advanced server-side filtering logic

### Missing Backend Work

#### Real Statistics Services

- ❌ **Player calculations**: Games played, wins, average scores, performance per game
- ❌ **Game calculations**: Popularity, average duration, score distribution, podiums
- ❌ **PlayerGameStats**: Cross statistics with detailed history
- ❌ **SQL optimization**: Efficient aggregate queries

#### Session Enrichment

- ❌ **Complete data**: Joins with players/games for name display
- ❌ **Advanced filtering**: Multiple criteria (date, duration, score, etc.)
- ❌ **Pagination**: Manage large session lists

## 📅 Next Priority Steps

### Priority 1: 🔧 Backend Statistics (1-2 weeks)

1. **Implement real calculations** in `backend/src/services/statsService.ts`
2. **Replace mocked data** with aggregate SQL queries
3. **Enrich sessions** with player/game joins
4. **Test APIs** with real volumetric data

### Priority 2: ✅ Frontend Validation (3-5 days)

1. **Test PlayerStats.tsx** with real backend data
2. **Validate GameStats.tsx** with real podiums
3. **Validate Sessions.tsx** with functional filtering
4. **Navigation tests** between all pages

### Priority 3: 🧪 Tests & Documentation (1 week)

2. **Frontend tests** for new pages
3. **API documentation** updated
4. **User guide** for full features

---

## 📊 Current State Recap

**🟡 70% functional**: PlayerStats, GameStats, Sessions (full UI, backend to finalize) **🔴 To implement**: Real statistics calculations, session enrichment

**Next milestone**: Finalize backend statistics to have all pages 100% functional

## 📋 Future Features (Not Priorities)

- **BGGService backend**: No unit or integration tests for BGG service server-side
  - Tests for endpoints `/api/bgg/search` and `/api/bgg/game/:id`
  - Tests for BGG → local format conversion (game mode detection)
- **No frontend tests**: 0 tests for React components, services, hooks
  - **Components**: BGGSearch.tsx (search, select, import), Layout.tsx
  - **Services**: BGGService.ts, playersService.ts, gamesService.ts, apiClient.ts
  - **Types**: TypeScript interface validation and hybrid conversions

#### ❌ **Frontend-Backend Integration Tests**

- Full API communication (frontend ↔ backend)

- React Testing Library + Vitest configuration

- **Backend services**: 11 unit tests ✅

### 🎨 Phase 3: Global UI/UX Redesign

#### Design System & Visual Consistency

- **Consistent iconography**: Replace emoji icons with Lucide React

#### UX Improvements

- **Responsive design**: Mobile/tablet/desktop optimization
- **Interface states**: Improved loading, empty, error states
- **User feedback**: Toast notifications, action confirmations
- **Accessibility**: Keyboard support, screen readers, contrast
- **Atomic components**: Split into reusable components
- **Custom hooks**: Externalized business logic
- **TypeScript types**: Improved UI type safety
- **Frontend tests**: React Testing Library for critical components
- **Multi-game modes** with configurable templates
- **Export/Import** CSV/JSON data
- **Advanced charts** with Chart.js
- **PWA mode** for installation and offline

### Phase 5: 🔌 Advanced BoardGameGeek Integration

---

_Last update: September 2025_

**Status**: 🔗 Phase 2 frontend support **Priority**: Medium

- **BGG Proxy**: Bypass CORS for BGG requests
- **BGG Cache**: Avoid rate limits, optimize performance
- **XML Parsing**: Transform BGG data to JSON

#### Migrations & Database

**Status**: 🗄️ Future infrastructure **Priority**: Low

- **Automatic migrations**: Schema evolution without data loss
- **Automatic backup**: Periodic SQLite database backup
- **Audit logs**: Modification traceability

### 🔮 Long-Term Vision

#### Phase 5: 🏕️ Multi-Scenario Campaign Mode

**Status**: � Distant vision - Q4 2026

- **Multi-session management**: Link games in campaign
- **Character progression**: Stats, equipment evolution
- **Scenarios**: Library, custom creation, sharing

**Status**: 🌐 Distant vision - 2027 **Priority**: Low

- **Full PWA**: Browser installation, full offline
- **Docker containers**: Simplified server deployment
- **Electron app**: Multi-platform desktop version
- **Mobile responsive**: Advanced mobile optimization

## 🎯 Next Concrete Actions

### Immediate (this week)

1. ✅ **Players Page**: Full CRUD with playersService - DONE
2. ✅ **Games Page**: Full CRUD with BGG integration - DONE
3. 🚨 **Frontend Tests**: Setup React Testing Library + first BGGSearch tests
4. 🚨 **BGG Backend Tests**: Unit tests for bggService.ts
5. **Navigation**: ✅ Improved layout with functional routes - DONE

### Short term (this month)

1. 🧪 **Frontend test infrastructure**: Full Vitest + RTL configuration
2. 🧪 **Critical component tests**: BGGSearch, Players, Games forms
3. 🧪 **Frontend services tests**: BGGService, playersService, gamesService
4. 🧪 **Integration tests**: Frontend ↔ Backend communication
5. **SOLID architecture**: ✅ Refactored components following SOLID principles - DONE

### Medium term (quarter)

1. **BGG Integration**: Search and import service
2. **Game templates**: Flexible configuration
3. **Statistics**: Dashboard with charts

---

**Note**: This roadmap focuses on a simple architecture with a single SQLite database, avoiding the complexity of remote/local DB from the previous project.

## 📅 History

- **September 2025**: Backend complete, 33/33 tests passing, robust DB infrastructure, up-to-date documentation
- **August 2025**: Initial backend, DB, base initialization scripts

---

This file is updated at every major project milestone.
