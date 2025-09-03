/**
 * Service de traduction et recherche multilingue pour les jeux
 */
import { Database } from 'better-sqlite3'
import LoggerService from './loggerService.js'

interface GameTranslation {
  translation_id: number
  game_id_bgg: number
  language_code: string
  translated_name: string
  alternative_names: string[] // JSON parsed
  search_keywords: string
}

interface SearchResult {
  game_id_bgg: number
  game_name: string
  translated_name: string
  language_code: string
  relevance_score: number
  match_reason: 'exact' | 'alternative' | 'keyword' | 'partial'
}

class GameTranslationService {
  private db: Database

  constructor(database: Database) {
    this.db = database
    this.initializeTranslations()
  }

  /**
   * Initialise les tables de traduction
   */
  private initializeTranslations(): void {
    try {
      // Créer la table de traductions si elle n'existe pas
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS game_translations (
          translation_id INTEGER PRIMARY KEY AUTOINCREMENT,
          game_id_bgg INTEGER NOT NULL,
          language_code VARCHAR(5) NOT NULL,
          translated_name VARCHAR(255) NOT NULL,
          alternative_names TEXT,
          search_keywords TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          
          UNIQUE(game_id_bgg, language_code),
          FOREIGN KEY (game_id_bgg) REFERENCES games(game_id_bgg) ON DELETE CASCADE
        )
      `)

      // Index pour améliorer les performances de recherche
      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_translations_search 
        ON game_translations(language_code, translated_name)
      `)

      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_translations_keywords 
        ON game_translations(search_keywords)
      `)

      LoggerService.info('Game translations tables initialized')
    } catch (error) {
      LoggerService.error('Failed to initialize translations tables', {
        error: error instanceof Error ? error.message : String(error)
      })
      throw error
    }
  }

  /**
   * Ajoute ou met à jour une traduction
   */
  addTranslation(translation: Omit<GameTranslation, 'translation_id'>): number {
    try {
      // Vérifier que le jeu existe dans la table games
      const gameExists = this.db
        .prepare(
          `
        SELECT 1 FROM games WHERE game_id_bgg = ?
      `
        )
        .get(translation.game_id_bgg)

      if (!gameExists) {
        LoggerService.warn('Game not found for translation', {
          context: 'GAME_TRANSLATION',
          gameId: translation.game_id_bgg,
          language: translation.language_code
        })
        return -1 // Retourner -1 pour indiquer que la traduction n'a pas été ajoutée
      }

      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO game_translations 
        (game_id_bgg, language_code, translated_name, alternative_names, search_keywords, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `)

      const result = stmt.run(
        translation.game_id_bgg,
        translation.language_code,
        translation.translated_name,
        JSON.stringify(translation.alternative_names),
        translation.search_keywords
      )

      LoggerService.info('Translation added/updated', {
        context: 'GAME_TRANSLATION',
        gameId: translation.game_id_bgg,
        language: translation.language_code,
        translatedName: translation.translated_name
      })

      return result.lastInsertRowid as number
    } catch (error) {
      LoggerService.error('Failed to add translation', {
        context: 'GAME_TRANSLATION',
        gameId: translation.game_id_bgg,
        error: error instanceof Error ? error.message : String(error)
      })
      throw error
    }
  }

  /**
   * Recherche des jeux par nom (multilingue)
   * Fonctionne même si la table games est vide
   */
  searchGames(
    query: string,
    language: string = 'fr',
    limit: number = 10
  ): SearchResult[] {
    try {
      const searchTerm = query.toLowerCase().trim()
      const results: SearchResult[] = []

      // 1. Recherche exacte par nom traduit
      const exactStmt = this.db.prepare(`
        SELECT gt.* 
        FROM game_translations gt
        WHERE LOWER(gt.translated_name) = ? AND gt.language_code = ?
        LIMIT ?
      `)

      const exactMatches = exactStmt.all(
        searchTerm,
        language,
        limit
      ) as unknown[]
      exactMatches.forEach((row: unknown) => {
        const dbRow = row as Record<string, unknown>
        results.push({
          game_id_bgg: Number(dbRow.game_id_bgg),
          game_name: String(dbRow.translated_name), // Utiliser le nom traduit si pas de game_name
          translated_name: String(dbRow.translated_name),
          language_code: String(dbRow.language_code),
          relevance_score: 100,
          match_reason: 'exact'
        })
      })

      // 2. Recherche dans les noms alternatifs
      if (results.length < limit) {
        const altStmt = this.db.prepare(`
          SELECT gt.* 
          FROM game_translations gt
          WHERE gt.alternative_names LIKE ? AND gt.language_code = ?
          AND gt.game_id_bgg NOT IN (${results.map(() => '?').join(',') || 'NULL'})
          LIMIT ?
        `)

        const altParams = [
          `%"${searchTerm}"%`,
          language,
          ...results.map((r) => r.game_id_bgg),
          limit - results.length
        ]
        const altMatches = altStmt.all(...altParams) as unknown[]

        altMatches.forEach((row: unknown) => {
          const dbRow = row as Record<string, unknown>
          results.push({
            game_id_bgg: Number(dbRow.game_id_bgg),
            game_name: String(dbRow.translated_name),
            translated_name: String(dbRow.translated_name),
            language_code: String(dbRow.language_code),
            relevance_score: 85,
            match_reason: 'alternative'
          })
        })
      }

      // 3. Recherche partielle
      if (results.length < limit) {
        const partialStmt = this.db.prepare(`
          SELECT gt.* 
          FROM game_translations gt
          WHERE LOWER(gt.translated_name) LIKE ? AND gt.language_code = ?
          AND gt.game_id_bgg NOT IN (${results.map(() => '?').join(',') || 'NULL'})
          LIMIT ?
        `)

        const partialParams = [
          `%${searchTerm}%`,
          language,
          ...results.map((r) => r.game_id_bgg),
          limit - results.length
        ]
        const partialMatches = partialStmt.all(...partialParams) as unknown[]

        partialMatches.forEach((row: unknown) => {
          const dbRow = row as Record<string, unknown>
          results.push({
            game_id_bgg: Number(dbRow.game_id_bgg),
            game_name: String(dbRow.translated_name),
            translated_name: String(dbRow.translated_name),
            language_code: String(dbRow.language_code),
            relevance_score: 70,
            match_reason: 'partial'
          })
        })
      }

      LoggerService.info('Game search completed', {
        context: 'GAME_TRANSLATION',
        query,
        language,
        resultsCount: results.length
      })

      return results.slice(0, limit)
    } catch (error) {
      LoggerService.error('Game search failed', {
        context: 'GAME_TRANSLATION',
        query,
        error: error instanceof Error ? error.message : String(error)
      })
      return []
    }
  }

  /**
   * Initialise les traductions par défaut pour les jeux principaux
   */
  initializeDefaultTranslations(): void {
    const defaultTranslations = [
      // Citadels
      {
        game_id_bgg: 478,
        language_code: 'fr',
        translated_name: 'Citadelles',
        alternative_names: ['Citadelles Classique', 'Citadelle'],
        search_keywords:
          'médiéval cartes rôles construction ville bruno faidutti'
      },
      {
        game_id_bgg: 478,
        language_code: 'en',
        translated_name: 'Citadels',
        alternative_names: ['Citadels Classic'],
        search_keywords: 'medieval cards roles building city bruno faidutti'
      },

      // This War of Mine
      {
        game_id_bgg: 188920,
        language_code: 'fr',
        translated_name: 'This War of Mine',
        alternative_names: ['Cette Guerre qui est Mienne', 'TWOM'],
        search_keywords:
          'guerre survie coopératif mature guerre civile awaken realms'
      },
      {
        game_id_bgg: 188920,
        language_code: 'en',
        translated_name: 'This War of Mine: The Board Game',
        alternative_names: ['TWOM', 'This War of Mine'],
        search_keywords:
          'war survival cooperative mature civil war awaken realms'
      },

      // Dark Souls
      {
        game_id_bgg: 197831,
        language_code: 'fr',
        translated_name: 'Dark Souls',
        alternative_names: ['Dark Souls le Jeu de Plateau'],
        search_keywords: 'fantasy difficile coopératif donjon boss steamforged'
      },
      {
        game_id_bgg: 197831,
        language_code: 'en',
        translated_name: 'Dark Souls: The Board Game',
        alternative_names: ['DS:TBG', 'Dark Souls'],
        search_keywords:
          'fantasy difficult cooperative dungeon boss steamforged'
      }
    ]

    defaultTranslations.forEach((translation) => {
      try {
        this.addTranslation(translation)
      } catch {
        // Ignore errors - translation might already exist
        LoggerService.warn('Failed to add default translation', {
          context: 'GAME_TRANSLATION',
          gameId: translation.game_id_bgg,
          language: translation.language_code
        })
      }
    })

    LoggerService.info('Default translations initialized', {
      context: 'GAME_TRANSLATION',
      count: defaultTranslations.length
    })
  }
}

export default GameTranslationService
