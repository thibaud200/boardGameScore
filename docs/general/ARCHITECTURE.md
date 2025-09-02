# 🏗️ Architecture & Bonnes Pratiques — Board Game Score Tracker

Ce document définit les principes architecturaux et les bonnes pratiques à respecter dans le projet.

---

## 🎯 Principes SOLID

### **S** - Single Responsibility Principle (SRP)
**"Une classe ne devrait avoir qu'une seule raison de changer"**

#### ✅ Application dans le projet
- **Services backend** : Chaque service gère une seule entité
  - `playerService.ts` → Gestion des joueurs uniquement
  - `gameService.ts` → Gestion des jeux uniquement
  - `gameSessionService.ts` → Gestion des sessions uniquement
- **Composants React** : Responsabilité unique et claire
  - `PlayerForm` → Formulaire joueur uniquement
  - `GameCard` → Affichage carte jeu uniquement

#### 🚫 Anti-patterns à éviter
```typescript
// ❌ Mauvais : Service avec multiples responsabilités
class GamePlayerSessionService {
  createPlayer() { /* ... */ }
  updateGame() { /* ... */ }
  calculateStats() { /* ... */ }
  sendEmail() { /* ... */ }
}

// ✅ Bon : Services spécialisés
class PlayerService {
  createPlayer() { /* ... */ }
  updatePlayer() { /* ... */ }
}
class GameService {
  updateGame() { /* ... */ }
}
```

### **O** - Open/Closed Principle (OCP)
**"Ouvert à l'extension, fermé à la modification"**

#### ✅ Application dans le projet
- **Architecture modulaire** : Nouveaux services ajoutables sans modification
- **Types TypeScript extensibles** : Interfaces permettant l'extension
- **API REST** : Nouveaux endpoints sans casser l'existant

#### 📝 Exemple concret
```typescript
// ✅ Interface extensible
interface BaseGameData {
  id: number;
  name: string;
}

// Extension sans modification de la base
interface BGGGameData extends BaseGameData {
  bggId: number;
  rating: number;
  complexity: number;
}
```

### **L** - Liskov Substitution Principle (LSP)
**"Les sous-classes doivent pouvoir remplacer leurs classes parentes"**

#### ✅ Application dans le projet
- **Services cohérents** : Tous respectent le même contrat
- **Composants substituables** : Props interfaces cohérentes
- **Réponses API uniformes** : Structure standardisée

#### 📝 Exemple concret
```typescript
// ✅ Contrat respecté par tous les services
interface Service<T> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<boolean>;
}

// Tous les services respectent ce contrat
class PlayerService implements Service<Player> { /* ... */ }
class GameService implements Service<Game> { /* ... */ }
```

### **I** - Interface Segregation Principle (ISP)
**"Ne pas forcer à dépendre d'interfaces non utilisées"**

#### ✅ Application dans le projet
- **Types spécialisés** : `Player`, `Game`, `GameSession` séparés
- **Props composants** : Interfaces minimales et ciblées
- **API endpoints** : Réponses adaptées au besoin

#### 📝 Exemple concret
```typescript
// ✅ Interfaces spécialisées
interface PlayerBasicInfo {
  id: number;
  name: string;
}

interface PlayerFullProfile extends PlayerBasicInfo {
  email?: string;
  createdAt: string;
  stats: PlayerStats;
}

// Composants utilisent ce dont ils ont besoin
const PlayerCard = ({ player }: { player: PlayerBasicInfo }) => { /* ... */ };
const PlayerProfile = ({ player }: { player: PlayerFullProfile }) => { /* ... */ };
```

### **D** - Dependency Inversion Principle (DIP)
**"Dépendre d'abstractions, pas de concrétions"**

#### ✅ Application dans le projet
- **Services** : Dépendent de types TypeScript, pas d'implémentations
- **API client** : Abstraction HTTP générique
- **Base de données** : Abstraction via services

#### 📝 Exemple concret
```typescript
// ✅ Dépendance sur abstraction
interface DatabaseAdapter {
  query(sql: string, params: any[]): Promise<any[]>;
}

class PlayerService {
  constructor(private db: DatabaseAdapter) {} // Abstraction
  
  async getAll(): Promise<Player[]> {
    return this.db.query('SELECT * FROM players', []);
  }
}

// ✅ Implémentation concrète injectée
const sqliteAdapter: DatabaseAdapter = new SQLiteAdapter();
const playerService = new PlayerService(sqliteAdapter);
```

---

## 🎨 Architecture Frontend

### 📁 Structure des composants
```
src/
├── components/
│   ├── ui/           # Composants réutilisables (boutons, inputs)
│   ├── features/     # Composants métier (PlayerForm, GameCard)
│   └── layout/       # Composants layout (Header, Navigation)
├── pages/            # Pages principales
├── services/         # Clients API
├── types/            # Types TypeScript
└── utils/            # Utilitaires
```

### 🔧 Bonnes pratiques React
- **Composants fonctionnels** : Préférer les hooks aux classes
- **Props typées** : Interfaces TypeScript strictes
- **État local minimal** : Éviter la sur-utilisation du state
- **Réutilisabilité** : Composants génériques dans `ui/`

---

## 🗄️ Architecture Backend

### 📁 Structure des services
```
backend/src/
├── services/         # Logique métier
├── routes/           # Endpoints API
├── types/            # Types partagés
└── database/         # Configuration DB
```

### 🔧 Bonnes pratiques Express
- **Middleware** : Validation, erreurs, logging
- **Routes RESTful** : Convention HTTP claire
- **Gestion erreurs** : Codes HTTP appropriés
- **Validation** : Entrées utilisateur strictes

---

## 🧪 Architecture Tests

### 🎯 Stratégie de tests
- **Tests unitaires** : Services individuels
- **Tests intégration** : API endpoints complets
- **Isolation** : Base de test séparée
- **Fixtures** : Données cohérentes

### 📝 Standards tests
```typescript
// ✅ Structure de test cohérente
describe('PlayerService', () => {
  beforeEach(() => {
    // Setup isolation
  });
  
  describe('create', () => {
    it('should create player with valid data', async () => {
      // Arrange, Act, Assert
    });
  });
});
```

---

## 🚀 Évolution Architecture

### 📈 Extensibilité prévue
- **BGG Integration** : Service externe modulaire
- **Templates jeux** : Système configurable
- **Statistiques** : Module analytique séparé
- **Multi-langues** : Internationalisation

### 🎯 Maintien qualité
- **Code reviews** : Validation principes SOLID
- **Tests automatisés** : Couverture >80%
- **Linting** : Standards code stricts
- **Documentation** : Architecture à jour

---

Ce document doit être respecté pour tous les développements futurs du projet.
