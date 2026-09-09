export interface IColumn {
    id: 'id' | 'name_1' | 'surname_1' | 'name_2' | 'surname_2' | 'team_name' | 'region' | 'email' | 'phone'
    label: string
    minWidth?: number
    align?: 'right'
    format?: (value: number) => string
}
