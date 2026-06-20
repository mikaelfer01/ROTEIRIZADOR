# Roteirizador Horizonte Pro

Dashboard de roteirização logística: importação de carteira de pedidos via planilha,
geocodificação automática, otimização real de rota multi-parada via Mapbox Optimization API
e cálculo de frete por veículo.

## Stack

- React + TypeScript + Vite
- Mapbox GL JS (mapa) + Geocoding API v6 + Optimized Trips API
- xlsx (importação de planilhas)
- zustand (estado)

## Desenvolvimento

```bash
npm install
npm run dev
```

Crie um arquivo `.env` na raiz com:

```
VITE_MAPBOX_TOKEN=seu_token_aqui
```

## Build

```bash
npm run build
```
