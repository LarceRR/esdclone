/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GENERAL_API?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
