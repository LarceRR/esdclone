export interface IWarehouseListItem {
    id: number
    productId: string
    imageUrl: string | null
    name: string
    category: string
    subCategory: string
    purchasePrice: number | null
}

export interface IWarehouseListParams {
    name?: string
    product_id?: string
    category_id?: number
    page?: number
    per_page?: number
}

export interface IWarehouseListResponse {
    code: number
    message: string
    data: IWarehouseListItem[]
    total: number
}

export interface IWarehousePublishPayload {
    ids: number[]
    profit_ratio: number
    discount_start_at?: string
    discount_end_at?: string
    discount_percent?: number
}

export interface IWarehousePublishSkippedItem {
    id: number
    reason: string
}

export interface IWarehousePublishResponse {
    code: number
    message: string
    data: {
        published: number
        skipped: IWarehousePublishSkippedItem[]
    }
}

export interface IWarehouseBulkDeleteResponse {
    code: number
    message: string
    data: {
        deleted: number
        skipped: IWarehousePublishSkippedItem[]
    }
}
