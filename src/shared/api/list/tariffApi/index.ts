import { createApi } from '@reduxjs/toolkit/query/react'
import {
    TARIFF_ASSIGN_API,
    TARIFF_DELETE_API,
    TARIFF_LIST_API,
    TARIFF_SHOW_API,
    TARIFF_STORE_API,
    TARIFF_UPDATE_API,
} from '@/shared/constants/apiLinks.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import {
    ITariffAssignPayload,
    ITariffAssignResponse,
    ITariffDeleteResponse,
    ITariffListResponse,
    ITariffMutationResponse,
    ITariffStorePayload,
    ITariffUpdatePayload,
} from './types.ts'
import { purchaseHistoryApi } from '../purchaseHistoryApi'

const buildTariffFormData = (payload: ITariffStorePayload | ITariffUpdatePayload) => {
    const formData = new FormData()
    if ('id' in payload) {
        formData.append('id', String(payload.id))
    }
    formData.append('name', payload.name)
    formData.append('cost', String(payload.cost))
    formData.append('duration_days', String(payload.duration_days))
    if (payload.icon) {
        formData.append('icon', payload.icon)
    } else if (payload.icon_url) {
        formData.append('icon_url', payload.icon_url)
    }
    return formData
}

export const tariffApi = createApi({
    reducerPath: 'tariffApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Tariffs'],
    endpoints: (build) => ({
        getTariffsList: build.query<ITariffListResponse, void>({
            query: () => ({
                url: TARIFF_LIST_API,
                method: 'GET',
            }),
            providesTags: ['Tariffs'],
        }),
        getTariff: build.mutation<ITariffMutationResponse, number>({
            query: (id) => ({
                url: TARIFF_SHOW_API,
                method: 'POST',
                body: { id },
            }),
        }),
        createTariff: build.mutation<ITariffMutationResponse, ITariffStorePayload>({
            query: (body) => ({
                url: TARIFF_STORE_API,
                method: 'POST',
                body: buildTariffFormData(body),
            }),
            invalidatesTags: ['Tariffs'],
        }),
        updateTariff: build.mutation<ITariffMutationResponse, ITariffUpdatePayload>({
            query: (body) => ({
                url: TARIFF_UPDATE_API,
                method: 'POST',
                body: buildTariffFormData(body),
            }),
            invalidatesTags: ['Tariffs'],
        }),
        deleteTariff: build.mutation<ITariffDeleteResponse, number>({
            query: (id) => ({
                url: TARIFF_DELETE_API,
                method: 'POST',
                body: { id },
            }),
            invalidatesTags: ['Tariffs'],
        }),
        assignTariff: build.mutation<ITariffAssignResponse, ITariffAssignPayload>({
            query: (body) => ({
                url: TARIFF_ASSIGN_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Tariffs'],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(purchaseHistoryApi.util.invalidateTags(['PurchaseHistory']))
                } catch {
                    // ignore
                }
            },
        }),
    }),
})
