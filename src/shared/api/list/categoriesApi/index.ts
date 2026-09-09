import { createApi } from '@reduxjs/toolkit/query/react'
import {
    CATEGORIES_LIST_API,
    CATEGORY_CREATE_API,
    CATEGORY_DELETE_API,
    CATEGORY_SHOW_API,
    CATEGORY_UPDATE_API,
} from '@/shared/constants/apiLinks.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import { ICategory, ICategoryCreate } from '@/shared/api/types'
import { normalizeCategory } from '@/entities/Categories/lib/categoryTree'

export interface ICategoryListResponse {
    code: number
    message: string
    data: ICategory[]
}

export interface ICategoryShowResponse {
    code: number
    message: string
    data: ICategory
}

export interface ICategoryMutationResponse {
    code: number
    message: string
    data: ICategory
}

export interface ICategoryDeleteResponse {
    code: number
    message: string
    data: { id: number }
}

export interface ICategoryUpdatePayload {
    id: number
    title: string
    parent_id?: number | null
}

const normalizeListResponse = (response: ICategoryListResponse): ICategoryListResponse => ({
    ...response,
    data: (response.data ?? []).map((item) =>
        normalizeCategory(item as unknown as Record<string, unknown>),
    ),
})

const normalizeItemResponse = <T extends { code: number; message: string; data: ICategory }>(
    response: T,
): T => ({
    ...response,
    data: normalizeCategory(response.data as unknown as Record<string, unknown>),
})

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Categories'],
    endpoints: (build) => ({
        getCategoriesList: build.query<ICategoryListResponse, void>({
            query: () => ({
                url: CATEGORIES_LIST_API,
                method: 'GET',
            }),
            transformResponse: normalizeListResponse,
            providesTags: ['Categories'],
        }),
        getCategory: build.query<ICategoryShowResponse, number>({
            query: (id) => ({
                url: CATEGORY_SHOW_API,
                method: 'POST',
                body: { id },
            }),
            transformResponse: normalizeItemResponse,
        }),
        createCategory: build.mutation<ICategoryMutationResponse, ICategoryCreate>({
            query: (body) => ({
                url: CATEGORY_CREATE_API,
                method: 'POST',
                body,
            }),
            transformResponse: normalizeItemResponse,
            invalidatesTags: ['Categories'],
        }),
        updateCategory: build.mutation<ICategoryMutationResponse, ICategoryUpdatePayload>({
            query: (body) => ({
                url: CATEGORY_UPDATE_API,
                method: 'POST',
                body,
            }),
            transformResponse: normalizeItemResponse,
            invalidatesTags: ['Categories'],
        }),
        removeCategory: build.mutation<ICategoryDeleteResponse, number>({
            query: (id) => ({
                url: CATEGORY_DELETE_API,
                method: 'POST',
                body: { id },
            }),
            invalidatesTags: ['Categories'],
        }),
    }),
})
