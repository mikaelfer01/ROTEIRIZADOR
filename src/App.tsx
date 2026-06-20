import { MapView } from './components/Map/MapView'
import { OrdersPanel } from './components/Orders/OrdersPanel'
import { RoutePanel } from './components/Route/RoutePanel'
import { KpiBar } from './components/KPI/KpiBar'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Roteirizador Horizonte Pro</h1>
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
