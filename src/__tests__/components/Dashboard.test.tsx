/**
 * Test simple pour valider la configuration React Testing Library
 * Test de base du composant Dashboard
 */
import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'

// Wrapper pour React Router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Dashboard Component - Test Infrastructure', () => {
  it('devrait afficher le message de chargement du dashboard', () => {
    render(
      <RouterWrapper>
        <Dashboard />
      </RouterWrapper>
    )

    // Chercher le message de chargement réel du Dashboard
    const loadingMessage = screen.getByText('Chargement du dashboard...')
    expect(loadingMessage).toBeInTheDocument()
    expect(loadingMessage).toHaveClass('text-lg', 'text-gray-600')
  })

  it('devrait avoir la structure de mise en page correcte', () => {
    render(
      <RouterWrapper>
        <Dashboard />
      </RouterWrapper>
    )

    // Vérifier la structure de conteneur
    const container = screen.getByText(
      'Chargement du dashboard...'
    ).parentElement
    expect(container).toHaveClass(
      'flex',
      'justify-center',
      'items-center',
      'h-64'
    )
  })

  it('devrait se rendre sans erreur', () => {
    // Test simple de rendu sans crash
    expect(() => {
      render(
        <RouterWrapper>
          <Dashboard />
        </RouterWrapper>
      )
    }).not.toThrow()
  })
})
