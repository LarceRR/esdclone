import { API_BASE_URL } from '@/shared/config/apiBaseUrl.ts'

export const resolveMediaUrl = (url: string | null | undefined): string | null => {
    if (!url) {
        return null
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
    }

    const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '')

    return `${apiOrigin}${url.startsWith('/') ? url : `/${url}`}`
}
