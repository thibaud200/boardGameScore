import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CurrentGamePage from './CurrentGame'

// Mock des services
vi.mock('../services/currentGameService', () => ({
  CurrentGameService: {
    getCurrentGame: vi.fn(async () => null),
    startGame: vi.fn(async () => ({
      id: 1,
      game_data: JSON.stringify({
        game_name: 'Catan',
        current_mode: 'competitive',
        started_at: new Date().toISOString(),
        players: [
          {
            player_id: 1,
            player_name: 'Alice',
            avatar_url: 'https://example.com/alice.png',
            color: '#ff0000',
            created_at: new Date().toISOString()
          },
          {
            player_id: 2,
            player_name: 'Bob',
            avatar_url: null,
            color: '#00ff00',
            created_at: new Date().toISOString()
          }
        ]
      })
    })),
    finishCurrentGame: vi.fn(async () => ({ success: true, sessionId: 42 })),
    cancelCurrentGame: vi.fn(async () => true),
    parseGameData: (data: string) => JSON.parse(data)
  }
}))
vi.mock('../services/playersService', () => ({
  PlayersService: {
    getAllPlayers: vi.fn(async () => [
      {
        player_id: 1,
        player_name: 'Alice',
        avatar_url: 'https://example.com/alice.png',
        color: '#ff0000',
        created_at: new Date().toISOString()
      },
      {
        player_id: 2,
        player_name: 'Bob',
        avatar_url: null,
        color: '#00ff00',
        created_at: new Date().toISOString()
      }
    ])
  }
}))
vi.mock('../services/gamesService', () => ({
  GamesService: {
    getAllGames: vi.fn(async () => [
      {
        game_id: 1,
        game_name: 'Catan',
        game_image: 'https://example.com/catan.png',
        has_characters: false,
        created_at: new Date().toISOString()
      }
    ])
  }
}))

describe('CurrentGamePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('affiche le message aucune partie en cours', async () => {
    render(
      <MemoryRouter>
        <CurrentGamePage />
      </MemoryRouter>
    )
    expect(
      await screen.findByText('Aucune partie en cours')
    ).toBeInTheDocument()
    expect(screen.getByText(/Créer une nouvelle partie/)).toBeInTheDocument()
  })

  it('ouvre le formulaire de création et affiche les joueurs avec avatar/couleur', async () => {
    render(
      <MemoryRouter>
        <CurrentGamePage />
      </MemoryRouter>
    )
    fireEvent.click(await screen.findByText(/Créer une nouvelle partie/))
    expect(
      await screen.findByText(/Créer une nouvelle partie/)
    ).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getAllByRole('img').length).toBeGreaterThan(0)
  })

  it('crée une partie et affiche le dashboard avec avatars et couleurs', async () => {
    render(
      <MemoryRouter>
        <CurrentGamePage />
      </MemoryRouter>
    )
    fireEvent.click(await screen.findByText(/Créer une nouvelle partie/))
    fireEvent.change(screen.getByLabelText('Choisir un jeu *'), {
      target: { value: '1' }
    })
    fireEvent.change(screen.getByLabelText('Mode de jeu'), {
      target: { value: 'competitive' }
    })
    fireEvent.click(
      screen.getAllByLabelText('Joueur Alice')[0].querySelector('input')!
    )
    fireEvent.click(
      screen.getAllByLabelText('Joueur Bob')[0].querySelector('input')!
    )
    fireEvent.click(screen.getByText('Démarrer la partie'))
    expect(await screen.findByText('🎮 Catan')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getAllByRole('img').length).toBeGreaterThan(0)
    expect(screen.getAllByLabelText(/Couleur/).length).toBeGreaterThan(0)
  })
})
