const ACCESS_TOKEN_STORAGE_KEY = 'esd_crm_access_token'

export function persistAccessToken(token: string | null): void {
    if (token) {
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
    } else {
        localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
    }
}

export function readPersistedAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
}
