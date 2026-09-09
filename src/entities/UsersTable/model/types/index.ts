export interface IColumn {
    id: 'id' | 'name' | 'email' | 'phone'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}
