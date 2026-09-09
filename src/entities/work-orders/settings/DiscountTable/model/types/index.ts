export interface IColumn {
    id: 'id' | 'title' | 'type' | 'discount_work' | 'discount_product'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}
