import { useStore } from '../../state/useStore'
import { MAP_STYLE_LABELS, MAP_STYLE_URLS } from '../../services/mapStyles'
import type { MapStyleKey } from '../../types'
import './MapControls.css'

const STYLE_KEYS = Object.keys(MAP_STYLE_URLS) as MapStyleKey[]

export function MapControls() {
  const mapStyle = useStore((s) => s.mapStyle)
  const setMapStyle = useStore((s) => s.setMapStyle)
  const show3D = useStore((s) => s.show3D)
  const toggle3D = useStore((s) => s.toggle3D)
  const showGlobe = useStore((s) => s.showGlobe)
  const toggleGlobe = useStore((s) => s.toggleGlobe)
  const showTraffic = useStore((s) => s.showTraffic)
  const toggleTraffic = useStore((s) => s.toggleTraffic)

  return (
    <div className="map-controls">
      <div className="map-controls-row">
        {STYLE_KEYS.map((key) => (
          <button
            key={key}
            className={mapStyle === key ? 'active' : ''}
            onClick={() => setMapStyle(key)}
          >
            {MAP_STYLE_LABELS[key]}
          </button>
        ))}
      </div>
      <div className="map-controls-row">
        <button className={showTraffic ? 'active' : ''} onClick={toggleTraffic}>
          Trânsito
        </button>
        <button className={show3D ? 'active' : ''} onClick={toggle3D}>
          3D
        </button>
        <button className={showGlobe ? 'active' : ''} onClick={toggleGlobe}>
          Globo
        </button>
      </div>
    </div>
  )
}
