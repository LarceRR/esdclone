export interface IColumn {
    id: 'brand' | 'model'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}
