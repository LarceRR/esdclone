export interface IColumn {
    id: 'id' | 'title'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}
