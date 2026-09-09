export type FinancialReportPeriod = 'yesterday' | 'today' | 'week' | 'month' | 'all'

export interface IFinancialReportSummary {
    pending_amount: number
    total_sales: number
    total_profit: number
    total_orders: number
    cancel_order: number
    refund_order: number
}

export interface IFinancialReportListItem {
    id: string
    date: string
    total_orders: number
    profit: number
    cancel_order: number
    refund_order: number
}

export interface IFinancialReportSummaryParams {
    period?: FinancialReportPeriod
}

export interface IFinancialReportListParams {
    period?: FinancialReportPeriod
    page?: number
    per_page?: number
}

export interface IFinancialReportSummaryResponse {
    code: number
    message: string
    data: IFinancialReportSummary
}

export interface IFinancialReportListResponse {
    code: number
    message: string
    data: IFinancialReportListItem[]
    total: number
}
