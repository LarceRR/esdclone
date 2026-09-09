import { createApi } from '@reduxjs/toolkit/query/react'
import { CAR_CREATE_API, CAR_DELETE_API, CAR_SHOW_API, CAR_UPDATE_API, CAR_LIST_API } from '@/shared/constants/apiLinks.ts'
import { ICar, ICarAction, ICarListResponse } from '@/shared/api/list/carApi/types.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'

export const carApi = createApi({
    reducerPath: 'carApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Cars'],
    endpoints: (build) => ({
        getCarList: build.query<ICarListResponse, void>({
            query: () => ({
                url: CAR_LIST_API,
                method: 'GET',
            }),
            providesTags: ['Cars'],
        }),
        getCar: build.mutation<{ data: ICarAction }, number>({
            query: (id: number) => ({
                url: CAR_SHOW_API,
                method: 'POST',
                body: {
                    id,
                },
            }),
        }),
        createCar: build.mutation<ICarListResponse, ICarAction>({
            query: (body) => ({
                url: CAR_CREATE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Cars'],
        }),
        updateCar: build.mutation<ICarListResponse, ICar>({
            query: (body) => ({
                url: CAR_UPDATE_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Cars'],
        }),
        removeCar: build.mutation({
            query: (id: number) => ({
                url: CAR_DELETE_API,
                method: 'POST',
                body: { id },
            }),
            invalidatesTags: ['Cars'],
        }),
    }),
})
