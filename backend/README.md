# 🚀 Backend - Board Game Score Tracker

> **Serveur Express.js complet** avec API REST, intégration BoardGameGeek et base de données SQLite.

## 🎯 **Architecture Backend**

### 🗄️ **Base de Données SQLite**
- **Production** : `database/database.db` - Base principale 
- **Tests** : `database/test.db` - Base isolée pour tests
- **Initialisation automatique** : Schéma créé au démarrage
- **Services modulaires** : Un service par table (players, games, etc.)

### 🌐 **API REST Complète**
- **10 endpoints** CRUD pour toutes les entités
- **Validation des entrées** côté serveur
- **Gestion d'erreurs** structurée
- **Types TypeScript** stricts

### � **Intégration BoardGameGeek**
- **Service BGG** : Recherche et détails de jeux
- **Cache intelligent** : 24h TTL, rate limiting
- **Conversion automatique** : BGG → format base locale
- **Types complets** : Structures XML typées

## 🚀 **Démarrage du Backend**

### 📋 **Prérequis**
```bash
# Node.js 18+ requis
node --version  # Vérifier >= 18.0.0
```

### ⚡ **Démarrage Rapide**
```bash
# Depuis la racine du projet
npm run dev:backend
# ➡️ Serveur sur http://localhost:3001

# Ou démarrage complet (frontend + backend)
npm run dev:full
```

### � **Démarrage Manuel**
```bash
# Depuis backend/
cd backend
npm install                    # Installation dépendances
npm run dev                   # Serveur développement
# OU
tsx src/server.ts             # Lancement direct avec tsx
```

### ✅ **Vérification du Démarrage**
Le serveur affiche au démarrage :
```
Base de données initialisée avec le schéma.
Server running on port 3001
```

### 🌐 **Test de Connectivité**
```bash
# Test endpoint health
curl http://localhost:3001/api/players
# Réponse : [] (liste vide si aucun joueur)

# Test intégration BGG
curl "http://localhost:3001/api/bgg/search?q=Gloomhaven"
# Réponse : JSON avec résultats de recherche
```

## 📁 **Structure Backend**

```
backend/
├── src/
│   ├── server.ts                    # Serveur Express principal
│   ├── database.ts                  # Configuration SQLite
│   ├── initDatabase.ts              # Initialisation base production
│   ├── initTestDatabase.ts          # Initialisation base test
│   └── services/                    # Services métier
│       ├── playerService.ts         # CRUD Players
│       ├── gameService.ts           # CRUD Games
│       ├── gameSessionService.ts    # CRUD Sessions
│       ├── gameCharacterService.ts  # CRUD Characters
│       ├── gameExtensionService.ts  # CRUD Extensions
│       ├── gameStatsService.ts      # CRUD Game Stats
│       ├── playerGameStatsService.ts # CRUD Player Stats
│       ├── playerStatsService.ts    # CRUD Player Stats
│       ├── currentGameService.ts    # État partie courante
│       └── bggService.ts            # Intégration BoardGameGeek
├── database/
│   ├── database.db                  # Base production
│   ├── test.db                     # Base tests
│   └── docs/
│       └── database-structure.md   # Documentation DB
├── package.json
├── tsconfig.json
└── README.md
```

## 🌐 **API Endpoints**

### � **Players** (`/api/players`)
```bash
GET    /api/players           # Liste tous les joueurs
GET    /api/players/:id       # Détails d'un joueur
POST   /api/players           # Créer un joueur
DELETE /api/players/:id       # Supprimer un joueur
```

### 🎮 **Games** (`/api/games`)
```bash
GET    /api/games             # Liste tous les jeux
GET    /api/games/:id         # Détails d'un jeu
POST   /api/games             # Créer un jeu
DELETE /api/games/:id         # Supprimer un jeu
```

### 🕹️ **Game Sessions** (`/api/game-sessions`)
```bash
GET    /api/game-sessions     # Liste toutes les sessions
GET    /api/game-sessions/:id # Détails d'une session
POST   /api/game-sessions     # Créer une session
DELETE /api/game-sessions/:id # Supprimer une session
```

### 🔍 **BoardGameGeek** (`/api/bgg`)
```bash
GET    /api/bgg/search?q=nom     # Rechercher des jeux BGG
GET    /api/bgg/game/:id         # Détails d'un jeu BGG
POST   /api/bgg/import/:id       # Importer un jeu BGG (optionnel)
```

**Exemples d'utilisation :**
```bash
# Créer un joueur
curl -X POST http://localhost:3001/api/players \
  -H "Content-Type: application/json" \
  -d '{"player_name":"Alice"}'

# Rechercher un jeu sur BGG
curl "http://localhost:3001/api/bgg/search?q=Gloomhaven"

# Créer un jeu
curl -X POST http://localhost:3001/api/games \
  -H "Content-Type: application/json" \
  -d '{"game_name":"Citadels","min_players":2,"max_players":6}'
```

## 🛠️ **Développement & Maintenance**

### 📦 **Technologies**
- **Express.js 5** : Serveur web moderne
- **TypeScript 5** : Typage strict
- **SQLite + better-sqlite3** : Base de données intégrée
- **Node.js 20+** : Runtime LTS
- **xml2js** : Parsing XML BoardGameGeek
- **node-fetch** : Client HTTP pour BGG

### ⚡ **Scripts Disponibles**
```bash
# Depuis la racine
npm run dev:backend       # Serveur développement
npm run dev:full          # Frontend + Backend ensemble

# Depuis backend/
npm run dev               # Serveur développement
npm run build             # Build TypeScript
npm start                 # Production (après build)
npm test                  # Tests backend (33 tests)
```

### 🔧 **Configuration**
```typescript
// server.ts - Configuration principale
const PORT = process.env.PORT || 3001

// CORS pour frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  // ...
})
```

### 🐛 **Dépannage**
```bash
# Port déjà utilisé
lsof -ti:3001 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3001   # Windows

# Réinitialiser la base
rm backend/database/database.db
npm run dev:backend  # Recrée automatiquement

# Vérifier les logs
# Les erreurs s'affichent dans la console du serveur
```

### 📊 **Tests**
```bash
# Tests complets (33/33)
npm test
# ✅ 22 tests d'intégration API
# ✅ 11 tests unitaires services
```

### 🔧 **Variables d'Environnement**
```bash
# .env (optionnel)
PORT=3001                    # Port du serveur
NODE_ENV=development         # Environnement
BGG_API_TIMEOUT=10000       # Timeout requêtes BGG (ms)
LOG_LEVEL=debug             # Niveau de logs
```

## 📈 **Monitoring & Logs**

### 📊 **Logs Structurés**
```javascript
// Exemples de logs
logger.debug('BGG Proxy Request: https://boardgamegeek.com/xmlapi2/search?query=Citadels')
logger.debug('BGG Response (first 200 chars): <?xml version="1.0" encoding="UTF-8"?>')
logger.error('BGG API Error: 503 Service Unavailable')
```

### 🔍 **Debugging**
```bash
# Mode debug avec logs détaillés
DEBUG=* npm run dev

# Vérification du proxy
curl -v "http://localhost:3001/api/bgg/search?query=test"
```

## 🚀 **Déploiement**

### 🐳 **Docker** (Optionnel)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src/ ./src/
EXPOSE 3001
CMD ["npm", "start"]
```

### ☁️ **Cloud Deploy**
```bash
# Heroku
git subtree push --prefix backend heroku main

# Vercel (avec vercel.json)
npx vercel --prod

# Railway
railway login && railway deploy
```

### 🔧 **Variables Production**
```bash
PORT=3001
NODE_ENV=production
BGG_API_TIMEOUT=15000
LOG_LEVEL=info
```

## 🧪 **Tests & Validation**

### ✅ **Tests Manuels**
```bash
# Test proxy BGG fonctionnel
curl "http://localhost:3001/api/bgg/search?query=Citadels" | head -c 200

# Test gestion d'erreurs  
curl "http://localhost:3001/api/bgg/invalid-endpoint"

# Test CORS headers
curl -H "Origin: http://localhost:5173" "http://localhost:3001/api/bgg/search?query=test"
```

### 🛠️ **Tests Automatisés** (Futures)
```javascript
// Exemples de tests à implémenter
describe('BGG Proxy', () => {
  it('should proxy BGG requests correctly')
  it('should handle CORS properly')
  it('should return XML responses')
  it('should handle API errors gracefully')
})
```

## 🔮 **Évolutions Futures**

### Phase 1 : Optimisations
- [ ] **Cache Redis** : Cache des réponses BGG fréquentes
- [ ] **Rate limiting** : Protection contre les abus API
- [ ] **Compression** : Gzip pour réponses volumineuses
- [ ] **Health checks** : Monitoring uptime et performance

### Phase 2 : Fonctionnalités Avancées
- [ ] **WebSocket** : Real-time pour parties collaboratives
- [ ] **API REST** : Endpoints pour synchronisation multi-device
- [ ] **Authentification** : JWT pour fonctionnalités premium
- [ ] **Database API** : Endpoints pour backup/restore centralisé

---

**📅 Dernière mise à jour** : Décembre 2025  
**🎯 Statut** : ✅ Fonctionnel - Proxy BGG opérationnel  
**🔧 Complexité** : Minimal - Serveur simple et efficace
