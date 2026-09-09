import { IColumn } from './types'

export const columnsTable: IColumn[] = [
    { id: 'id', label: 'Номер', minWidth: 78 },
    { id: 'invoice_number', label: 'Номер накладной', minWidth: 118 },
    { id: 'invoice_date', label: 'Дата накладной', minWidth: 118 },
    { id: 'created_at', label: 'Дата создания', minWidth: 118 },
    { id: 'counterparty', label: 'Контрагент', minWidth: 148 },
    { id: 'sum', label: 'Сумма', minWidth: 118 },
    { id: 'description', label: 'Комментарий', minWidth: 148 },
]
