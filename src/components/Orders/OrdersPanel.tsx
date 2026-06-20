import { useRef } from 'react'
import { parseSpreadsheet } from '../../services/spreadsheet'
import { geocodeBatch } from '../../services/geocoding'
import { useStore } from '../../state/useStore'
import './OrdersPanel.css'

export function OrdersPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const orders = useStore((s) => s.orders)
  const selectedOrderIds = useStore((s) => s.selectedOrderIds)
  const importWarnings = useStore((s) => s.importWarnings)
  const importErrors = useStore((s) => s.importErrors)
  const isGeocoding = useStore((s) => s.isGeocoding)
  const geocodeProgress = useStore((s) => s.geocodeProgress)

  const setImportResult = useStore((s) => s.setImportResult)
  const toggleOrderSelection = useStore((s) => s.toggleOrderSelection)
  const selectAllOrders = useStore((s) => s.selectAllOrders)
  const clearSelection = useStore((s) => s.clearSelection)
  const updateOrderGeocode = useStore((s) => s.updateOrderGeocode)
  const setGeocoding = useStore((s) => s.setGeocoding)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const result = await parseSpreadsheet(file)
    setImportResult(result)
    if (result.orders.length === 0) return

    setGeocoding(true, { done: 0, total: result.orders.length })
    const queries = result.orders.map((o) =>
      [o.endereco, o.cidade, o.estado, o.cep, 'Brasil'].filter(Boolean).join(', '),
    )
    const geocoded = await geocodeBatch(queries, (done, total) =>
      setGeocoding(true, { done, total }),
    )
    geocoded.forEach((coords, idx) => {
      const order = result.orders[idx]
      if (coords) {
        updateOrderGeocode(order.id, coords.lat, coords.lng, 'ok')
      } else {
        updateOrderGeocode(order.id, 0, 0, 'failed')
      }
    })
    setGeocoding(false)
  }

  return (
    <div className="orders-panel">
      <div className="orders-panel-header">
        <h2>Carteira de Pedidos</h2>
        <button onClick={() => fileInputRef.current?.click()} disabled={isGeocoding}>
          Importar planilha
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          hidden
          onChange={handleFileChange}
        />
      </div>

      {isGeocoding && geocodeProgress && (
        <p className="orders-panel-status">
          Geocodificando {geocodeProgress.done}/{geocodeProgress.total}…
        </p>
      )}

      {importErrors.map((err, i) => (
        <p key={i} className="orders-panel-error">{err}</p>
      ))}
      {importWarnings.map((warn, i) => (
        <p key={i} className="orders-panel-warning">{warn}</p>
      ))}

      {orders.length > 0 && (
        <div className="orders-panel-actions">
          <button onClick={selectAllOrders}>Selecionar todos</button>
          <button onClick={clearSelection}>Limpar seleção</button>
          <span>{selectedOrderIds.size} selecionados</span>
        </div>
      )}

      <ul className="orders-list">
        {orders.map((order) => (
          <li key={order.id} className={selectedOrderIds.has(order.id) ? 'selected' : ''}>
            <label>
              <input
                type="checkbox"
                checked={selectedOrderIds.has(order.id)}
                onChange={() => toggleOrderSelection(order.id)}
              />
              <span className="order-code">{order.pedido}</span>
              <span className="order-city">{order.cidade}/{order.estado}</span>
              {order.geocodeStatus === 'pending' && <span className="badge badge-pending">…</span>}
              {order.geocodeStatus === 'ok' && <span className="badge badge-ok">✓</span>}
              {order.geocodeStatus === 'failed' && <span className="badge badge-failed">!</span>}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
