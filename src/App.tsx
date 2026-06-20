import { useEffect, useRef } from 'react'
import { MapView } from './components/Map/MapView'
import { OrdersPanel } from './components/Orders/OrdersPanel'
import { RoutePanel } from './components/Route/RoutePanel'
import { KpiBar } from './components/KPI/KpiBar'
import { geocodeAddress } from './services/geocoding'
import { useStore } from './state/useStore'
import './App.css'

function App() {
  const depot = useStore((s) => s.depot)
  const setDepot = useStore((s) => s.setDepot)
  const hasGeocodedDepot = useRef(false)

  useEffect(() => {
    if (hasGeocodedDepot.current) return
    hasGeocodedDepot.current = true
    geocodeAddress(`${depot.endereco}, Brasil`)
      .then((result) => {
        if (result) setDepot({ ...useStore.getState().depot, lat: result.lat, lng: result.lng })
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-header-emblem" aria-hidden="true">⚜</span>
        <div className="app-header-text">
          <h1>Roteirizador Horizonte Pro</h1>
          <p className="app-header-tagline">Elegância parisiense · Otimização de rotas Mapbox</p>
        </div>
      </header>
      <KpiBar />
      <div className="app-body">
        <aside className="app-sidebar">
          <OrdersPanel />
          <RoutePanel />
        </aside>
        <main className="app-map-wrap">
          <MapView />
        </main>
      </div>
    </div>
  )
}

export default App
