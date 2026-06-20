export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined

export function requireMapboxToken(): string {
  if (!MAPBOX_TOKEN) {
    throw new Error(
      'VITE_MAPBOX_TOKEN não configurado. Defina a variável de ambiente antes de iniciar o app.',
    )
  }
  return MAPBOX_TOKEN
}
