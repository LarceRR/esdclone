export interface IFundRecordListItem {
    id: number
    order_type: string
    serial_number: string
    amount_change: number | string
    balance_before: number | string
    balance_after: number | string
    changed_at: string
    reversal_of_id: number | null
    is_reversed: boolean
}

export interface IFundRecordListParams {
    order_type?: string
    date_from?: string
    date_to?: string
    page?: number
    per_page?: number
}

export interface IFundRecordListResponse {
    code: number
    message: string
    data: IFundRecordListItem[]
    total: number
}

export interface IFundRecordDetail {
    id: number
    order_type: string
    serial_number: string
    amount_change: number | string
    balance_before: number | string
    balance_after: number | string
    changed_at: string
    idempotency_key: string | null
    reference_type: string | null
    reference_id: number | null
    reversal_of_id: number | null
    created_by: number | null
    created_at: string
    updated_at: string
}

export interface IFundRecordShowResponse {
    code: number
    message: string
    data: IFundRecordDetail
}

export interface IFundRecordStorePayload {
    order_type: string
    amount_change: number
    changed_at?: string
    idempotency_key?: string
    reference_type?: string
    reference_id?: number
}

export interface IFundRecordMutationResponse {
    code: number
    message: string
    data: IFundRecordDetail
}

export const fundOrderTypes = [
    'Заказ на вывод',
    'Доход от заказа',
    'Пополнение',
    'Комиссия',
    'Возврат',
] as const
