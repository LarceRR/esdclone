import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import { DISCOUNT_CREATE_API, DISCOUNT_DELETE_API, DISCOUNT_LIST_API, DISCOUNT_SHOW_API, DISCOUNT_UPDATE_API } from '@/shared/constants/apiLinks.ts'
import { IDiscount, IDiscountAction, IDiscountList } from './types.ts'

export const discountApi = createApi({
    reducerPath: 'discountApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Discount'],
    endpoints: (build) => ({
        getDiscountList: build.query<IDiscountList, void>({
            query: () => ({
                url: DISCOUNT_LIST_API,
                method: 'GET',
            }),
            providesTags: ['Discount'],
        }),
        getDiscount: build.mutation<{ data: IDiscount }, number>({
            query: (id: number) => ({
                url: DISCOUNT_SHOW_API,
                method: 'POST',
                body: {
                    id,
                },
            }),
        }),
        createDiscount: build.mutation<IDiscountList, IDiscountAction>({
            query: (body) => ({
                url: DISCOUNT_CREATE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Discount'],
        }),
        updateDiscount: build.mutation<IDiscountList, IDiscount>({
            query: (body) => ({
                url: DISCOUNT_UPDATE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Discount'],
        }),
        removeDiscount: build.mutation({
            query: (id: number) => ({
                url: DISCOUNT_DELETE_API,
                method: 'POST',
                body: { id },
            }),
            invalidatesTags: ['Discount'],
        }),
    }),
})
