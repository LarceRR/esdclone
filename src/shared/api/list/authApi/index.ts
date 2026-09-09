import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { LOGOUT_API, PASSWORD_FORGOT_API, PASSWORD_RESET_API, REGISTRATION_API, SIGN_IN_API, AUTH_INFO_API } from '@/shared/constants/apiLinks.ts'
import { IUserData, ILogin } from '@/shared/types/auth'
import { API_BASE_URL } from '@/shared/config/apiBaseUrl.ts'

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers) => headers.set('X-Requested-With', 'XMLHttpRequest'),
    }),
    endpoints: (build) => ({
        signIn: build.mutation<{ data: { original: ILogin }; message: string; code: number }, { phone: string; password: string }>({
            query: (data) => ({
                url: SIGN_IN_API,
                method: 'POST',
                body: {
                    phone: data.phone,
                    password: data.password,
                },
            }),
        }),
        logOut: build.mutation<void, string>({
            query: (token) => ({
                url: LOGOUT_API,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        }),
        infoUser: build.mutation<{ code: number; message: string; data: IUserData }, string>({
            query: (token) => ({
                url: AUTH_INFO_API,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        }),
        signUp: build.mutation<
            { code: number; message: string; data: unknown },
            {
                name: string
                surname?: string
                email: string
                phone: string
                password: string
                shop_name: string
                invite_code?: string
            }
        >({
            query: (body) => ({
                url: REGISTRATION_API,
                method: 'POST',
                body,
            }),
        }),
        forgotPassword: build.mutation<
            { code: number; message: string; data: { debug_reset_url?: string } | null },
            { email: string }
        >({
            query: (body) => ({
                url: PASSWORD_FORGOT_API,
                method: 'POST',
                body,
            }),
        }),
        resetPassword: build.mutation<
            { code: number; message: string; data: null },
            { email: string; token: string; password: string; password_confirmation: string }
        >({
            query: (body) => ({
                url: PASSWORD_RESET_API,
                method: 'POST',
                body,
            }),
        }),
    }),
})
