import React from 'react'
import { useGetListWorkOrdersQuery } from '@/shared/api'
import { Box, TableCell, TableRow } from '@mui/material'
import { columnsTable } from './model/columnsTable.ts'
import { useToast } from '@/shared/lib/hooks/toast'
import { RemoveOrder } from '@/features/work-orders/RemoveOrder'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import ChangeOrder from '@/features/work-orders/ChangeOrder'
import { LoaderTable } from '@/shared/ui/LoaderTable/LoaderTable.tsx'
import { TableSample } from '@/shared/ui/TableSample'

export const WorkOrdersTable: React.FC = () => {
    const { data: ordersData, isError, isLoading } = useGetListWorkOrdersQuery()
    const { TOAST_ERROR } = useToast()

    if (isLoading || !ordersData) return <LoaderTable />

    if (isError) return TOAST_ERROR('Ошибка получения заказв')
    // if (!isLoading && !usersData?.data?.length) {
    //     return <p>Данные отсутствуют</p>
    // }

    const data = ordersData && Object.values(ordersData)

    return (
        <TableSample columnsTable={columnsTable}>
            {/*@ts-ignore*/}
            {data['0'].map((row) => {
                return (
                    <TableRow
                        hover
                        role='checkbox'
                        tabIndex={-1}
                        key={row.id}
                    >
                        {columnsTable.map((item, index) => {
                            if (item.id === 'date_end_work' || item.id === 'date_start_work') {
                                return (
                                    <TableCell
                                        sx={{ minWidth: item.minWidth }}
                                        key={index}
                                    >
                                        {dayjs(row[item.id]).locale('ru').format('DD.MM.YYYY HH:mm:ss')}
                                    </TableCell>
                                )
                            }
                            return (
                                <TableCell
                                    sx={{ minWidth: item.minWidth }}
                                    key={index}
                                >
                                    {row[item.id]}
                                </TableCell>
                            )
                        })}
                        <TableCell align={'right'}>
                            <Box display={'flex'}>
                                <ChangeOrder
                                    open={false}
                                    onClose={() => {}}
                                    orderId={row.id}
                                    module={'table'}
                                />
                                {/*<EditOrder id={row.id} />*/}
                                <RemoveOrder id={row.id} />
                            </Box>
                        </TableCell>
                    </TableRow>
                )
            })}
        </TableSample>
    )
}
