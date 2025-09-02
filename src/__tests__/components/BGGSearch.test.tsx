/**
 * Tests pour le composant BGGSearch
 * Phase 3 - Frontend Components (Priorité Critique selon TESTS_ROADMAP.md)
 *
 * Tests couverts:
 * 1. Rendu initial et interface utilisateur
 * 2. Gestion de la recherche BGG
 * 3. Affichage des résultats de recherche
 * 4. Gestion de la sélection et des détails
 * 5. Processus d'import et callback
 * 6. Gestion d'erreurs et états de chargement
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import BGGSearch from '../../components/BGGSearch'
import { BGGService } from '../../services/BGGService'
import type { BGGSearchResult, BGGGameDetails } from '../../types/bgg.types'
import type { CreateGameRequest } from '../../types'

// Mock du BGGService
vi.mock('../../services/BGGService', () => ({
  BGGService: {
    searchGames: vi.fn(),
    getGameDetails: vi.fn()
  }
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockBGGService = BGGService as any

// Données de test pour BGG
const mockSearchResults: BGGSearchResult[] = [
  {
    id: '174430',
    name: 'Gloomhaven',
    yearPublished: 2017
  },
  {
    id: '224517',
    name: 'Brass: Birmingham',
    yearPublished: 2018
  },
  {
    id: '167791',
    name: 'Terraforming Mars',
    yearPublished: 2016
  }
]

const mockGameDetails: BGGGameDetails = {
  id: '174430',
  name: 'Gloomhaven',
  yearPublished: 2017,
  minPlayers: 1,
  maxPlayers: 4,
  playingTime: 120,
  minPlayingTime: 60,
  maxPlayingTime: 150,
  age: 14,
  description:
    'Gloomhaven is a game of Euro-inspired tactical combat in a persistent world of shifting motives.',
  image:
    'https://cf.geekdo-images.com/sVmaCNJ8sJ3WPYj0h04_EA__original/img/xTOZdU6mJhC0Jj7l2pzX9KdU0qg=/0x0/filters:format(jpeg)/pic2437871.jpg',
  thumbnail:
    'https://cf.geekdo-images.com/sVmaCNJ8sJ3WPYj0h04_EA__thumb/img/xTOZdU6mJhC0Jj7l2pzX9KdU0qg=/0x0/filters:format(jpeg)/pic2437871.jpg',
  complexity: 3.86,
  rating: 8.7,
  categories: ['Adventure', 'Exploration', 'Fantasy', 'Fighting'],
  mechanics: [
    'Cooperative Game',
    'Grid Movement',
    'Hand Management',
    'Legacy Game',
    'Modular Board'
  ],
  families: ['Campaign Games', 'Legacy']
}

describe('BGGSearch Component', () => {
  const mockOnImport = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendu initial et interface', () => {
    it('devrait afficher le formulaire de recherche BGG', () => {
      render(<BGGSearch onImport={mockOnImport} />)

      // Vérifier la présence des éléments de base
      expect(
        screen.getByText('🔍 Importer depuis BoardGameGeek')
      ).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('Rechercher un jeu sur BGG...')
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Rechercher' })
      ).toBeInTheDocument()
    })

    it('devrait avoir le champ de recherche vide au démarrage', () => {
      render(<BGGSearch onImport={mockOnImport} />)

      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      expect(searchInput).toHaveValue('')
    })

    it('devrait désactiver le bouton rechercher quand le champ est vide', () => {
      render(<BGGSearch onImport={mockOnImport} />)

      const searchButton = screen.getByRole('button', { name: 'Rechercher' })
      expect(searchButton).toBeDisabled()
    })

    it('devrait activer le bouton rechercher quand on tape du texte', () => {
      render(<BGGSearch onImport={mockOnImport} />)

      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      const searchButton = screen.getByRole('button', { name: 'Rechercher' })

      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })
      expect(searchButton).not.toBeDisabled()
    })
  })

  describe('Gestion de la recherche BGG', () => {
    it('devrait appeler BGGService.searchGames lors de la soumission du formulaire', async () => {
      mockBGGService.searchGames.mockResolvedValue(mockSearchResults)

      render(<BGGSearch onImport={mockOnImport} />)

      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      const searchButton = screen.getByRole('button', { name: 'Rechercher' })

      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockBGGService.searchGames).toHaveBeenCalledWith('Gloomhaven')
      })
    })

    it('devrait afficher un indicateur de chargement pendant la recherche', async () => {
      mockBGGService.searchGames.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockSearchResults), 100)
          )
      )

      render(<BGGSearch onImport={mockOnImport} />)

      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })

      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      // Vérifier que le bouton montre l'état de chargement
      expect(screen.getByRole('button', { name: '🔄' })).toBeInTheDocument()

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Rechercher' })
        ).toBeInTheDocument()
      })
    })

    it('ne devrait pas faire de recherche si le champ est vide', async () => {
      render(<BGGSearch onImport={mockOnImport} />)

      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      expect(mockBGGService.searchGames).not.toHaveBeenCalled()
    })
  })

  describe('Affichage des résultats de recherche', () => {
    it('devrait afficher les résultats de recherche', async () => {
      mockBGGService.searchGames.mockResolvedValue(mockSearchResults)

      render(<BGGSearch onImport={mockOnImport} />)

      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })

      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Résultats de recherche :')).toBeInTheDocument()
        expect(screen.getByText('Gloomhaven')).toBeInTheDocument()
        expect(screen.getByText('(2017)')).toBeInTheDocument()
        expect(screen.getByText('Brass: Birmingham')).toBeInTheDocument()
        expect(screen.getByText('Terraforming Mars')).toBeInTheDocument()
      })
    })

    it('devrait afficher des boutons "Voir détails" pour chaque résultat', async () => {
      mockBGGService.searchGames.mockResolvedValue(mockSearchResults)

      render(<BGGSearch onImport={mockOnImport} />)

      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })

      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        const detailButtons = screen.getAllByText('Voir détails')
        expect(detailButtons).toHaveLength(3)
      })
    })

    it('ne devrait pas afficher de résultats si la recherche retourne un tableau vide', async () => {
      mockBGGService.searchGames.mockResolvedValue([])

      render(<BGGSearch onImport={mockOnImport} />)

      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'inexistant' } })

      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(mockBGGService.searchGames).toHaveBeenCalled()
      })

      expect(
        screen.queryByText('Résultats de recherche :')
      ).not.toBeInTheDocument()
    })
  })

  describe('Gestion de la sélection et des détails', () => {
    it('devrait récupérer les détails du jeu quand on clique sur "Voir détails"', async () => {
      mockBGGService.searchGames.mockResolvedValue(mockSearchResults)
      mockBGGService.getGameDetails.mockResolvedValue(mockGameDetails)

      render(<BGGSearch onImport={mockOnImport} />)

      // Faire une recherche
      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })
      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Gloomhaven')).toBeInTheDocument()
      })

      // Cliquer sur "Voir détails" pour le premier résultat
      const detailButtons = screen.getAllByText('Voir détails')
      fireEvent.click(detailButtons[0])

      await waitFor(() => {
        expect(mockBGGService.getGameDetails).toHaveBeenCalledWith('174430')
      })
    })

    it('devrait afficher les détails complets du jeu sélectionné', async () => {
      mockBGGService.searchGames.mockResolvedValue(mockSearchResults)
      mockBGGService.getGameDetails.mockResolvedValue(mockGameDetails)

      render(<BGGSearch onImport={mockOnImport} />)

      // Recherche et sélection
      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })
      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Gloomhaven')).toBeInTheDocument()
      })

      const detailButtons = screen.getAllByText('Voir détails')
      fireEvent.click(detailButtons[0])

      await waitFor(() => {
        // Vérifier les informations de base
        expect(screen.getByText('Année : 2017')).toBeInTheDocument()
        expect(screen.getByText('Joueurs : 1 - 4')).toBeInTheDocument()
        expect(screen.getByText('Durée : 120 min')).toBeInTheDocument()
        expect(screen.getByText('Note BGG : 8.7/10')).toBeInTheDocument()

        // Vérifier la présence de la description
        expect(screen.getByText('Description :')).toBeInTheDocument()

        // Vérifier les catégories
        expect(screen.getByText('Catégories :')).toBeInTheDocument()
        expect(screen.getByText('Adventure')).toBeInTheDocument()
        expect(screen.getByText('Fantasy')).toBeInTheDocument()

        // Vérifier les boutons d'action
        expect(screen.getByText('Retour')).toBeInTheDocument()
        expect(
          screen.getByText('📥 Pré-remplir le formulaire')
        ).toBeInTheDocument()
      })
    })

    it('devrait permettre de revenir aux résultats avec le bouton "Retour"', async () => {
      mockBGGService.searchGames.mockResolvedValue(mockSearchResults)
      mockBGGService.getGameDetails.mockResolvedValue(mockGameDetails)

      render(<BGGSearch onImport={mockOnImport} />)

      // Recherche, sélection et retour
      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })
      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Gloomhaven')).toBeInTheDocument()
      })

      const detailButtons = screen.getAllByText('Voir détails')
      fireEvent.click(detailButtons[0])

      await waitFor(() => {
        expect(screen.getByText('Retour')).toBeInTheDocument()
      })

      const backButton = screen.getByText('Retour')
      fireEvent.click(backButton)

      // Vérifier qu'on est revenu aux résultats
      expect(screen.getByText('Résultats de recherche :')).toBeInTheDocument()
      expect(
        screen.queryByText('📥 Pré-remplir le formulaire')
      ).not.toBeInTheDocument()
    })
  })

  describe("Processus d'import et callback", () => {
    it('devrait appeler onImport avec les données converties quand on clique sur "Pré-remplir le formulaire"', async () => {
      mockBGGService.searchGames.mockResolvedValue(mockSearchResults)
      mockBGGService.getGameDetails.mockResolvedValue(mockGameDetails)

      render(<BGGSearch onImport={mockOnImport} />)

      // Recherche et sélection
      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })
      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Gloomhaven')).toBeInTheDocument()
      })

      const detailButtons = screen.getAllByText('Voir détails')
      fireEvent.click(detailButtons[0])

      await waitFor(() => {
        expect(
          screen.getByText('📥 Pré-remplir le formulaire')
        ).toBeInTheDocument()
      })

      const importButton = screen.getByText('📥 Pré-remplir le formulaire')
      fireEvent.click(importButton)

      await waitFor(() => {
        expect(mockOnImport).toHaveBeenCalledTimes(1)
      })

      // Vérifier la structure des données passées au callback
      const callData = mockOnImport.mock.calls[0][0] as CreateGameRequest
      expect(callData.game_id_bgg).toBe('174430')
      expect(callData.game_name).toBe('Gloomhaven')
      expect(callData.game_description).toBe(mockGameDetails.description)
      expect(callData.game_image).toBe(mockGameDetails.image)
      expect(callData.min_players).toBe(1)
      expect(callData.max_players).toBe(4)
      expect(callData.supports_cooperative).toBe(true) // À cause de "Cooperative Game" dans mechanics
      expect(callData.supports_campaign).toBe(true) // À cause de "Legacy Game" dans mechanics
      expect(callData.has_characters).toBe(false) // Pas de "character" ou "role playing" dans categories
      expect(callData.default_mode).toBe('competitive')
    })

    it("devrait réinitialiser l'interface après un import réussi", async () => {
      mockBGGService.searchGames.mockResolvedValue(mockSearchResults)
      mockBGGService.getGameDetails.mockResolvedValue(mockGameDetails)

      render(<BGGSearch onImport={mockOnImport} />)

      // Processus complet jusqu'à l'import
      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })
      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Gloomhaven')).toBeInTheDocument()
      })

      const detailButtons = screen.getAllByText('Voir détails')
      fireEvent.click(detailButtons[0])

      await waitFor(() => {
        expect(
          screen.getByText('📥 Pré-remplir le formulaire')
        ).toBeInTheDocument()
      })

      const importButton = screen.getByText('📥 Pré-remplir le formulaire')
      fireEvent.click(importButton)

      await waitFor(() => {
        expect(mockOnImport).toHaveBeenCalled()
      })

      // Vérifier que l'interface est réinitialisée
      expect(
        screen.getByPlaceholderText('Rechercher un jeu sur BGG...')
      ).toHaveValue('')
      expect(
        screen.queryByText('Résultats de recherche :')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText('📥 Pré-remplir le formulaire')
      ).not.toBeInTheDocument()
    })

    it("devrait afficher un indicateur de chargement pendant l'import", async () => {
      mockBGGService.searchGames.mockResolvedValue(mockSearchResults)
      mockBGGService.getGameDetails.mockResolvedValue(mockGameDetails)

      // Simuler un délai sur getGameDetails lors de l'import
      let resolveImport: (value: BGGGameDetails) => void = () => {}
      const importPromise = new Promise<BGGGameDetails>((resolve) => {
        resolveImport = resolve
      })

      render(<BGGSearch onImport={mockOnImport} />)

      // Processus jusqu'à l'état où on peut importer
      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })
      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Gloomhaven')).toBeInTheDocument()
      })

      const detailButtons = screen.getAllByText('Voir détails')
      fireEvent.click(detailButtons[0])

      await waitFor(() => {
        expect(
          screen.getByText('📥 Pré-remplir le formulaire')
        ).toBeInTheDocument()
      })

      // Mock avec promesse en attente pour l'import
      mockBGGService.getGameDetails.mockReturnValue(importPromise)

      const importButton = screen.getByText('📥 Pré-remplir le formulaire')
      fireEvent.click(importButton)

      // Vérifier l'état de chargement
      expect(screen.getByText('🔄 Import...')).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: '🔄 Import...' })
      ).toBeDisabled()

      // Résoudre la promesse
      resolveImport(mockGameDetails)

      await waitFor(() => {
        expect(mockOnImport).toHaveBeenCalled()
      })
    })
  })

  describe("Gestion d'erreurs et états de chargement", () => {
    it('devrait afficher une erreur si la recherche échoue', async () => {
      mockBGGService.searchGames.mockRejectedValue(new Error('Network error'))

      render(<BGGSearch onImport={mockOnImport} />)

      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })
      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(
          screen.getByText('Erreur lors de la recherche sur BoardGameGeek')
        ).toBeInTheDocument()
      })
    })

    it('devrait afficher une erreur si la récupération des détails échoue', async () => {
      mockBGGService.searchGames.mockResolvedValue(mockSearchResults)
      mockBGGService.getGameDetails.mockRejectedValue(
        new Error('Details error')
      )

      render(<BGGSearch onImport={mockOnImport} />)

      // Recherche réussie
      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })
      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Gloomhaven')).toBeInTheDocument()
      })

      // Tentative de récupération des détails qui échoue
      const detailButtons = screen.getAllByText('Voir détails')
      fireEvent.click(detailButtons[0])

      await waitFor(() => {
        expect(
          screen.getByText('Erreur lors de la récupération des détails')
        ).toBeInTheDocument()
      })
    })

    it("devrait afficher une erreur si l'import échoue", async () => {
      mockBGGService.searchGames.mockResolvedValue(mockSearchResults)
      mockBGGService.getGameDetails
        .mockResolvedValueOnce(mockGameDetails) // Pour les détails
        .mockRejectedValueOnce(new Error('Import error')) // Pour l'import

      render(<BGGSearch onImport={mockOnImport} />)

      // Processus complet jusqu'à l'import
      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })
      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Gloomhaven')).toBeInTheDocument()
      })

      const detailButtons = screen.getAllByText('Voir détails')
      fireEvent.click(detailButtons[0])

      await waitFor(() => {
        expect(
          screen.getByText('📥 Pré-remplir le formulaire')
        ).toBeInTheDocument()
      })

      // Tentative d'import qui échoue
      const importButton = screen.getByText('📥 Pré-remplir le formulaire')
      fireEvent.click(importButton)

      await waitFor(() => {
        expect(
          screen.getByText("Erreur lors de l'importation du jeu")
        ).toBeInTheDocument()
      })
    })

    it("devrait nettoyer les erreurs lors d'une nouvelle recherche", async () => {
      mockBGGService.searchGames
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockSearchResults)

      render(<BGGSearch onImport={mockOnImport} />)

      // Première recherche qui échoue
      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'error' } })
      let form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(
          screen.getByText('Erreur lors de la recherche sur BoardGameGeek')
        ).toBeInTheDocument()
      })

      // Nouvelle recherche qui réussit
      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })
      form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(
          screen.queryByText('Erreur lors de la recherche sur BoardGameGeek')
        ).not.toBeInTheDocument()
        expect(screen.getByText('Résultats de recherche :')).toBeInTheDocument()
      })
    })
  })

  describe('Tests de conversion des données BGG', () => {
    it('devrait détecter les jeux coopératifs basés sur les mécaniques', async () => {
      const cooperativeGame: BGGGameDetails = {
        ...mockGameDetails,
        mechanics: ['Cooperative Game', 'Hand Management']
      }

      mockBGGService.searchGames.mockResolvedValue(mockSearchResults)
      mockBGGService.getGameDetails.mockResolvedValue(cooperativeGame)

      render(<BGGSearch onImport={mockOnImport} />)

      // Processus d'import
      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })
      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => screen.getByText('Gloomhaven'))
      fireEvent.click(screen.getAllByText('Voir détails')[0])
      await waitFor(() => screen.getByText('📥 Pré-remplir le formulaire'))
      fireEvent.click(screen.getByText('📥 Pré-remplir le formulaire'))

      await waitFor(() => {
        expect(mockOnImport).toHaveBeenCalled()
      })

      const callData = mockOnImport.mock.calls[0][0] as CreateGameRequest
      expect(callData.supports_cooperative).toBe(true)
    })

    it('devrait détecter les jeux de campagne basés sur les mécaniques', async () => {
      const campaignGame: BGGGameDetails = {
        ...mockGameDetails,
        mechanics: ['Legacy Game', 'Deck Building']
      }

      mockBGGService.searchGames.mockResolvedValue(mockSearchResults)
      mockBGGService.getGameDetails.mockResolvedValue(campaignGame)

      render(<BGGSearch onImport={mockOnImport} />)

      // Processus d'import
      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })
      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => screen.getByText('Gloomhaven'))
      fireEvent.click(screen.getAllByText('Voir détails')[0])
      await waitFor(() => screen.getByText('📥 Pré-remplir le formulaire'))
      fireEvent.click(screen.getByText('📥 Pré-remplir le formulaire'))

      await waitFor(() => {
        expect(mockOnImport).toHaveBeenCalled()
      })

      const callData = mockOnImport.mock.calls[0][0] as CreateGameRequest
      expect(callData.supports_campaign).toBe(true)
    })

    it('devrait détecter les jeux avec personnages basés sur les catégories', async () => {
      const characterGame: BGGGameDetails = {
        ...mockGameDetails,
        categories: ['Adventure', 'Character', 'Fantasy']
      }

      mockBGGService.searchGames.mockResolvedValue(mockSearchResults)
      mockBGGService.getGameDetails.mockResolvedValue(characterGame)

      render(<BGGSearch onImport={mockOnImport} />)

      // Processus d'import
      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'Gloomhaven' } })
      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => screen.getByText('Gloomhaven'))
      fireEvent.click(screen.getAllByText('Voir détails')[0])
      await waitFor(() => screen.getByText('📥 Pré-remplir le formulaire'))
      fireEvent.click(screen.getByText('📥 Pré-remplir le formulaire'))

      await waitFor(() => {
        expect(mockOnImport).toHaveBeenCalled()
      })

      const callData = mockOnImport.mock.calls[0][0] as CreateGameRequest
      expect(callData.has_characters).toBe(true)
    })

    it('devrait gérer les données manquantes et fournir des valeurs par défaut', async () => {
      const minimalGame: BGGGameDetails = {
        id: '12345',
        name: 'Minimal Game'
        // Pas de description, image, joueurs, etc.
      }

      mockBGGService.searchGames.mockResolvedValue([
        {
          id: '12345',
          name: 'Minimal Game'
        }
      ])
      mockBGGService.getGameDetails.mockResolvedValue(minimalGame)

      render(<BGGSearch onImport={mockOnImport} />)

      // Processus d'import
      const searchInput = screen.getAllByPlaceholderText(
        'Rechercher un jeu sur BGG...'
      )[0]
      fireEvent.change(searchInput, { target: { value: 'Minimal' } })
      const form = searchInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => screen.getByText('Minimal Game'))
      fireEvent.click(screen.getAllByText('Voir détails')[0])
      await waitFor(() => screen.getByText('📥 Pré-remplir le formulaire'))
      fireEvent.click(screen.getByText('📥 Pré-remplir le formulaire'))

      await waitFor(() => {
        expect(mockOnImport).toHaveBeenCalled()
      })

      const callData = mockOnImport.mock.calls[0][0] as CreateGameRequest
      expect(callData.game_id_bgg).toBe('12345')
      expect(callData.game_name).toBe('Minimal Game')
      expect(callData.game_description).toBe('')
      expect(callData.game_image).toBe('')
      expect(callData.min_players).toBe(1)
      expect(callData.max_players).toBe(4)
      expect(callData.supports_cooperative).toBe(false)
      expect(callData.supports_competitive).toBe(true)
      expect(callData.supports_campaign).toBe(false)
      expect(callData.has_characters).toBe(false)
      expect(callData.default_mode).toBe('competitive')
    })
  })
})
