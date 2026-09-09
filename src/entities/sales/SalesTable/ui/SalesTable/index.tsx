import { memo } from 'react'
import { Box, TableCell, TableRow } from '@mui/material'
import { LoaderTable } from '@/shared/ui/LoaderTable/LoaderTable.tsx'
import { columnsTable } from '../../model/columnsTable.ts'
import { useToast } from '@/shared/lib/hooks/toast'
import { useGetOfferListQuery } from '@/shared/api'
import { RemoveSale } from '@/features/sales/sale/RemoveSale'
import { TableSample } from '@/shared/ui/TableSample'
import { ChangeSale } from '@/features/sales/sale/ChangeSale'

export const SalesTable = memo(() => {
    const { data: offerData, isLoading, isError } = useGetOfferListQuery()
    const { TOAST_ERROR } = useToast()

    if (isError) {
        TOAST_ERROR('Ошибка получения заявок')
        return <LoaderTable />
    }

    if (!isLoading && !offerData?.data?.length) {
        return <p>Нет заявок</p>
    }

    return (
        <TableSample
            columnsTable={columnsTable}
            stylesTableContainer={{ maxHeight: '85vh' }}
        >
            {offerData?.data?.map((row, index) => {
                return (
                    <TableRow
                        hover
                        role='checkbox'
                        tabIndex={-1}
                        key={index}
                    >
                        {columnsTable.map((item, index) => {
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
                            <Box
                                display={'flex'}
                                justifyContent={'flex-end'}
                            >
                                <ChangeSale id={row.id} />
                                <RemoveSale id={row.id} />
                            </Box>
                        </TableCell>
                    </TableRow>
                )
            })}
        </TableSample>
    )
})
