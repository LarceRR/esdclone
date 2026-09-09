export interface IColumn {
    id: 'number' | 'provider' | 'description'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}
