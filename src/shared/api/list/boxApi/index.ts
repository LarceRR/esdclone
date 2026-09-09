import { createApi } from '@reduxjs/toolkit/query/react'
import { BOX_CREATE_API, BOX_DELETE_API, BOX_LIST_API, BOX_SHOW_API, BOX_UPDATE_API } from '@/shared/constants/apiLinks.ts'
import { IBoxCreate, IBoxListResponse, IBoxUpdate, IBoxUpdateResponse } from '@/shared/api/types'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'

export const boxApi = createApi({
    reducerPath: 'boxApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['BoxList'],
    endpoints: (build) => ({
        getAllBoxes: build.query<IBoxListResponse, void>({
            query: () => ({
                url: BOX_LIST_API,
                method: 'GET',
            }),
            providesTags: ['BoxList'],
        }),
        getBox: build.query<IBoxUpdateResponse, number>({
            query: (id) => ({
                url: BOX_SHOW_API,
                method: 'POST',
                params: { id },
            }),
        }),
        createBox: build.mutation<void, IBoxCreate>({
            query: (box) => ({
                url: BOX_CREATE_API,
                method: 'POST',
                body: box,
            }),
            invalidatesTags: ['BoxList'],
        }),
        updateBox: build.mutation<void, IBoxUpdate>({
            query: (box) => ({
                url: BOX_UPDATE_API,
                method: 'POST',
                body: box,
            }),
            invalidatesTags: ['BoxList'],
        }),
        removeBox: build.mutation<void, number>({
            query: (id) => ({
                url: BOX_DELETE_API,
                method: 'POST',
                body: { id },
            }),
            invalidatesTags: ['BoxList'],
        }),
    }),
})
