# 🎯 Board Game Score Tracker

A comprehensive web application for managing board game sessions, tracking scores, and analyzing gaming statistics with BoardGameGeek integration and automatic character detection.

## 🌟 Features

### 🎮 Game Management
- **BoardGameGeek Integration**: Search and import games directly from BGG with complete metadata
- **Automatic Extensions**: Import expansions and add-ons automatically
- **Character Detection**: Automatic character scraping from UltraBoardGames.com for 6+ supported games
- **Smart Workflow**: BGG search → Form pre-fill → Intelligent creation

### 👥 Player Management  
- **Complete CRUD**: Add, edit, delete, and manage players
- **Statistics Tracking**: Performance metrics and game history
- **Profile Management**: Detailed player information and preferences

### 🎲 Session Tracking
- **Game Sessions**: Record and manage gaming sessions
- **Score Management**: Track individual and cooperative scores
- **Character Selection**: Assign characters/roles to players
- **Statistics**: Automatic calculation of wins, averages, and trends

### 📊 Analytics & Statistics
- **Player Stats**: Win rates, average scores, favorite games
- **Game Analytics**: Play frequency, duration tracking, popularity metrics
- **Performance Trends**: Visual charts and progression analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 24.x or higher
- npm 10.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/thibaud200/boardGameScore.git
cd boardGameScore

# Install dependencies
npm install

# Initialize database
npm run db:migrate

# Start development servers
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Vite
- **Backend**: Node.js, Express 5, TypeScript
- **Database**: SQLite with better-sqlite3
- **Testing**: Vitest, React Testing Library
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier, Husky

### Project Structure
```
boardGameScore/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Main application pages
│   ├── services/          # API client services
│   ├── types/             # TypeScript interfaces
│   └── utils/             # Frontend utilities
├── backend/               # Express backend
│   ├── src/
│   │   ├── services/      # Business logic services
│   │   └── server.ts      # Express server
│   └── database/          # SQLite database & migrations
├── __tests__/             # Test suites
│   ├── backend/           # Backend unit tests
│   └── integration/       # API integration tests
└── docs/                  # Project documentation
```

## 🎯 Supported Games

Current games with automatic character detection:
- **Gloomhaven** (174430) - Full character roster
- **Jaws of the Lion** (291457) - Complete character set
- **Frosthaven** (295770) - All characters and classes
- **Arkham Horror LCG** (205637) - Investigators and roles
- **Spirit Island** (162886) - Spirit characters
- **Aeon's End** (191189) - Breach mages

More games are continuously being added through the external data service.

## 🧪 Testing

### Test Suite Status: ✅ 33/33 tests passing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit        # Backend unit tests (11 tests)
npm run test:integration # API integration tests (22 tests)
```

### Test Architecture
- **Unit Tests**: Individual service testing with mocked dependencies
- **Integration Tests**: Full API endpoint testing with real database
- **Database Isolation**: Each test runs with fresh fixtures
- **CI/CD Integration**: Automated testing on every commit

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Frontend only (Vite dev server)
npm run dev:backend      # Backend only (Express with nodemon)

# Building
npm run build            # Production build
npm run preview          # Preview production build

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Populate with test data
npm run db:reset         # Reset database completely

# Code Quality
npm run lint             # ESLint check
npm run lint:fix         # Fix ESLint issues
npm run format           # Prettier formatting
npm run type-check       # TypeScript validation
npm run quality          # Run all quality checks
```

### Development Workflow

1. **Create Feature Branch**: `git checkout -b feature/your-feature`
2. **Develop**: Make changes following TypeScript strict mode
3. **Test**: Ensure all tests pass (`npm test`)
4. **Quality Check**: Run linting and formatting (`npm run quality`)
5. **Commit**: Use conventional commits (enforced by Husky)
6. **Push**: CI/CD pipeline runs automatically

## 🌐 External Integrations

### BoardGameGeek API
- **Search Integration**: Real-time game search
- **Metadata Import**: Complete game information including images, descriptions, mechanics
- **Extension Detection**: Automatic discovery of expansions and add-ons
- **Caching Strategy**: Intelligent caching to optimize API usage

### UltraBoardGames Character Service
- **Automatic Scraping**: Character data extraction for supported games
- **Image Processing**: Character artwork and portraits
- **Metadata Enhancement**: Character classes, abilities, and descriptions
- **Extensible Framework**: Easy addition of new game sources

## 📊 Database Schema

### Core Tables
- **`games`**: Game information with BGG integration
- **`game_extensions`**: Expansions and add-ons (normalized)
- **`game_characters`**: Character data (normalized)
- **`players`**: Player profiles and information
- **`game_sessions`**: Gaming session records
- **`player_game_stats`**: Individual player statistics
- **`game_stats`**: Aggregated game statistics

### Key Features
- **Referential Integrity**: Foreign key constraints throughout
- **Normalized Design**: Separate tables for extensions and characters
- **Migration System**: Versioned database schema updates
- **Test Isolation**: Separate test database with automatic cleanup

## 🚦 API Documentation

The backend provides a RESTful API with the following endpoints:

### Games
- `GET /api/games` - List all games
- `GET /api/games/:id` - Get specific game
- `POST /api/games` - Create new game
- `PUT /api/games/:id` - Update game
- `DELETE /api/games/:id` - Delete game

### Players
- `GET /api/players` - List all players
- `GET /api/players/:id` - Get specific player
- `POST /api/players` - Create new player
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player

### Sessions & Statistics
- Session management endpoints
- Player statistics endpoints
- Game analytics endpoints

> For complete API documentation, see [`docs/API_DOC.md`](docs/API_DOC.md)

## 🎯 Roadmap

### Current Status (September 2025)
- ✅ **Backend**: Complete with 33/33 tests passing
- ✅ **BGG Integration**: Full search and import functionality
- ✅ **Character Service**: 6+ games supported with automatic detection
- ✅ **Frontend Architecture**: React 19 with TypeScript and modern tooling

### Next Steps
- **UI/UX Enhancement**: Modern dashboard and improved user interface
- **Session Management**: Complete game session workflow
- **Advanced Analytics**: Detailed statistics and performance tracking
- **Mobile Support**: Responsive design and mobile optimization

See [`docs/general/ROADMAP.md`](docs/general/ROADMAP.md) for detailed roadmap.

## 🤝 Contributing

### Prerequisites
- Read the [Development Guidelines](docs/general/CONTEXT.md)
- Understand the [Architecture](docs/general/ARCHITECTURE_COMPLETE.md)
- Review the [Technical Standards](docs/general/TECHNICAL_GUIDELINES.md)

### Code Standards
- **TypeScript Strict**: No `any` types allowed
- **Testing Required**: All new features must include tests
- **Linting**: Zero ESLint errors policy
- **Conventional Commits**: Enforced commit message format
- **Documentation**: Update relevant docs with changes

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make changes following project standards
4. Ensure all tests pass and linting is clean
5. Update documentation as needed
6. Submit PR with clear description

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Documentation**: [`docs/`](docs/)
- **Backend API**: [`backend/`](backend/)
- **Tests**: [`__tests__/`](__tests__/)
- **Database Schema**: [`backend/database/docs/database-structure.md`](backend/database/docs/database-structure.md)

---

**Last Updated**: September 2025  
**Version**: 1.0.0  
**Maintainer**: [@thibaud200](https://github.com/thibaud200)
