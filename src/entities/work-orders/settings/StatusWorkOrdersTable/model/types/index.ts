export interface IColumn {
    id: 'status' | 'name' | 'position'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}
