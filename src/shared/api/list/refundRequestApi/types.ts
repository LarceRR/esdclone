export interface IRefundRequestListItem {
    id: number
    order_no: string
    application_time: string
    refund_reason: string
    refund_instructions: string | null
    product_amount: number | string
    status: string
}

export interface IRefundRequestListParams {
    order_no?: string
    status?: string
    date_from?: string
    date_to?: string
    page?: number
    per_page?: number
}

export interface IRefundRequestListResponse {
    code: number
    message: string
    data: IRefundRequestListItem[]
    total: number
}

export interface IRefundRequestDetail {
    id: number
    sales_order_id: number
    order_no: string
    application_time: string
    refund_reason: string
    refund_instructions: string | null
    product_amount: number | string
    status: string
    created_at: string
    updated_at: string
}

export interface IRefundRequestShowResponse {
    code: number
    message: string
    data: IRefundRequestDetail
}

export interface IRefundRequestStorePayload {
    order_no: string
    refund_reason: string
    refund_instructions?: string
    product_amount?: number
}

export interface IRefundRequestUpdatePayload {
    id: number
    refund_reason?: string
    refund_instructions?: string
    product_amount?: number
    status?: string
}

export interface IRefundBulkProcessPayload {
    ids: number[]
    status: string
    refund_instructions?: string
}

export interface IRefundBulkProcessResponse {
    code: number
    message: string
    data: {
        updated: number
    }
}

export interface IRefundRequestMutationResponse {
    code: number
    message: string
    data: IRefundRequestDetail
}

export const refundStatuses = [
    'На рассмотрении',
    'Одобрен',
    'Отклонён',
    'В обработке',
    'Завершён',
] as const

export const refundReasons = [
    'Товар не соответствует описанию',
    'Повреждение при доставке',
    'Неверный размер или цвет',
    'Дубликат заказа',
    'Задержка доставки',
] as const
