import { LoaderTable } from '@/shared/ui/LoaderTable/LoaderTable.tsx'
import { useToast } from '@/shared/lib/hooks/toast'
import { Box, TableCell, TableRow } from '@mui/material'
import { columnsTable } from './model/columnsTable.ts'
import { TableSample } from '@/shared/ui/TableSample'
import { RemoveDiscount } from '@/features/work-orders/settings/discount/RemoveDiscount'
import { useGetDiscountListQuery } from '@/shared/api'
import { ChangeDiscount } from '@/features/work-orders/settings/discount/ChangeDiscount'

export const DiscountTable = () => {
    const { data: discountData, isLoading, isError } = useGetDiscountListQuery()
    const { TOAST_ERROR } = useToast()

    if (isLoading) return <LoaderTable />
    if (isError) {
        if (isError) return TOAST_ERROR('Ошибка получения карт')
        return <LoaderTable />
    }
    if (!isLoading && !discountData?.data?.length) {
        return <p>Данные отсутствуют</p>
    }

    return (
        <TableSample
            columnsTable={columnsTable}
            stylesTableContainer={{ maxHeight: 424 }}
        >
            {discountData.data.map((row, index) => {
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
                                <ChangeDiscount id={row.id} />
                                <RemoveDiscount id={row.id} />
                            </Box>
                        </TableCell>
                    </TableRow>
                )
            })}
        </TableSample>
    )
}
