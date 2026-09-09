import { createApi } from '@reduxjs/toolkit/query/react'
import { FINANCIAL_LIST_API, FINANCIAL_SUMMARY_API } from '@/shared/constants/apiLinks.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import {
    IFinancialReportListParams,
    IFinancialReportListResponse,
    IFinancialReportSummaryParams,
    IFinancialReportSummaryResponse,
} from './types.ts'

export const financialReportApi = createApi({
    reducerPath: 'financialReportApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['FinancialReport'],
    endpoints: (build) => ({
        getFinancialSummary: build.query<IFinancialReportSummaryResponse, IFinancialReportSummaryParams>({
            query: (params) => ({
                url: FINANCIAL_SUMMARY_API,
                method: 'GET',
                params,
            }),
            providesTags: ['FinancialReport'],
        }),
        getFinancialReportList: build.query<IFinancialReportListResponse, IFinancialReportListParams>({
            query: (params) => ({
                url: FINANCIAL_LIST_API,
                method: 'GET',
                params,
            }),
            providesTags: ['FinancialReport'],
        }),
    }),
})
