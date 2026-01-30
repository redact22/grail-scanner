/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_GEMINI_MODEL?: string
  readonly VITE_THINKING_LEVEL?: 'low' | 'high'
  readonly VITE_MEDIA_RESOLUTION?: 'low' | 'high'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
