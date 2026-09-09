import { useGetAllBoxesQuery } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { LoaderTable } from '@/shared/ui/LoaderTable/LoaderTable.tsx'
import { columnsTable } from './model/columnsTable.ts'
import { Box, TableCell, TableRow } from '@mui/material'
import { ChangeBox } from '@/features/boxes-list/ChangeBox'
import RemoveBox from '@/features/boxes-list/RemoveBox'
import { TableSample } from '@/shared/ui/TableSample'

export const BoxesTable = ({ styles }: { styles?: React.CSSProperties }) => {
    const { data: boxesData, isLoading, isError } = useGetAllBoxesQuery()

    const { TOAST_ERROR } = useToast()

    if (isLoading) return <LoaderTable />
    if (isError) {
        TOAST_ERROR('Ошибка получения боксов')
        return <LoaderTable />
    }
    if (!isLoading && !boxesData?.data?.length) {
        return <p>Нет боксов</p>
    }

    return (
        <TableSample
            stylesTableContainer={{ ...styles }}
            columnsTable={columnsTable}
        >
            {boxesData.data.map((row, index) => {
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
                                    sx={{ maxWidth: item.minWidth }}
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
                                <ChangeBox id={row.id} />
                                <RemoveBox id={row.id} />
                            </Box>
                        </TableCell>
                    </TableRow>
                )
            })}
        </TableSample>
    )
}
