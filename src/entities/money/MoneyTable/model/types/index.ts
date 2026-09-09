export interface IColumn {
    id: 'id' | 'date' | 'type' | 'counterparty' | 'article' | 'cashbox' | 'sum' | 'nds'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}
