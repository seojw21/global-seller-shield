/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string
    readonly VITE_TOSS_CLIENT_KEY?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

interface Window {
    paypal?: any;
    TossPayments?: any;
}
