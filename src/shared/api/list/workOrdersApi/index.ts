import { createApi } from '@reduxjs/toolkit/query/react'
import {
    WORK_ORDERS_CREATE_API,
    WORK_ORDERS_DELETE_API,
    WORK_ORDERS_LIST_API,
    WORK_ORDER_SHOW_API,
    WORK_ORDERS_UPDATE_API,
    WORK_ORDERS_CSV_API,
} from '@/shared/constants/apiLinks.ts'
import { IDataUpdateWorkOrderApi, IDataWorkOrderApi } from './types/workOrders.ts'
import { IWorkOrderCreate } from '@/shared/api/types'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'

export const workOrdersApi = createApi({
    reducerPath: 'workOrdersApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['WorkList'],
    endpoints: (build) => ({
        getListWorkOrders: build.query<IDataWorkOrderApi[], void>({
            query: () => ({
                url: WORK_ORDERS_LIST_API,
                method: 'GET',
            }),
            providesTags: ['WorkList'],
        }),
        getWorkOrder: build.mutation({
            query: (id: number) => ({
                url: WORK_ORDER_SHOW_API,
                method: 'POST',
                body: {
                    id,
                },
            }),
        }),
        // TODO: Типы
        createWorkOrder: build.mutation<any, IWorkOrderCreate>({
            query: (data) => ({
                url: WORK_ORDERS_CREATE_API,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['WorkList'],
        }),
        // TODO: Типы
        updateWorkOrder: build.mutation<any, IDataUpdateWorkOrderApi>({
            query: (data) => ({
                url: WORK_ORDERS_UPDATE_API,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['WorkList'],
        }),
        exportCsvWorkOrder: build.mutation<any, any>({
            query: (data) => ({
                url: WORK_ORDERS_CSV_API,
                method: 'POST',
                body: data,
            }),
        }),
        // TODO: Типы
        deleteWorkOrder: build.mutation<any, number>({
            query: (id) => ({
                url: WORK_ORDERS_DELETE_API,
                method: 'POST',
                body: {
                    id,
                },
            }),
            invalidatesTags: ['WorkList'],
        }),
    }),
})
