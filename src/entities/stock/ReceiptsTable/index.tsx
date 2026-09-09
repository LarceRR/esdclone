import { TableSample } from '@/shared/ui/TableSample'
import { columnsTable } from './model/columnsTable.ts'
import { LoaderTable } from '@/shared/ui/LoaderTable/LoaderTable.tsx'
import { useToast } from '@/shared/lib/hooks/toast'
import { IColumn } from './model/types'
import { Box, TableCell, TableRow } from '@mui/material'

const objectInArray: Record<IColumn['id'], number | string> = {
    id: 4000,
    invoice_number: 23414313,
    invoice_date: '10.12.2023',
    created_at: '17.12.2023',
    counterparty: 'Counterparty #1',
    sum: 10000,
    description: 'text',
}
const testArray = new Array(15).fill(objectInArray)

export const ReceiptsTable = () => {
    // const { data: usersData, isLoading, isError } = useGetUsersListQuery()
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
            stylesTableContainer={{ maxHeight: '85vh' }}
            columnsTable={columnsTable}
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
