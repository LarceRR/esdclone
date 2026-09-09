import { createApi } from '@reduxjs/toolkit/query/react'
import { PURCHASE_LIST_API, PURCHASE_SHOW_API } from '@/shared/constants/apiLinks.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import {
    IPurchaseHistoryListParams,
    IPurchaseHistoryListResponse,
    IPurchaseHistoryShowResponse,
} from '../tariffApi/types.ts'

export const purchaseHistoryApi = createApi({
    reducerPath: 'purchaseHistoryApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['PurchaseHistory'],
    endpoints: (build) => ({
        getPurchaseHistoryList: build.query<IPurchaseHistoryListResponse, IPurchaseHistoryListParams>({
            query: (params) => ({
                url: PURCHASE_LIST_API,
                method: 'GET',
                params,
            }),
            providesTags: ['PurchaseHistory'],
        }),
        getPurchaseHistoryItem: build.mutation<IPurchaseHistoryShowResponse, number>({
            query: (id) => ({
                url: PURCHASE_SHOW_API,
                method: 'POST',
                body: { id },
            }),
        }),
    }),
})
