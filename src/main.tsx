import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Players from './pages/Players'
import Games from './pages/Games'
import './index.css'

// TODO: Importer les autres pages quand elles seront créées
// import Sessions from './pages/Sessions'

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/players" element={<Players />} />
          <Route path="/games" element={<Games />} />
          {/* TODO: Ajouter les autres routes */}
          {/* <Route path="/sessions" element={<Sessions />} /> */}

          {/* Route de fallback temporaire */}
          <Route
            path="*"
            element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Page en construction
                </h2>
                <p className="text-gray-600">
                  Cette page sera bientôt disponible
                </p>
              </div>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
)
