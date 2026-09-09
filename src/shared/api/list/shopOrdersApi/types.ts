export interface IShopOrderListItem {
    id: number
    order_no: string
    consignee: string
    sales_amount: number | string
    profit: number | string
    payment_status: string
    purchase_status: string
    logistics_status: string
    order_time: string
}

export interface IShopOrderListParams {
    order_no?: string
    payment_status?: string
    logistics_status?: string
    purchase_status?: string
    tab?: 'all' | 'pending' | 'purchased'
    date_from?: string
    date_to?: string
    page?: number
    per_page?: number
}

export interface IShopOrderListResponse {
    code: number
    message: string
    data: IShopOrderListItem[]
    total: number
    eligible_total?: number
}

export interface IShopOrderProduct {
    id?: number
    sales_order_id?: number
    product_number: string | null
    product_name: string
    specification: string | null
    quantity: number
    image: string | null
    price: number | string | null
}

export interface IShopOrderLogisticsEvent {
    id: number
    sales_order_id: number
    status?: string | null
    event_time: string
    text: string
}

export interface IShopOrderDetail {
    id: number
    order_no: string
    consignee_name: string
    consignee_email: string | null
    consignee_phone: string | null
    consignee_address: string | null
    consignee_country: string | null
    consignee_province: string | null
    consignee_city: string | null
    consignee_postal_code: string | null
    sales_amount: number | string
    purchase_amount: number | string | null
    profit: number | string | null
    payment_method: string | null
    payment_status: string
    purchase_status: string
    logistics_status: string
    order_time: string
    purchase_time: string | null
    subtotal: number | string | null
    tax: number | string
    shipping: number | string
    discount: number | string
    total: number | string | null
}

export interface IShopOrderShowResponse {
    code: number
    message: string
    data: {
        order: IShopOrderDetail
        products: IShopOrderProduct[]
        logistics_events: IShopOrderLogisticsEvent[]
    }
}

export interface IShopOrderStorePayload {
    order_no?: string
    consignee_name: string
    consignee_email?: string
    consignee_phone?: string
    consignee_address?: string
    consignee_country?: string
    consignee_province?: string
    consignee_city?: string
    consignee_postal_code?: string
    sales_amount: number
    purchase_amount?: number
    profit?: number
    payment_method?: string
    payment_status: string
    purchase_status: string
    logistics_status: string
    order_time?: string
    purchase_time?: string
    subtotal?: number
    tax?: number
    shipping?: number
    discount?: number
    total?: number
    products?: IShopOrderProduct[]
}

export interface IShopOrderUpdatePayload extends Partial<IShopOrderStorePayload> {
    id: number
}

export interface IShopOrderMutationResponse {
    code: number
    message: string
    data: IShopOrderDetail | null
}

export interface IShopOrderUpdateResponse {
    code: number
    message: string
    data: IShopOrderShowResponse['data']
}

export interface IBulkPurchaseFilter {
    order_no?: string
    payment_status?: string
    logistics_status?: string
    purchase_status?: string
    tab?: 'all' | 'pending' | 'purchased'
    date_from?: string
    date_to?: string
}

export type IBulkPurchasePayload =
    | { ids: number[]; filter?: never }
    | { filter: IBulkPurchaseFilter; ids?: never }

export interface IBulkPurchaseResponse {
    code: number
    message: string
    data: {
        updated: number
    }
}
