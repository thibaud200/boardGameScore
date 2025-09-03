import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { waitFor } from '@testing-library/react'
import Players from '../pages/Players'

// Mock PlayersService
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
    ]),
    createPlayer: vi.fn(async (data) => ({
      player_id: 3,
      ...data,
      created_at: new Date().toISOString()
    })),
    updatePlayer: vi.fn(async (id, data) => ({
      player_id: id,
      ...data,
      created_at: new Date().toISOString()
    })),
    deletePlayer: vi.fn(async () => true)
  }
}))

describe('Players page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('affiche la liste des joueurs', async () => {
    render(<Players />)
    expect(await screen.findByText('Alice')).toBeInTheDocument()
    expect(await screen.findByText('Bob')).toBeInTheDocument()
    expect(screen.getAllByRole('img').length).toBeGreaterThan(0)
  })

  it('ouvre le formulaire de création', async () => {
    render(<Players />)
    const btn = await screen.findByText('+ Nouveau Joueur')
    fireEvent.click(btn)
    expect(
      await screen.findByText('Créer un nouveau joueur')
    ).toBeInTheDocument()
  })

  it('valide le nom du joueur (min 3 caractères, unique)', async () => {
    render(<Players />)
    const btn = await screen.findByText('+ Nouveau Joueur')
    fireEvent.click(btn)
    const input = screen.getByPlaceholderText('Nom du joueur')
    fireEvent.change(input, { target: { value: 'Al' } })
    fireEvent.click(screen.getByText('Créer'))
    expect(
      await screen.findByText('Le nom doit comporter au moins 3 caractères.')
    ).toBeInTheDocument()
    fireEvent.change(input, { target: { value: 'Alice' } })
    fireEvent.click(screen.getByText('Créer'))
    expect(
      await screen.findByText('Ce nom de joueur existe déjà.')
    ).toBeInTheDocument()
  })

  it('crée un joueur avec avatar et couleur', async () => {
    render(<Players />)
    const btn = await screen.findByText('+ Nouveau Joueur')
    fireEvent.click(btn)
    fireEvent.change(screen.getByPlaceholderText('Nom du joueur'), {
      target: { value: 'Charlie' }
    })
    fireEvent.change(screen.getByPlaceholderText('https://...jpg/png'), {
      target: { value: 'https://example.com/charlie.png' }
    })
    fireEvent.change(screen.getByLabelText('Couleur'), {
      target: { value: '#123456' }
    })
    // Vérifie l'avatar preview dans le formulaire avant création
    expect(await screen.findByAltText('Avatar preview')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Créer'))
    expect(await screen.findByText('Charlie')).toBeInTheDocument()
  })

  it('édite un joueur (nom, avatar, couleur)', async () => {
    render(<Players />)
    const btns = await screen.findAllByText('✏️ Modifier')
    fireEvent.click(btns[0])
    const input = screen.getByDisplayValue('Alice')
    fireEvent.change(input, { target: { value: 'Alicia' } })
    fireEvent.click(screen.getByText('Sauver'))
    expect(await screen.findByText('Alicia')).toBeInTheDocument()
  })

  it('supprime un joueur', async () => {
    window.confirm = vi.fn(() => true)
    render(<Players />)
    const btns = await screen.findAllByText('🗑️ Supprimer')
    fireEvent.click(btns[0])
    await waitFor(() => {
      expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    })
  })
})
