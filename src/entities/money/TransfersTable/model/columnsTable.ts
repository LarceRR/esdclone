import { IColumn } from './types'

export const columnsTable: IColumn[] = [
    { id: 'id', label: 'Номер', minWidth: 44 },
    { id: 'date', label: 'Дата создания', minWidth: 98 },
    { id: 'cashbox_req', label: 'Касса отправитель', minWidth: 118 },
    { id: 'cashbox_res', label: 'Касса получатель', minWidth: 118 },
    { id: 'sum', label: 'Сумма', minWidth: 62 },
    { id: 'desc', label: 'Комментарий', minWidth: 118 },
]
