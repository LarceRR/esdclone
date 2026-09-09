export interface IColumn {
    id: 'id' | 'date' | 'cashbox_req' | 'cashbox_res' | 'article' | 'sum' | 'desc'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}
