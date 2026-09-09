import { useToast } from '@/shared/lib/hooks/toast'
import { LoaderTable } from '@/shared/ui/LoaderTable/LoaderTable.tsx'
import { Box, TableCell, TableRow } from '@mui/material'
import { columnsTable } from './model/columnsTable.ts'
import { useGetCarListQuery } from '@/shared/api'
import { RemoveCar } from '@/features/work-orders/settings/car/RemoveCar'
import { TableSample } from '@/shared/ui/TableSample'
import { ChangeCar } from '@/features/work-orders/settings/car/ChangeCar'

export const CarTable = () => {
    const { data: carData, isLoading, isError } = useGetCarListQuery()
    const { TOAST_ERROR } = useToast()

    if (isLoading) return <LoaderTable />
    if (isError) {
        if (isError) return TOAST_ERROR('Ошибка получения автомобилей')
        return <LoaderTable />
    }
    if (!isLoading && !carData?.data?.length) {
        return <p style={{ marginTop: '0.5rem' }}>Нет автомобилей</p>
    }
    // if (!isLoading && !usersData?.data?.length) {
    //     return <p>Данные отсутствуют</p>
    // }

    return (
        <TableSample
            columnsTable={columnsTable}
            stylesTableContainer={{ maxHeight: 424 }}
        >
            {carData?.data?.map((row, index) => {
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
                                <ChangeCar id={row.id} />
                                <RemoveCar id={row.id} />
                                {/*actions*/}
                            </Box>
                        </TableCell>
                    </TableRow>
                )
            })}
        </TableSample>
    )
}
