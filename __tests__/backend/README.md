# 🧪 Tests Backend — Board Game Score Tracker

Ce dossier contient les tests automatisés pour le backend (Express.js + SQLite).

## Base de données utilisée

Tous les tests utilisent automatiquement la base de test : `backend/database/test.db`.
La sélection est faite dynamiquement dans le code d'initialisation (`initDatabase.ts`).

## Lancer les tests

Sous PowerShell ou bash :

```powershell
npm run test
```

Aucune variable d'environnement n'est nécessaire, la base de test est sélectionnée automatiquement.

## Structure recommandée

- Tests unitaires : `__tests__/backend/`
- Fixtures et mocks : `__tests__/fixtures/`
- Couverture : >80% (voir badge CI)

## Bonnes pratiques

- Ne jamais utiliser la base de production pour les tests
- Nettoyer la base de test entre chaque suite si besoin
- Ajouter des tests pour chaque nouvelle fonctionnalité

---

Pour plus d'informations, voir le README principal à la racine du projet.
