import { LoaderTable } from '@/shared/ui/LoaderTable/LoaderTable.tsx'
import { useToast } from '@/shared/lib/hooks/toast'
import { Box, TableCell, TableRow } from '@mui/material'
import { columnsTable } from './model/columnsTable.ts'
import { TableSample } from '@/shared/ui/TableSample'

const objectInArray = {
    status: 'Заяка',
    name: 'Сварочные работы',
    position: '1',
}
const testArray = new Array(7).fill(objectInArray)

export const StatusWorkOrdersTable = () => {
    // const { data: usersData, isLoading, isError } = useGetUsersListQuery()
    const isLoading = false
    const isError = false
    const { TOAST_ERROR } = useToast()

    if (isLoading) return <LoaderTable />
    if (isError) {
        if (isError) return TOAST_ERROR('Ошибка получения статусов')
        return <LoaderTable />
    }

    return (
        <TableSample
            columnsTable={columnsTable}
            stylesTableContainer={{ maxHeight: 424 }}
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
