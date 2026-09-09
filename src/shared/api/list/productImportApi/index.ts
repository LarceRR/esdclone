import {
    PRODUCT_IMPORT_CHUNK_API,
    PRODUCT_IMPORT_DRY_RUN_API,
    PRODUCT_IMPORT_FINISH_API,
    PRODUCT_IMPORT_SHOW_API,
    PRODUCT_IMPORT_START_API,
} from '@/shared/constants/apiLinks.ts'
import { API_BASE_URL } from '@/shared/config/apiBaseUrl.ts'
import { readPersistedAccessToken } from '@/shared/lib/auth/authStorage.ts'
import type { ImportRowPayload } from '@/widgets/ProductImportModule/parsePreview.ts'

export interface IImportStartPayload {
    file_name: string
    file_format: 'csv' | 'json' | 'xml'
    mode: 'create' | 'update' | 'upsert'
    update_key: 'sku' | 'name'
    total_rows: number
}

export interface IImportStartResponse {
    code: number
    message: string
    data: {
        import_id: number
    }
}

export interface IImportChunkPayload {
    import_id: number
    chunk_index: number
    rows: ImportRowPayload[]
}

export interface IImportChunkResult {
    created?: number
    updated?: number
    skipped?: number
    to_catalog?: number
    to_shop?: number
    errors?: Array<{ row: number; message: string }>
    import_id: number
    chunk_index: number
    queued?: boolean
    processed_rows: number
    total_rows: number
    status: string
}

export interface IImportChunkResponse {
    code: number
    message: string
    data: IImportChunkResult
}

export interface IImportFinishPayload {
    import_id: number
}

export interface IImportStatusData {
    import_id: number
    status: string
    total_rows: number
    processed_rows: number
    created: number
    updated: number
    skipped: number
    to_catalog: number
    to_shop: number
    errors_count: number
    errors_url: string | null
    finished_at?: string | null
}

export interface IImportFinishResponse {
    code: number
    message: string
    data: IImportStatusData
}

export interface IDryRunPayload {
    mode: 'create' | 'update' | 'upsert'
    update_key: 'sku' | 'name'
    rows: ImportRowPayload[]
}

export interface IDryRunResult {
    created: number
    updated: number
    skipped: number
    to_catalog: number
    to_shop: number
    errors: Array<{ row: number; message: string }>
}

export interface IDryRunResponse {
    code: number
    message: string
    data: IDryRunResult
}

const parseResponse = async <T>(response: Response): Promise<T> => {
    const payload = (await response.json()) as T & { code?: number; message?: string }

    if (!response.ok || (payload.code !== undefined && payload.code !== 200)) {
        throw new Error((payload as { message?: string }).message || 'Ошибка запроса')
    }

    return payload
}

const authHeaders = (): HeadersInit => {
    const token = readPersistedAccessToken()
    return {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
}

const apiBase = API_BASE_URL

export const startImport = async (body: IImportStartPayload): Promise<IImportStartResponse> => {
    const response = await fetch(`${apiBase}${PRODUCT_IMPORT_START_API}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body),
    })

    return parseResponse<IImportStartResponse>(response)
}

export const sendChunk = async (body: IImportChunkPayload): Promise<IImportChunkResponse> => {
    const response = await fetch(`${apiBase}${PRODUCT_IMPORT_CHUNK_API}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body),
    })

    return parseResponse<IImportChunkResponse>(response)
}

export const finishImport = async (body: IImportFinishPayload): Promise<IImportFinishResponse> => {
    const response = await fetch(`${apiBase}${PRODUCT_IMPORT_FINISH_API}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body),
    })

    return parseResponse<IImportFinishResponse>(response)
}

export const getImportStatus = async (importId: number): Promise<IImportFinishResponse> => {
    const response = await fetch(`${apiBase}${PRODUCT_IMPORT_SHOW_API}/${importId}`, {
        method: 'GET',
        headers: authHeaders(),
    })

    return parseResponse<IImportFinishResponse>(response)
}

export const dryRunImport = async (body: IDryRunPayload): Promise<IDryRunResponse> => {
    const response = await fetch(`${apiBase}${PRODUCT_IMPORT_DRY_RUN_API}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body),
    })

    return parseResponse<IDryRunResponse>(response)
}

export const downloadImportErrors = async (importId: number): Promise<void> => {
    const token = readPersistedAccessToken()
    const response = await fetch(`${apiBase}${PRODUCT_IMPORT_SHOW_API}/${importId}/errors`, {
        method: 'GET',
        headers: {
            Accept: 'text/csv',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })

    if (!response.ok) {
        let message = 'Не удалось скачать отчёт об ошибках'
        try {
            const payload = (await response.json()) as { message?: string }
            if (payload.message) message = payload.message
        } catch {
            // CSV endpoint may not return JSON on failure
        }
        throw new Error(message)
    }

    const blob = await response.blob()
    const objectUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = `import-${importId}-errors.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(objectUrl)
}
