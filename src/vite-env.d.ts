/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONFIRM_WALLET?: string
  readonly VITE_CONFIRM_AMOUNT_DEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
