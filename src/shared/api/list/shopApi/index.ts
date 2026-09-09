import { createApi } from '@reduxjs/toolkit/query/react'
import { SHOP_LIST_API } from '@/shared/constants/apiLinks.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import { IApiResponse, IShopListItem } from './types.ts'

export const shopApi = createApi({
    reducerPath: 'shopApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Shop'],
    endpoints: (build) => ({
        getShopList: build.query<IApiResponse<IShopListItem[]>, void>({
            query: () => ({
                url: SHOP_LIST_API,
                method: 'GET',
            }),
            providesTags: ['Shop'],
        }),
    }),
})

export const { useGetShopListQuery } = shopApi
