export interface IColumn {
    id: 'name' | 'desc'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}
