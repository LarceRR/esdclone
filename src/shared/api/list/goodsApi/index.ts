import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import {
    GOODS_BULK_DELETE_API,
    GOODS_BULK_FLAGS_API,
    GOODS_BULK_STATUS_API,
    GOODS_CREATE_API,
    GOODS_DELETE_API,
    GOODS_LIST_API,
    GOODS_SHOW_API,
    GOODS_UPDATE_API,
} from '@/shared/constants/apiLinks.ts'
import type {
    IBulkFlagsPayload,
    IBulkStatusPayload,
    IProductBulkResponse,
    IProductListParams,
    IProductListResponse,
    IProductShowResponse,
} from './types.ts'

export const goodsApi = createApi({
    reducerPath: 'goodsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['GoodsList'],
    endpoints: (build) => ({
        getListGoods: build.query<IProductListResponse, IProductListParams | void>({
            query: (params) => ({
                url: GOODS_LIST_API,
                method: 'GET',
                params: params ?? {},
            }),
            providesTags: ['GoodsList'],
        }),
        getGoods: build.mutation<IProductShowResponse, number>({
            query: (id) => ({
                url: GOODS_SHOW_API,
                method: 'POST',
                body: { id },
            }),
        }),
        createGoods: build.mutation<IProductShowResponse, FormData>({
            query: (data) => ({
                url: GOODS_CREATE_API,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['GoodsList'],
        }),
        updateGoods: build.mutation<IProductShowResponse, FormData | Record<string, unknown>>({
            query: (data) => ({
                url: GOODS_UPDATE_API,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['GoodsList'],
        }),
        deleteGoods: build.mutation<IProductBulkResponse, number>({
            query: (id) => ({
                url: GOODS_DELETE_API,
                method: 'POST',
                body: { id },
            }),
            invalidatesTags: ['GoodsList'],
        }),
        bulkUpdateProductStatus: build.mutation<IProductBulkResponse, IBulkStatusPayload>({
            query: (body) => ({
                url: GOODS_BULK_STATUS_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['GoodsList'],
        }),
        bulkDeleteProducts: build.mutation<IProductBulkResponse, { ids: number[] }>({
            query: (body) => ({
                url: GOODS_BULK_DELETE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['GoodsList'],
        }),
        bulkUpdateProductFlags: build.mutation<IProductBulkResponse, IBulkFlagsPayload>({
            query: (body) => ({
                url: GOODS_BULK_FLAGS_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['GoodsList'],
        }),
    }),
})
