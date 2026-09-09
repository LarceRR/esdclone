export interface IProductHoldItem {
    id: number
    productId: string
    imageUrl: string | null
    name: string
    category: string
    subCategory: string
    purchasePrice: number | null
    sellingPrice: number | null
    discountedPrice: number | null
    profit: number | null
    accumulatedSales: number
    listProducts: boolean
    recommendation: boolean
    subscription: boolean
    status: string
    shop_status?: string
}

export interface IProductListParams {
    name?: string
    product_id?: string
    category_id?: number
    shop_status?: string
    page?: number
    per_page?: number
}

export interface IProductListResponse {
    code: number
    message: string
    data: IProductHoldItem[]
    total: number
}

export interface IProductShowResponse {
    code: number
    message: string
    data: IProductHoldItem
}

export interface IProductBulkResponse {
    code: number
    message: string
    data: {
        updated: number
        skipped: { id: number; reason: string }[]
    }
}

export interface IGoodsCreate {
    title: string
    description?: string
    category_id?: number
    cash?: number
    purchase_price?: number
    external_id?: string
    shop_status?: string
    image?: File | string
}

export interface IGoods extends IGoodsCreate {
    id: number
}

export interface IBulkStatusPayload {
    ids: number[]
    shop_status: string
}

export interface IBulkFlagsPayload {
    ids: number[]
    list_products?: boolean
    is_recommended?: boolean
    is_subscription?: boolean
}
