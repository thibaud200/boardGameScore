import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Players from './pages/Players'
import Games from './pages/Games'
import CurrentGame from './pages/CurrentGame'
import Sessions from './pages/Sessions'
import PlayerStats from './pages/PlayerStats'
import GameStats from './pages/GameStats'
import './index.css'

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/players" element={<Players />} />
          <Route path="/games" element={<Games />} />

          {/* Gestion de partie en cours */}
          <Route path="/current-game" element={<CurrentGame />} />

          {/* Sessions avec filtrage */}
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/sessions/game/:gameId" element={<Sessions />} />
          <Route path="/sessions/player/:playerId" element={<Sessions />} />

          {/* Statistiques */}
          <Route path="/stats/player/:playerId" element={<PlayerStats />} />
          <Route path="/stats/game/:gameId" element={<GameStats />} />

          {/* Route de fallback */}
          <Route
            path="*"
            element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Page introuvable
                </h2>
                <p className="text-gray-600 mb-4">
                  La page que vous cherchez n&apos;existe pas.
                </p>
                <a
                  href="/"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Retour au tableau de bord
                </a>
              </div>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
)
