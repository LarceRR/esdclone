import { createApi } from '@reduxjs/toolkit/query/react'
import {
    DASHBOARD_CATEGORIES_API,
    DASHBOARD_CHART_API,
    DASHBOARD_SUMMARY_API,
    DASHBOARD_TOP_SELLERS_API,
} from '@/shared/constants/apiLinks.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import {
    DashboardChartPeriod,
    IApiResponse,
    IDashboardCategory,
    IDashboardChart,
    IDashboardSummary,
    IDashboardTopSeller,
} from './types.ts'

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Dashboard'],
    endpoints: (build) => ({
        getDashboardSummary: build.query<IApiResponse<IDashboardSummary>, void>({
            query: () => ({
                url: DASHBOARD_SUMMARY_API,
                method: 'GET',
            }),
            providesTags: ['Dashboard'],
        }),
        getDashboardChart: build.query<IApiResponse<IDashboardChart>, DashboardChartPeriod>({
            query: (period) => ({
                url: DASHBOARD_CHART_API,
                method: 'GET',
                params: { period },
            }),
            providesTags: ['Dashboard'],
        }),
        getDashboardCategories: build.query<IApiResponse<IDashboardCategory[]>, void>({
            query: () => ({
                url: DASHBOARD_CATEGORIES_API,
                method: 'GET',
            }),
            providesTags: ['Dashboard'],
        }),
        getDashboardTopSellers: build.query<IApiResponse<IDashboardTopSeller[]>, void>({
            query: () => ({
                url: DASHBOARD_TOP_SELLERS_API,
                method: 'GET',
            }),
            providesTags: ['Dashboard'],
        }),
    }),
})

export const {
    useGetDashboardSummaryQuery,
    useGetDashboardChartQuery,
    useGetDashboardCategoriesQuery,
    useGetDashboardTopSellersQuery,
} = dashboardApi
