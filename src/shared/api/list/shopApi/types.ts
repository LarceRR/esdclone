export interface IShopListItem {
    id: number
    user_id: number
    seller_id: number
    name: string
    slug: string
    rating: number
    seller_credit: number
    subscribers_count: number
    seller_level: string
}

export interface IApiResponse<T> {
    code: number
    message: string
    data: T
}
