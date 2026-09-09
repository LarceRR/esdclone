import { IColumn } from './types'

export const columnsTable: IColumn[] = [
    { id: 'id', label: 'Номер', minWidth: 44 },
    { id: 'date', label: 'Дата создания', minWidth: 98 },
    { id: 'type', label: 'Тип', minWidth: 78 },
    { id: 'counterparty', label: 'Контрагент', minWidth: 98 },
    { id: 'article', label: 'Статья', minWidth: 98 },
    { id: 'cashbox', label: 'Касс', minWidth: 78 },
    { id: 'sum', label: 'Сумма', minWidth: 62 },
    { id: 'nds', label: 'НДС', minWidth: 44 },
]
