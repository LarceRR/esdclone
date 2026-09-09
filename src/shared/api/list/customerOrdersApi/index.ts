import { createApi } from '@reduxjs/toolkit/query/react'
import {
    CUSTOMER_ORDERS_CREATE_API,
    CUSTOMER_ORDERS_DELETE_API,
    CUSTOMER_ORDERS_LIST_API,
    CUSTOMER_ORDERS_SHOW_API,
    CUSTOMER_ORDERS_UPDATE_API,
} from '@/shared/constants/apiLinks.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'

export const customerOrdersApi = createApi({
    reducerPath: 'customerOrdersApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['CustomerOrders'],
    endpoints: (build) => ({
        getCustomerOrdersList: build.query<any, void>({
            query: () => ({
                url: CUSTOMER_ORDERS_LIST_API,
                method: 'GET',
            }),
            providesTags: ['CustomerOrders'],
        }),
        getCustomerOrder: build.mutation({
            query: (id: number) => ({
                url: CUSTOMER_ORDERS_SHOW_API,
                method: 'POST',
                body: {
                    id,
                },
            }),
        }),
        createCustomerOrder: build.mutation<any, any>({
            query: (body) => ({
                url: CUSTOMER_ORDERS_CREATE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['CustomerOrders'],
        }),
        updateCustomerOrder: build.mutation<any, any>({
            query: (body) => ({
                url: CUSTOMER_ORDERS_UPDATE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['CustomerOrders'],
        }),
        removeCustomerOrder: build.mutation({
            query: (id: number) => ({
                url: CUSTOMER_ORDERS_DELETE_API,
                method: 'POST',
                body: { id },
            }),
            invalidatesTags: ['CustomerOrders'],
        }),
    }),
})
