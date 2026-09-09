export type SellerLevelId = 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS'

export interface ISellerLevelCurrent {
    level_id: SellerLevelId
    level_label: string
    branches_count: number
    team_size: number
    operating_funds: number
}

export interface ISellerLevelTier {
    id: SellerLevelId
    label: string
    operating_funds: number
    branches: number
    profit_ratio: string
    traffic_support: string
    global_delivery_days: number
    purchase_discount: string
    upgrade_bonus: string
    exclusive_service: boolean
    home_page_recommendation: boolean
}

export interface ISellerLevelSummary {
    current: ISellerLevelCurrent
    upgrade_rules: {
        branch_min_deposit: number
        upgrade_mode: string
        level_lifetime: boolean
    }
    tiers: ISellerLevelTier[]
}

export interface IApiResponse<T> {
    code: number
    message: string
    data: T
}
