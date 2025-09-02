/**
 * Tests corrigés pour la page Games
 * Correction des problèmes d'accessibilité et de sélecteurs
 */
import React from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup
} from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import Games from '../../pages/Games'
import { GamesService } from '../../services/gamesService'
import type { Game, CreateGameRequest } from '../../types'

// Mock des services
vi.mock('../../services/gamesService', () => ({
  GamesService: {
    getAllGames: vi.fn(),
    createGame: vi.fn(),
    updateGame: vi.fn(),
    deleteGame: vi.fn()
  }
}))

// Mock du composant BGGSearch pour les tests
vi.mock('../../components/BGGSearch', () => ({
  default: ({ onImport }: { onImport: (data: CreateGameRequest) => void }) => (
    <div data-testid="bgg-search-mock">
      <h3>Mock BGG Search</h3>
      <button
        onClick={() =>
          onImport({
            game_id_bgg: '174430',
            game_name: 'Gloomhaven',
            game_description: 'Epic adventure game',
            game_image: 'https://example.com/gloomhaven.jpg',
            has_characters: true,
            min_players: 1,
            max_players: 4,
            supports_cooperative: true,
            supports_competitive: false,
            supports_campaign: true,
            default_mode: 'cooperative'
          })
        }
      >
        Mock Import BGG
      </button>
    </div>
  )
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockGamesService = GamesService as any

// Données de test
const mockGames: Game[] = [
  {
    game_id: 1,
    game_name: 'Wingspan',
    game_description: 'Beautiful bird-themed engine builder',
    game_image: 'https://example.com/wingspan.jpg',
    has_characters: false,
    min_players: 1,
    max_players: 5,
    supports_cooperative: false,
    supports_competitive: true,
    supports_campaign: false,
    default_mode: 'competitive',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    game_id: 2,
    game_name: 'Pandemic',
    game_description: 'Cooperative disease-fighting game',
    game_image: 'https://example.com/pandemic.jpg',
    has_characters: true,
    min_players: 2,
    max_players: 4,
    supports_cooperative: true,
    supports_competitive: false,
    supports_campaign: false,
    default_mode: 'cooperative',
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    game_id: 3,
    game_name: 'Gloomhaven',
    game_description: 'Epic dungeon crawler campaign',
    game_image: 'https://example.com/gloomhaven.jpg',
    has_characters: true,
    min_players: 1,
    max_players: 4,
    supports_cooperative: true,
    supports_competitive: false,
    supports_campaign: true,
    default_mode: 'cooperative',
    created_at: '2024-01-03T00:00:00Z'
  }
]

describe('Games Page - Tests Corrigés', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGamesService.getAllGames.mockResolvedValue(mockGames)
    mockGamesService.createGame.mockResolvedValue({
      game_id: 4,
      game_name: 'New Game',
      game_description: 'New description',
      game_image: null,
      has_characters: false,
      min_players: 1,
      max_players: 4,
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: false,
      default_mode: 'competitive',
      created_at: '2024-01-04T00:00:00Z'
    })
    mockGamesService.updateGame.mockResolvedValue(undefined)
    mockGamesService.deleteGame.mockResolvedValue(undefined)
  })

  afterEach(() => {
    // Nettoyer le DOM entre les tests
    cleanup()
    document.body.innerHTML = ''
  })

  describe('Rendu initial', () => {
    it('devrait afficher la liste des jeux', async () => {
      render(<Games />)

      await waitFor(() => {
        expect(screen.getAllByText('Wingspan')[0]).toBeInTheDocument()
        expect(screen.getAllByText('Pandemic')[0]).toBeInTheDocument()
        expect(screen.getAllByText('Gloomhaven')[0]).toBeInTheDocument()
      })
    })

    it('devrait afficher le bouton Ajouter un jeu', async () => {
      render(<Games />)

      await waitFor(() => {
        expect(screen.getByText('Ajouter un jeu')).toBeInTheDocument()
      })
    })
  })

  describe('Création de jeu', () => {
    it('devrait créer un nouveau jeu avec des données correctes', async () => {
      render(<Games />)

      // Attendre le chargement et cliquer sur "Ajouter un jeu"
      await waitFor(() => {
        expect(screen.getAllByText('Wingspan')[0]).toBeInTheDocument()
      })

      const addButton = screen.getAllByRole('button', {
        name: /ajouter un jeu/i
      })[0]
      fireEvent.click(addButton)

      // Attendre que le formulaire apparaisse
      await waitFor(() => {
        expect(screen.getByText('Ajouter un nouveau jeu')).toBeInTheDocument()
      })

      // Remplir le formulaire en utilisant des sélecteurs robustes
      const textInputs = screen.getAllByRole('textbox')
      const nameInput = textInputs[0] // Premier input text (nom du jeu)

      fireEvent.change(nameInput, { target: { value: 'Test Game' } })

      // Soumettre le formulaire
      const createButton = screen.getByRole('button', { name: /créer/i })
      fireEvent.click(createButton)

      // Vérifier que le service a été appelé
      await waitFor(() => {
        expect(mockGamesService.createGame).toHaveBeenCalledWith(
          expect.objectContaining({
            game_name: 'Test Game'
          })
        )
      })
    })
  })

  describe('Modification de jeu', () => {
    it('devrait ouvrir le formulaire de modification avec les données existantes', async () => {
      render(<Games />)

      // Attendre le chargement
      await waitFor(() => {
        expect(screen.getAllByText('Wingspan')[0]).toBeInTheDocument()
      })

      // Cliquer sur le bouton modifier du premier jeu
      const editButtons = screen.getAllByText(/modifier/i)
      fireEvent.click(editButtons[0])

      // Vérifier que le formulaire est pré-rempli
      await waitFor(() => {
        const textInputs = screen.getAllByRole('textbox')
        const nameInput = textInputs[0]
        expect(nameInput).toHaveValue('Wingspan')
      })
    })

    it('devrait mettre à jour un jeu existant', async () => {
      render(<Games />)

      // Attendre le chargement
      await waitFor(() => {
        expect(screen.getAllByText('Wingspan')[0]).toBeInTheDocument()
      })

      // Cliquer sur modifier
      const editButtons = screen.getAllByText(/modifier/i)
      fireEvent.click(editButtons[0])

      // Modifier les données
      await waitFor(() => {
        const textInputs = screen.getAllByRole('textbox')
        const nameInput = textInputs[0]
        fireEvent.change(nameInput, { target: { value: 'Wingspan Updated' } })
      })

      // Soumettre
      const updateButton = screen.getByRole('button', {
        name: /mettre à jour/i
      })
      fireEvent.click(updateButton)

      // Vérifier l'appel du service
      await waitFor(() => {
        expect(mockGamesService.updateGame).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            game_name: 'Wingspan Updated'
          })
        )
      })
    })
  })

  describe('Suppression de jeu', () => {
    it('devrait supprimer un jeu après confirmation', async () => {
      // Mock de window.confirm
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      render(<Games />)

      // Attendre le chargement
      await waitFor(() => {
        expect(screen.getAllByText('Wingspan')[0]).toBeInTheDocument()
      })

      // Cliquer sur supprimer
      const deleteButtons = screen.getAllByText(/supprimer/i)
      fireEvent.click(deleteButtons[0])

      // Vérifier l'appel du service
      await waitFor(() => {
        expect(mockGamesService.deleteGame).toHaveBeenCalledWith(1)
      })

      confirmSpy.mockRestore()
    })
  })

  describe('Import BGG', () => {
    it('devrait importer un jeu depuis BGG', async () => {
      render(<Games />)

      // Attendre le chargement
      await waitFor(() => {
        expect(screen.getAllByText('Wingspan')[0]).toBeInTheDocument()
      })

      // Cliquer sur "Ajouter un jeu" pour afficher le formulaire
      const addButton = screen.getAllByRole('button', {
        name: /ajouter un jeu/i
      })[0]
      fireEvent.click(addButton)

      // Utiliser le mock BGG
      await waitFor(() => {
        const bggButton = screen.getByText('Mock Import BGG')
        fireEvent.click(bggButton)
      })

      // Vérifier que les données BGG sont importées
      await waitFor(() => {
        const textInputs = screen.getAllByRole('textbox')
        const nameInput = textInputs[0]
        expect(nameInput).toHaveValue('Gloomhaven')
      })
    })
  })
})
