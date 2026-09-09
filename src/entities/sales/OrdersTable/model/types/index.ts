export interface IColumn {
    id: 'id' | 'name' | 'phone' | 'email' | 'created_at'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}
