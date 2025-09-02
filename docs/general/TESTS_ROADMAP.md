# 🧪 Plan de Tests Manquants - Board Game Score Tracker

## 🚨 Status Critique : Tests Frontend & BGG Manquants

**Date d'identification** : Septembre 2025  
**Impact** : Critique pour la qualité et maintenabilité du projet  
**Priorité** : Haute - Doit être résolu avant Phase 3 UI/UX

---

## 📊 Résumé de l'Analyse

### ✅ Tests Existants (Complets)
- **Backend services** : 11 tests unitaires pour services database ✅
- **API endpoints** : 22 tests d'intégration couvrant toutes les routes ✅
- **Infrastructure** : Base de test isolée, fixtures automatiques ✅
- **Total** : 33/33 tests réussissent

### ❌ Tests Manquants Identifiés

#### 1. BGGService Backend (Critique)
**Fichier** : `backend/src/services/bggService.ts`  
**Status** : Aucun test existant  
**Impact** : Service critique pour intégration BoardGameGeek

**Tests à implémenter** :
- **Parsing XML BGG** : Validation parsing search/details
- **Cache système** : TTL 24h, invalidation, performance
- **Rate limiting** : Respect limite 1s entre requêtes
- **Gestion erreurs** : Timeout, 503, XML malformé, réseau
- **Conversion données** : BGG → format local, détection modes
- **Endpoints integration** : `/api/bgg/search`, `/api/bgg/game/:id`

#### 2. Frontend React (Critique)
**Status** : 0 tests frontend existants  
**Impact** : Aucune couverture des composants, services, workflow utilisateur

**Infrastructure manquante** :
- Configuration React Testing Library + Vitest frontend
- Setup mocks pour API calls
- Configuration coverage frontend

**Tests à implémenter** :

##### Pages (Priorité 1)
- **Players.tsx** : CRUD operations, formulaires, validation
- **Games.tsx** : CRUD operations, integration BGG, formulaires complexes
- **Dashboard.tsx** : Affichage données, navigation

##### Components (Priorité 1)
- **BGGSearch.tsx** : Recherche, sélection, import workflow
- **Layout.tsx** : Navigation, responsive

##### Services (Priorité 2)
- **BGGService.ts** : API calls, gestion erreurs, types
- **playersService.ts** : CRUD operations, validation
- **gamesService.ts** : CRUD operations avec BGG
- **apiClient.ts** : HTTP client, error handling

##### Types & Conversion (Priorité 2)
- **Type guards** : Validation runtime des interfaces
- **Conversions hybrides** : JavaScript ↔ SQLite (boolean, null/undefined)
- **BGG types** : Validation des structures XML → JSON

#### 3. Tests Intégration Frontend-Backend (Priorité 2)
**Status** : Aucun test E2E ou workflow complet  
**Impact** : Pas de validation du workflow utilisateur complet

**Tests à implémenter** :
- **Workflow BGG complet** : Search → Select → Import → Form → Save
- **CRUD Players** : Frontend → API → Database → Frontend
- **CRUD Games** : Frontend → API → Database → Frontend
- **Gestion erreurs** : Network errors, validation errors, BGG API errors

---

## 📋 Plan d'Implémentation

### Phase 1 : Infrastructure (Semaine 1)
1. **Setup React Testing Library** pour frontend
2. **Configuration Vitest** pour tests frontend
3. **Mocks et utilities** pour API calls
4. **Premier test simple** pour valider setup

### Phase 2 : BGGService Backend (Semaine 1-2)
1. **Tests unitaires bggService.ts** :
   - Parsing XML avec fixtures
   - Cache système avec mocks
   - Rate limiting avec timers
   - Gestion erreurs avec mocks API
2. **Tests intégration endpoints BGG** :
   - `/api/bgg/search` avec vraies API calls
   - `/api/bgg/game/:id` avec vraies API calls
   - CORS et headers

### Phase 3 : Components Frontend (Semaine 2-3)
1. **BGGSearch Component** (priorité critique) :
   - Rendu initial
   - Recherche et résultats
   - Sélection et détails
   - Import et callback
2. **Pages CRUD** :
   - Players.tsx formulaires et validation
   - Games.tsx avec BGG integration
   - Navigation et états

### Phase 4 : Services Frontend (Semaine 3-4)
1. **API Services** :
   - BGGService avec mocks API
   - PlayersService, GamesService
   - Error handling et retry logic
2. **Type validation** :
   - Type guards runtime
   - Conversions JavaScript ↔ SQLite

### Phase 5 : Integration Tests (Semaine 4)
1. **Workflow E2E** :
   - BGG search → import → save
   - CRUD operations completes
   - Error scenarios

---

## 🛠️ Configuration Technique

### Dependencies Nécessaires
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jsdom": "^22.0.0"
  }
}
```

### Configuration Vitest Frontend
```typescript
// vitest.config.frontend.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/test/**']
    }
  },
  plugins: [react()]
})
```

### Structure Tests Frontend
```
src/
├── __tests__/
│   ├── components/
│   │   ├── BGGSearch.test.tsx
│   │   └── Layout.test.tsx
│   ├── pages/
│   │   ├── Players.test.tsx
│   │   ├── Games.test.tsx
│   │   └── Dashboard.test.tsx
│   ├── services/
│   │   ├── BGGService.test.ts
│   │   ├── playersService.test.ts
│   │   └── apiClient.test.ts
│   └── utils/
│       ├── testUtils.tsx
│       └── mocks.ts
└── test/
    └── setup.ts
```

---

## 🎯 Objectifs de Coverage

### Backend (Actuel : 100% services database)
- **Maintenir** : 100% services existants
- **Ajouter** : BGGService 90%+ coverage
- **Target** : 95%+ coverage backend global

### Frontend (Actuel : 0%)
- **Phase 1** : 70%+ components critiques
- **Phase 2** : 80%+ services et pages
- **Target final** : 85%+ coverage frontend global

### Integration (Actuel : API seulement)
- **Phase 1** : Workflow BGG complet
- **Phase 2** : CRUD operations E2E
- **Target** : 3-5 tests E2E critiques

---

## 📈 Tracking & Validation

### Métriques de Succès
- [ ] Infrastructure tests frontend opérationnelle
- [ ] BGGService backend 90%+ coverage
- [ ] BGGSearch component testé complètement
- [ ] Workflow BGG E2E fonctionnel
- [ ] Pages CRUD avec tests validation
- [ ] Services frontend avec error handling

### Validation Continue
- **CI/CD** : Tests obligatoires avant merge
- **Coverage gates** : Minimum 80% pour nouveaux fichiers
- **Reviews** : Tests inclus dans code reviews
- **Documentation** : Tests documentés avec examples

---

## 🚧 Risques & Mitigations

### Risques Identifiés
1. **Complexité BGG API** : Tests dépendants API externe
   - **Mitigation** : Mocks pour la plupart, quelques tests réels
2. **Time investment** : Beaucoup de tests à rattraper
   - **Mitigation** : Priorisation par criticité
3. **Maintenance overhead** : Plus de tests = plus de maintenance
   - **Mitigation** : Tests de qualité, bon setup initial

### Success Factors
- **Setup robuste** dès le début
- **Tests simples et maintenables**
- **Coverage progressive** par priorité
- **Integration dans workflow** développement

---

*Ce document doit être mis à jour au fur et à mesure de l'implémentation des tests.*
