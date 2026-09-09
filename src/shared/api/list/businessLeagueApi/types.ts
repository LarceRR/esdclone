export interface IBusinessLeagueSummary {
    referral_code: string | null
    commission_totals: {
        level_1: number
        level_2: number
        level_3: number
        total: number
    }
}

export interface IBusinessLeagueFriend {
    user_id: number
    shop_name: string | null
    user_name: string | null
    registered_at: string | null
    orders_count: number
    total_profit: number
    commission_earned: number
}

export interface IApiResponse<T> {
    code: number
    message: string
    data: T
}

export type BusinessLeagueFriendLevel = 1 | 2 | 3
