export interface IColumn {
    id: 'id' | 'invoice_number' | 'invoice_date' | 'created_at' | 'counterparty' | 'sum' | 'description'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}
