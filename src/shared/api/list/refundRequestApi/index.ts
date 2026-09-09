import { createApi } from '@reduxjs/toolkit/query/react'
import {
    REFUND_BULK_PROCESS_API,
    REFUND_DELETE_API,
    REFUND_LIST_API,
    REFUND_SHOW_API,
    REFUND_STORE_API,
    REFUND_UPDATE_API,
} from '@/shared/constants/apiLinks.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import {
    IRefundBulkProcessPayload,
    IRefundBulkProcessResponse,
    IRefundRequestListParams,
    IRefundRequestListResponse,
    IRefundRequestMutationResponse,
    IRefundRequestShowResponse,
    IRefundRequestStorePayload,
    IRefundRequestUpdatePayload,
} from './types.ts'

export const refundRequestApi = createApi({
    reducerPath: 'refundRequestApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['RefundRequests'],
    endpoints: (build) => ({
        getRefundRequestsList: build.query<IRefundRequestListResponse, IRefundRequestListParams>({
            query: (params) => ({
                url: REFUND_LIST_API,
                method: 'GET',
                params,
            }),
            providesTags: ['RefundRequests'],
        }),
        getRefundRequest: build.mutation<IRefundRequestShowResponse, number>({
            query: (id) => ({
                url: REFUND_SHOW_API,
                method: 'POST',
                body: { id },
            }),
        }),
        createRefundRequest: build.mutation<IRefundRequestMutationResponse, IRefundRequestStorePayload>({
            query: (body) => ({
                url: REFUND_STORE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['RefundRequests'],
        }),
        updateRefundRequest: build.mutation<IRefundRequestMutationResponse, IRefundRequestUpdatePayload>({
            query: (body) => ({
                url: REFUND_UPDATE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['RefundRequests'],
        }),
        deleteRefundRequest: build.mutation<IRefundRequestMutationResponse, number>({
            query: (id) => ({
                url: REFUND_DELETE_API,
                method: 'POST',
                body: { id },
            }),
            invalidatesTags: ['RefundRequests'],
        }),
        bulkProcessRefundRequests: build.mutation<IRefundBulkProcessResponse, IRefundBulkProcessPayload>({
            query: (body) => ({
                url: REFUND_BULK_PROCESS_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['RefundRequests'],
        }),
    }),
})
