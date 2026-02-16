/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOPIFY_DOMAIN: string
  readonly VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN: string
  readonly VITE_GEMINI_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
