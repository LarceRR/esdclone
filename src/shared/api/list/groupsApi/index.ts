import { createApi } from '@reduxjs/toolkit/query/react'
import { GROUP_CREATE_API, GROUP_DELETE_API, GROUP_SHOW_API, GROUP_UPDATE_API, GROUPS_LIST_API } from '@/shared/constants/apiLinks.ts'
import { IGroup, IGroupCreate, IGroupUpdateResponse } from '@/shared/api/types'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'

export const groupsApi = createApi({
    reducerPath: 'groupsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Groups'],
    endpoints: (build) => ({
        getGroups: build.query<{ data: IGroup[]; message: string; code: number }, void>({
            query: () => ({
                url: GROUPS_LIST_API,
                method: 'GET',
            }),
            providesTags: ['Groups'],
        }),
        getGroup: build.query<{ data: IGroupUpdateResponse; message: string; code: number }, number>({
            query: (id) => ({
                url: GROUP_SHOW_API,
                method: 'POST',
                body: {
                    id,
                },
            }),
        }),
        createGroup: build.mutation<any, IGroupCreate>({
            query: (data) => ({
                url: GROUP_CREATE_API,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Groups'],
        }),
        removeGroup: build.mutation<any, number>({
            query: (id) => ({
                url: GROUP_DELETE_API,
                method: 'POST',
                body: {
                    id,
                },
            }),
            invalidatesTags: ['Groups'],
        }),
        updateGroup: build.mutation({
            query: (data) => ({
                url: GROUP_UPDATE_API,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Groups'],
        }),
    }),
})
