import { createApi } from '@reduxjs/toolkit/query/react'
import {
    WALLET_ADDRESSES_API,
    WALLET_CONFIRM_API,
    WALLET_DEPOSIT_API,
    WALLET_LIST_API,
    WALLET_REJECT_API,
    WALLET_SHOW_API,
    WALLET_SUMMARY_API,
    WALLET_WITHDRAW_API,
} from '@/shared/constants/apiLinks.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import {
    IWalletAddressesResponse,
    IWalletMutationResponse,
    IWalletRejectPayload,
    IWalletSummaryResponse,
    IWalletTransactionListParams,
    IWalletTransactionListResponse,
    IWalletTransactionShowResponse,
    IWalletWithdrawPayload,
} from './types.ts'

export interface IWalletDepositFormData {
    amount: number
    currency: string
    network: string
    remarks?: string
    proof?: File | null
}

export const walletApi = createApi({
    reducerPath: 'walletApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['WalletSummary', 'WalletTransactions'],
    endpoints: (build) => ({
        getWalletSummary: build.query<IWalletSummaryResponse, void>({
            query: () => ({
                url: WALLET_SUMMARY_API,
                method: 'GET',
            }),
            providesTags: ['WalletSummary'],
        }),
        getWalletAddresses: build.query<IWalletAddressesResponse, { currency?: string; network?: string } | void>({
            query: (params) => ({
                url: WALLET_ADDRESSES_API,
                method: 'GET',
                params: params ?? undefined,
            }),
        }),
        getWalletTransactionsList: build.query<IWalletTransactionListResponse, IWalletTransactionListParams>({
            query: (params) => ({
                url: WALLET_LIST_API,
                method: 'GET',
                params,
            }),
            providesTags: ['WalletTransactions'],
        }),
        getWalletTransaction: build.mutation<IWalletTransactionShowResponse, number>({
            query: (id) => ({
                url: WALLET_SHOW_API,
                method: 'POST',
                body: { id },
            }),
        }),
        createWalletDeposit: build.mutation<IWalletMutationResponse, IWalletDepositFormData>({
            query: ({ amount, currency, network, remarks, proof }) => {
                const formData = new FormData()
                formData.append('amount', String(amount))
                formData.append('currency', currency)
                formData.append('network', network)
                if (remarks) formData.append('remarks', remarks)
                if (proof) formData.append('proof', proof)

                return {
                    url: WALLET_DEPOSIT_API,
                    method: 'POST',
                    body: formData,
                }
            },
            invalidatesTags: ['WalletTransactions', 'WalletSummary'],
        }),
        createWalletWithdraw: build.mutation<IWalletMutationResponse, IWalletWithdrawPayload>({
            query: (body) => ({
                url: WALLET_WITHDRAW_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['WalletTransactions', 'WalletSummary'],
        }),
        confirmWalletTransaction: build.mutation<IWalletMutationResponse, number>({
            query: (id) => ({
                url: WALLET_CONFIRM_API,
                method: 'POST',
                body: { id },
            }),
            invalidatesTags: ['WalletTransactions', 'WalletSummary'],
        }),
        rejectWalletTransaction: build.mutation<IWalletMutationResponse, IWalletRejectPayload>({
            query: (body) => ({
                url: WALLET_REJECT_API,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['WalletTransactions', 'WalletSummary'],
        }),
    }),
})
