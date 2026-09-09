export interface IColumn {
    id: 'name' | 'position'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}
