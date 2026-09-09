export interface IDashboardShop {
    id: number
    name: string
    slug: string
    seller_id: number
}

export interface IDashboardSummary {
    metrics: {
        products_count: number
        total_sales: number
        total_orders: number
        total_profit: number
    }
    shop_overview: {
        rating: number
        seller_credit: number
        subscribers_count: number
    }
    traffic: {
        today: number
        last_7_days: number
        last_30_days: number
    }
    today: {
        orders_today: number
        sales_today: number
        profit_today: number
    }
    order_stats: {
        total: number
        in_progress: number
        completed: number
        cancelled: number
    }
    shop: IDashboardShop | null
}

export interface IDashboardChart {
    period: 'today' | 'week' | 'month'
    labels: string[]
    sales: number[]
    visits: number[]
}

export interface IDashboardCategory {
    id: number
    title: string
    count: number
    image: string | null
}

export interface IDashboardTopSeller {
    rank: number
    seller_id: number
    shop_name: string
    total_sales: number
    orders_count: number
}

export interface IApiResponse<T> {
    code: number
    message: string
    data: T
}

export type DashboardChartPeriod = 'today' | 'week' | 'month'
