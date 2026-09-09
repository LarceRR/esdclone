export interface ITariffListItem {
    id: number
    name: string
    cost: number
    duration_days: number
    icon_url: string
}

export interface ITariffDetail extends ITariffListItem {
    created_at: string
    updated_at: string
}

export interface ITariffListResponse {
    code: number
    message: string
    data: ITariffListItem[]
    total: number
}

export interface ITariffMutationResponse {
    code: number
    message: string
    data: ITariffDetail
}

export interface ITariffDeleteResponse {
    code: number
    message: string
    data: null
}

export interface ITariffStorePayload {
    name: string
    cost: number
    duration_days: number
    icon_url?: string
    icon?: File | null
}

export interface ITariffUpdatePayload extends ITariffStorePayload {
    id: number
}

export interface ITariffAssignPayload {
    tariff_id: number
    user_id: number
}

export interface ITariffAssignResponse {
    code: number
    message: string
    data: IPurchaseHistoryDetail
}

export interface IPurchaseHistoryListItem {
    id: number
    user_id: number
    tariff_id: number
    package_name: string
    purchase_time: string
    expiration_time: string
    payment_amount: number
    user_name: string | null
    assigned_by: number | null
}

export interface IPurchaseHistoryDetail extends IPurchaseHistoryListItem {
    user: {
        id: number
        name: string
        surname: string
        email: string
    } | null
    tariff: ITariffListItem | null
    created_at: string
    updated_at: string
}

export interface IPurchaseHistoryListParams {
    date_from?: string
    date_to?: string
    user_id?: number
    page?: number
    per_page?: number
}

export interface IPurchaseHistoryListResponse {
    code: number
    message: string
    data: IPurchaseHistoryListItem[]
    total: number
}

export interface IPurchaseHistoryShowResponse {
    code: number
    message: string
    data: IPurchaseHistoryDetail
}
