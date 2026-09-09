import { createApi } from '@reduxjs/toolkit/query/react'
import { FUND_LIST_API, FUND_REVERSE_API, FUND_SHOW_API, FUND_STORE_API } from '@/shared/constants/apiLinks.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import {
    IFundRecordListParams,
    IFundRecordListResponse,
    IFundRecordMutationResponse,
    IFundRecordShowResponse,
    IFundRecordStorePayload,
} from './types.ts'

export const fundRecordApi = createApi({
    reducerPath: 'fundRecordApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['FundRecords'],
    endpoints: (build) => ({
        getFundRecordsList: build.query<IFundRecordListResponse, IFundRecordListParams>({
            query: (params) => ({
                url: FUND_LIST_API,
                method: 'GET',
                params,
            }),
            providesTags: ['FundRecords'],
        }),
        getFundRecord: build.mutation<IFundRecordShowResponse, number>({
            query: (id) => ({
                url: FUND_SHOW_API,
                method: 'POST',
                body: { id },
            }),
        }),
        createFundRecord: build.mutation<IFundRecordMutationResponse, IFundRecordStorePayload>({
            query: (body) => ({
                url: FUND_STORE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['FundRecords'],
        }),
        reverseFundRecord: build.mutation<IFundRecordMutationResponse, number>({
            query: (id) => ({
                url: FUND_REVERSE_API,
                method: 'POST',
                body: { id },
            }),
            invalidatesTags: ['FundRecords'],
        }),
    }),
})
