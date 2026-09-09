import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IStateSchema } from '@/shared/store/lib/types/stateSchema.ts'
import { API_BASE_URL } from '@/shared/config/apiBaseUrl.ts'
import { readPersistedAccessToken } from '@/shared/lib/auth/authStorage.ts'

export const fetchBaseQueryApi = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    timeout: 30_000,
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as IStateSchema
        const token = state.auth?.userToken ?? readPersistedAccessToken()
        headers.set('X-Requested-With', 'XMLHttpRequest')
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        const role = state.auth?.role
        const sellerId = state.shopContext?.selectedSellerId
        if (sellerId && (role === 'admin' || role === 'superadmin')) {
            headers.set('X-Shop-Context', String(sellerId))
        }
        return headers
    },
})
