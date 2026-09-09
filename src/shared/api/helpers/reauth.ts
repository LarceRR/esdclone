import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import { fetchBaseQueryApi } from '@/shared/api/helpers/baseQuery.ts'
import { authActions } from '@/shared/store/slices/authSlice.ts'
import { IStateSchema } from '@/shared/store/lib/types/stateSchema.ts'
import { store } from '@/shared/store'
import { persistAccessToken, readPersistedAccessToken } from '@/shared/lib/auth/authStorage.ts'

const mutex = new Mutex()

function clearSession() {
    persistAccessToken(null)
    store.dispatch(authActions.setUser(null))
    store.dispatch(authActions.setToken(null))
}

function isSessionInvalidFromBody(data: unknown): boolean {
    if (!data || typeof data !== 'object' || !('code' in data)) return false
    const code = (data as { code: number }).code
    return code === 401
}

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock()
    const state = api.getState() as IStateSchema
    const accessToken = state?.auth?.userToken ?? readPersistedAccessToken()

    const result = await fetchBaseQueryApi(args, api, extraOptions)

    if (result?.error?.status === 401 && accessToken) {
        clearSession()
        return result
    }

    if (!result.error && isSessionInvalidFromBody(result.data) && accessToken) {
        clearSession()
        return {
            error: {
                status: 401,
                data: result.data,
            },
        }
    }

    return result
}
