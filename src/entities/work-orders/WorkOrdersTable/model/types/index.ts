export interface IColumn {
    id: 'id' | 'cars' | 'comments' | 'counterparty' | 'date_end_work' | 'date_start_work' | 'payed' | 'status' | 'sum'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}
