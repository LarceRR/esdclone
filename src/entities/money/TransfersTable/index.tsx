import { useToast } from '@/shared/lib/hooks/toast'
import { LoaderTable } from '@/shared/ui/LoaderTable/LoaderTable.tsx'
import { Box, TableCell, TableRow } from '@mui/material'
import { columnsTable } from './model/columnsTable.ts'
import { TableSample } from '@/shared/ui/TableSample'

const objectInArray = {
    id: 1,
    date: '15:15:15 10/09/2024',
    cashbox_req: 'Тинькоф (Т-Банк)',
    cashbox_res: 'Сбербанк',
    sum: 40000,
    desc: 'Тестовый перевод',
}

const testArray = new Array(15).fill(objectInArray)

export const TransfersTable = () => {
    const isLoading = false
    const isError = false
    const { TOAST_ERROR } = useToast()

    if (isLoading) return <LoaderTable />
    if (isError) {
        if (isError) return TOAST_ERROR('Ошибка получения таблицы')
        return <LoaderTable />
    }
    // if (!isLoading && !usersData?.data?.length) {
    //     return <p>Данные отсутствуют</p>
    // }

    return (
        <TableSample
            columnsTable={columnsTable}
            stylesTableContainer={{ maxHeight: '85vh' }}
        >
            {testArray.map((row, index) => {
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
                                {/*actions*/}
                            </Box>
                        </TableCell>
                    </TableRow>
                )
            })}
        </TableSample>
    )
}
