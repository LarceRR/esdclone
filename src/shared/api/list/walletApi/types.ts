export interface IWalletSummary {
    balance: number
    accumulated_income: number
}

export interface IWalletSummaryResponse {
    code: number
    message: string
    data: IWalletSummary
}

export interface IWalletDepositAddress {
    id: number
    currency: string
    network: string
    address: string
}

export interface IWalletAddressesResponse {
    code: number
    message: string
    data: IWalletDepositAddress[]
}

export interface IWalletTransactionListItem {
    id: number
    type: 'deposit' | 'withdraw'
    order_no: string
    currency: string
    network: string
    amount: number | string
    actual_received: number | string | null
    service_fee: number | string
    address: string
    status: 'pending' | 'success' | 'failed'
    status_label: string
    remarks: string | null
    completed_at: string | null
    created_at: string
    has_proof: boolean
}

export interface IWalletTransactionListParams {
    type?: 'deposit' | 'withdraw'
    status?: string
    page?: number
    per_page?: number
}

export interface IWalletTransactionListResponse {
    code: number
    message: string
    data: IWalletTransactionListItem[]
    total: number
}

export interface IWalletTransactionDetail {
    id: number
    type: 'deposit' | 'withdraw'
    order_no: string
    currency: string
    network: string
    amount: number | string
    actual_received: number | string | null
    service_fee: number | string
    address: string
    status: 'pending' | 'success' | 'failed'
    status_label: string
    proof_path: string | null
    proof_url: string | null
    remarks: string | null
    fund_record_id: number | null
    created_by: number | null
    completed_at: string | null
    created_at: string
    updated_at: string
}

export interface IWalletTransactionShowResponse {
    code: number
    message: string
    data: IWalletTransactionDetail
}

export interface IWalletWithdrawPayload {
    amount: number
    currency: string
    network: string
    address: string
    remarks?: string
}

export interface IWalletMutationResponse {
    code: number
    message: string
    data: IWalletTransactionDetail
}

export interface IWalletRejectPayload {
    id: number
    remarks?: string
}

export const walletCurrencies = ['USDT', 'ETH'] as const

export const walletNetworksByCurrency: Record<(typeof walletCurrencies)[number], string[]> = {
    USDT: ['TRC20', 'ERC20', 'BEP20'],
    ETH: ['ERC20'],
}

export const walletWithdrawNetworks = ['BEP20', 'TRC20', 'ERC20'] as const

export const WALLET_WITHDRAW_FEE_PERCENT = 3

export const WALLET_WITHDRAW_MIN_USDT = 10
