# 🔍 Documentation Linting - Board Game Score Tracker

## 📋 Vue d'ensemble

Le projet utilise un système de linting complet basé sur **ESLint 9** avec TypeScript pour garantir la qualité du code, la cohérence du style et détecter les erreurs potentielles.

## 🛠️ Configuration ESLint

### Fichier principal : `eslint.config.cjs`

```javascript
// Configuration ESLint moderne (flat config)
const typescriptParser = require('@typescript-eslint/parser')
const typescriptPlugin = require('@typescript-eslint/eslint-plugin')
const reactPlugin = require('eslint-plugin-react')
const reactHooksPlugin = require('eslint-plugin-react-hooks')
const importPlugin = require('eslint-plugin-import')
const prettierConfig = require('eslint-config-prettier')

module.exports = [
  // Configuration pour tous les fichiers TypeScript/JavaScript
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    }
  }
]
```

### Plugins et règles activés

#### 🎯 TypeScript (`@typescript-eslint`)
- **Vérification de types** : Détection des erreurs de type
- **Règles strictes** : Variables non utilisées, types explicites
- **Bonnes pratiques** : Éviter `any`, préférer les interfaces

#### ⚛️ React (`eslint-plugin-react`)
- **Hooks Rules** : Validation des règles des hooks React
- **JSX** : Syntaxe et bonnes pratiques JSX
- **Props** : Validation des props et PropTypes

#### 📦 Import/Export (`eslint-plugin-import`)
- **Résolution des modules** : Vérification des imports
- **Ordre des imports** : Organisation cohérente
- **Imports inutilisés** : Détection et suppression

#### 🎨 Prettier Integration
- **Formatage automatique** : Style de code cohérent
- **Pas de conflits** : ESLint + Prettier harmonisés

## 📜 Scripts de Linting

### Scripts disponibles dans `package.json`

```json
{
  "scripts": {
    "lint": "eslint src backend/src __tests__ --ext .ts,.tsx",
    "lint:fix": "eslint src backend/src __tests__ --ext .ts,.tsx --fix",
    "lint:frontend": "eslint src --ext .ts,.tsx",
    "lint:backend": "eslint backend/src --ext .ts",
    "lint:tests": "eslint __tests__ --ext .ts"
  }
}
```

### Usage détaillé

#### 🔍 Vérification complète
```bash
npm run lint
# Lint tout le projet (frontend + backend + tests)
```

#### 🔧 Correction automatique
```bash
npm run lint:fix
# Corrige automatiquement les erreurs fixables
```

#### 📂 Linting ciblé
```bash
npm run lint:frontend  # Frontend uniquement
npm run lint:backend   # Backend uniquement
npm run lint:tests     # Tests uniquement
```

## 🎯 Règles spécifiques du projet

### Variables et fonctions
- **No unused vars** : Variables/imports inutilisés interdits
- **Prefer const** : Utiliser `const` quand possible
- **No var** : Interdiction de `var`, utiliser `let`/`const`

### TypeScript
- **Explicit any** : Éviter `any`, utiliser des types précis
- **Strict types** : Mode strict TypeScript activé
- **Interface over type** : Préférer `interface` à `type`

### React
- **Hook dependencies** : Dépendances complètes dans useEffect
- **Functional components** : Préférer les composants fonctionnels
- **Key props** : Clés obligatoires dans les listes

### Style et formatage
- **Quotes** : Guillemets simples préférés
- **Semicolons** : Points-virgules optionnels mais cohérents
- **Indentation** : 2 espaces (géré par Prettier)

## 🚨 Gestion des erreurs

### Types d'erreurs communes

#### ❌ Variables non utilisées
```typescript
// ❌ Erreur
import { useState, useEffect } from 'react' // useEffect non utilisé

// ✅ Correct
import { useState } from 'react'
```

#### ❌ Type `any` explicite
```typescript
// ❌ Éviter
const data: any = fetchData()

// ✅ Préférer
interface ApiResponse {
  id: number
  name: string
}
const data: ApiResponse = fetchData()
```

#### ❌ Dépendances manquantes
```typescript
// ❌ Erreur
useEffect(() => {
  fetchUser(userId)
}, []) // userId manquant

// ✅ Correct
useEffect(() => {
  fetchUser(userId)
}, [userId])
```

### Désactivation ponctuelle

#### Pour une ligne
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = legacyApiCall()
```

#### Pour un fichier
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
// Fichier avec besoins spécifiques (ex: services BGG)
```

## 🔄 Intégration CI/CD

### GitHub Actions

Le linting est automatiquement exécuté sur :
- **Pull Requests** : Vérification avant merge
- **Push sur main** : Validation continue
- **Tests automatiques** : Intégré au pipeline

### Pre-commit hooks (Husky)

```bash
# .husky/pre-commit
npm run lint
npm run test
```

Empêche les commits avec :
- Erreurs de linting
- Tests en échec

## 📊 Métriques et rapports

### État actuel du projet
- **✅ 0 erreur** ESLint sur tout le projet
- **✅ 0 warning** sur 45+ fichiers TypeScript
- **✅ 100% conformité** aux règles définies

### Couverture par type de fichier
- **Frontend (src/)** : 15+ fichiers lintés
- **Backend (backend/src/)** : 12+ fichiers lintés
- **Tests (__tests__/)** : 8+ fichiers lintés

## 🛡️ Bonnes pratiques

### Configuration d'équipe
1. **IDE Setup** : Extension ESLint activée
2. **Format on Save** : Prettier automatique
3. **Pre-commit** : Hooks configurés

### Maintenance
1. **Mise à jour régulière** des règles ESLint
2. **Review des règles** lors des PR importantes
3. **Documentation** des exceptions spécifiques

### Debugging
```bash
# Vérifier la configuration
npx eslint --print-config src/App.tsx

# Voir les règles appliquées
npx eslint --debug src/

# Tester une règle spécifique
npx eslint --no-eslintrc --config '{"rules": {"no-console": "error"}}' src/
```

---

## 📚 Ressources

- **[ESLint Documentation](https://eslint.org/docs/latest/)**
- **[TypeScript ESLint](https://typescript-eslint.io/)**
- **[React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)**
- **[Prettier Integration](https://prettier.io/docs/en/integrating-with-linters.html)**

---

*Cette documentation est maintenue automatiquement et reflète l'état actuel du système de linting du projet.*
