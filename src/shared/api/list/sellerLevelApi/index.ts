import { createApi } from '@reduxjs/toolkit/query/react'
import { SELLER_LEVEL_SUMMARY_API } from '@/shared/constants/apiLinks.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import { IApiResponse, ISellerLevelSummary } from './types.ts'

export const sellerLevelApi = createApi({
    reducerPath: 'sellerLevelApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['SellerLevel'],
    endpoints: (build) => ({
        getSellerLevelSummary: build.query<IApiResponse<ISellerLevelSummary>, void>({
            query: () => ({
                url: SELLER_LEVEL_SUMMARY_API,
                method: 'GET',
            }),
            providesTags: ['SellerLevel'],
        }),
    }),
})

export const { useGetSellerLevelSummaryQuery } = sellerLevelApi
