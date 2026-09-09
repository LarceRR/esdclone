/** Базовый URL API. Переопределяется через `VITE_GENERAL_API` в `.env`. */
export const API_BASE_URL = import.meta.env.VITE_GENERAL_API ?? 'https://esd.back.inferno-studio.ru/api'
