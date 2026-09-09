export interface IColumn {
    id: 'id' | 'name'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}
