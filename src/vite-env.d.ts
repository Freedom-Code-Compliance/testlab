/// <reference types="vite/client" />
/// <reference types="google.maps" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_MONDAY_API_KEY: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}



