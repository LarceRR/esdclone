import { createApi } from '@reduxjs/toolkit/query/react'
import { IOfferResponseList } from './types.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import { OFFER_CREATE_API, OFFER_DELETE_API, OFFER_LIST_API, OFFER_SHOW_API, OFFER_UPDATE_API } from '@/shared/constants/apiLinks.ts'

export const salesApi = createApi({
    reducerPath: 'salesApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Sales'],
    endpoints: (build) => ({
        getOfferList: build.query<IOfferResponseList, void>({
            query: () => ({
                url: OFFER_LIST_API,
                method: 'GET',
            }),
            providesTags: ['Sales'],
        }),
        getOffer: build.mutation({
            query: (id: number) => ({
                url: OFFER_SHOW_API,
                method: 'POST',
                body: {
                    id,
                },
            }),
        }),
        createOffer: build.mutation<IOfferResponseList, FormData>({
            query: (body) => ({
                url: OFFER_CREATE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Sales'],
        }),
        updateOffer: build.mutation<IOfferResponseList, FormData>({
            query: (body) => ({
                url: OFFER_UPDATE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Sales'],
        }),
        removeOffer: build.mutation({
            query: (id: number) => ({
                url: OFFER_DELETE_API,
                method: 'POST',
                body: {
                    id,
                },
            }),
            invalidatesTags: ['Sales'],
        }),
    }),
})
