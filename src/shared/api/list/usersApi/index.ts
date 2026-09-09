import { createApi } from '@reduxjs/toolkit/query/react'
import { USER_CREATE_API, USER_DELETE_API, USER_SHOW_API, USER_UPDATE_API, USERS_LIST_API } from '@/shared/constants/apiLinks.ts'
import { IUserCreate, IUserUpdate } from '@/shared/api/types'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Users'],
    endpoints: (build) => ({
        getUsersList: build.query<any, void>({
            query: () => ({
                url: USERS_LIST_API,
            }),
            providesTags: ['Users'],
        }),
        getUser: build.query({
            query: (id: number) => ({
                url: USER_SHOW_API,
                method: 'POST',
                body: {
                    id,
                },
            }),
        }),
        createUser: build.mutation<any, IUserCreate>({
            query: (body) => ({
                url: USER_CREATE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Users'],
        }),
        updateUser: build.mutation<any, IUserUpdate>({
            query: (body) => ({
                url: USER_UPDATE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Users'],
        }),
        removeUser: build.mutation<any, number>({
            query: (id) => ({
                url: USER_DELETE_API,
                method: 'POST',
                body: {
                    id,
                },
            }),
            invalidatesTags: ['Users'],
        }),
    }),
})
