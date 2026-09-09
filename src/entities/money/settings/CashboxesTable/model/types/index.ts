export interface IColumn {
    id: 'name' | 'balance'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}
