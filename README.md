# Roteirizador Horizonte Pro

Dashboard de roteirização logística com mapa (Mapbox GL), importação de carteira de pedidos via planilha (.xlsx), otimização de rotas, cálculo de frete e KPIs.

## Setup

```bash
npm install
cp .env.example .env
```

Edite `.env` e informe seu token do Mapbox:

```
VITE_MAPBOX_TOKEN=pk.seu_token_aqui
```

## Desenvolvimento

```bash
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```
