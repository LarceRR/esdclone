import { createApi } from '@reduxjs/toolkit/query/react'
import { WAREHOUSE_BULK_DELETE_API, WAREHOUSE_LIST_API, WAREHOUSE_PUBLISH_API } from '@/shared/constants/apiLinks.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import {
    IWarehouseBulkDeleteResponse,
    IWarehouseListParams,
    IWarehouseListResponse,
    IWarehousePublishPayload,
    IWarehousePublishResponse,
} from './types.ts'

export const warehouseApi = createApi({
    reducerPath: 'warehouseApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Warehouse'],
    endpoints: (build) => ({
        getWarehouseList: build.query<IWarehouseListResponse, IWarehouseListParams>({
            query: (params) => ({
                url: WAREHOUSE_LIST_API,
                method: 'GET',
                params,
            }),
            providesTags: ['Warehouse'],
        }),
        publishWarehouseProducts: build.mutation<IWarehousePublishResponse, IWarehousePublishPayload>({
            query: (body) => ({
                url: WAREHOUSE_PUBLISH_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Warehouse'],
        }),
        bulkDeleteWarehouseProducts: build.mutation<IWarehouseBulkDeleteResponse, { ids: number[] }>({
            query: (body) => ({
                url: WAREHOUSE_BULK_DELETE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Warehouse'],
        }),
    }),
})
