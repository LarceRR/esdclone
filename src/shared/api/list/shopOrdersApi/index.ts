import { createApi } from '@reduxjs/toolkit/query/react'
import {
    SHOP_ORDERS_BULK_PURCHASE_API,
    SHOP_ORDERS_CREATE_API,
    SHOP_ORDERS_DELETE_API,
    SHOP_ORDERS_LIST_API,
    SHOP_ORDERS_SHOW_API,
    SHOP_ORDERS_UPDATE_API,
} from '@/shared/constants/apiLinks.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import {
    IBulkPurchasePayload,
    IBulkPurchaseResponse,
    IShopOrderListParams,
    IShopOrderListResponse,
    IShopOrderMutationResponse,
    IShopOrderShowResponse,
    IShopOrderStorePayload,
    IShopOrderUpdatePayload,
    IShopOrderUpdateResponse,
} from './types.ts'

export const shopOrdersApi = createApi({
    reducerPath: 'shopOrdersApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['ShopOrders'],
    endpoints: (build) => ({
        getShopOrdersList: build.query<IShopOrderListResponse, IShopOrderListParams>({
            query: (params) => ({
                url: SHOP_ORDERS_LIST_API,
                method: 'GET',
                params,
            }),
            providesTags: ['ShopOrders'],
        }),
        getShopOrder: build.mutation<IShopOrderShowResponse, number>({
            query: (id) => ({
                url: SHOP_ORDERS_SHOW_API,
                method: 'POST',
                body: { id },
            }),
        }),
        createShopOrder: build.mutation<IShopOrderMutationResponse, IShopOrderStorePayload>({
            query: (body) => ({
                url: SHOP_ORDERS_CREATE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['ShopOrders'],
        }),
        updateShopOrder: build.mutation<IShopOrderUpdateResponse, IShopOrderUpdatePayload>({
            query: (body) => ({
                url: SHOP_ORDERS_UPDATE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['ShopOrders'],
        }),
        deleteShopOrder: build.mutation<IShopOrderMutationResponse, number>({
            query: (id) => ({
                url: SHOP_ORDERS_DELETE_API,
                method: 'POST',
                body: { id },
            }),
            invalidatesTags: ['ShopOrders'],
        }),
        bulkPurchaseShopOrders: build.mutation<IBulkPurchaseResponse, IBulkPurchasePayload>({
            query: (payload) => ({
                url: SHOP_ORDERS_BULK_PURCHASE_API,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['ShopOrders'],
        }),
    }),
})
