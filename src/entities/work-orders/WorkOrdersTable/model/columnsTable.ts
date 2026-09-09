import { IColumn } from './types'

export const columnsTable: IColumn[] = [
    { id: 'id', label: 'Номер', minWidth: 44 },
    { id: 'date_start_work', label: 'Начало работы', minWidth: 118 },
    { id: 'date_end_work', label: 'Конец работы', minWidth: 118 },
    { id: 'counterparty', label: 'Контрагент', minWidth: 88 },
    { id: 'cars', label: 'Автомобиль', minWidth: 132 },
    { id: 'sum', label: 'Сумма', minWidth: 78 },
    { id: 'payed', label: 'Заплатил', minWidth: 78 },
    { id: 'status', label: 'Статус', minWidth: 78 },
    { id: 'comments', label: 'Комментарий', minWidth: 118 },
]
