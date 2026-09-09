import { memo, useState, useMemo, useEffect, type ReactNode } from 'react'
import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableSortLabel,
    Paper,
    Box,
    TablePagination,
    TextField,
    useMediaQuery,
} from '@mui/material'
import { useGetUsersListQuery } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { LoaderTable } from '@/shared/ui/LoaderTable/LoaderTable'
import { ChangeUser } from '@/features/users-list/ChangeUser'
import { RemoveUser } from '@/features/users-list/RemoveUser'
import { columnsTable } from './model/columnsTable'
import { ColumnSkeletonDef, SkeletonTable } from '@/shared/ui/SkeletonTable'
import Skeleton from '@mui/material/Skeleton'
import { tableToolbarRowSx, tableToolbarSearchSx } from '@/shared/lib/mui/tableToolbarSplitSx'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'

type Order = 'asc' | 'desc' | ''

/** Колонки, скрываемые на узких экранах (≤420px). */
const MOBILE_HIDDEN_COLUMNS = new Set<string>(['id', 'email', 'phone'])

const columns: ColumnSkeletonDef[] = [
    { key: 'id', width: '8%', skeletonWidth: 25 },
    { key: 'name', width: '30%' },
    { key: 'email', width: '30%' },
    { key: 'phone', width: '30%' },
    { key: 'actions', width: '0.5%', variant: 'circular', skeletonWidth: 34, skeletonHeight: 34 },
]

interface UsersTableProps {
    toolbarSlot?: ReactNode
    pageTitle?: string
}

export const UsersTable = memo(({ toolbarSlot, pageTitle }: UsersTableProps) => {
    useSetPageTitle(pageTitle)
    const isCompact = useMediaQuery('(max-width:420px)')
    const visibleColumns = useMemo(
        () => (isCompact ? columnsTable.filter((c) => !MOBILE_HIDDEN_COLUMNS.has(c.id)) : columnsTable),
        [isCompact],
    )
    const { data: usersData, isLoading, isError } = useGetUsersListQuery()
    const { TOAST_ERROR } = useToast()

    const [orderBy, setOrderBy] = useState<string>('')
    const [order, setOrder] = useState<Order>('')
    const [page, setPage] = useState(0)
    const [searchTerm, setSearchTerm] = useState<string>('')

    const rowsPerPage = 15

    useEffect(() => {
        setPage(0)
    }, [orderBy, order, usersData?.data, searchTerm])

    const handleRequestSort = (property: string) => {
        if (orderBy !== property) {
            setOrderBy(property)
            setOrder('asc')
        } else if (order === 'asc') {
            setOrder('desc')
        } else {
            setOrderBy('')
            setOrder('')
        }
    }

    const comparator = (a: any, b: any, property: string) => {
        const aVal = a[property]
        const bVal = b[property]
        if (aVal == null) return 1
        if (bVal == null) return -1
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return aVal - bVal
        }
        return String(aVal).localeCompare(String(bVal))
    }

    const filteredData = useMemo(() => {
        const rows = usersData?.data || []
        if (!searchTerm) return rows
        const term = searchTerm.toLowerCase()
        return rows.filter((row: any) =>
            columnsTable.some((col) => {
                const raw = row[col.id]
                return String(raw ?? '')
                    .toLowerCase()
                    .includes(term)
            }),
        )
    }, [usersData?.data, searchTerm])

    const sortedData = useMemo(() => {
        if (!orderBy || !order) return filteredData
        return [...filteredData].sort((a, b) => {
            const cmp = comparator(a, b, orderBy)
            return order === 'asc' ? cmp : -cmp
        })
    }, [filteredData, orderBy, order])

    const paginatedData = useMemo(() => {
        const start = page * rowsPerPage
        return sortedData.slice(start, start + rowsPerPage)
    }, [sortedData, page])

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage)
    }

    if (isLoading) {
        return (
            <Box
                mt={'-1rem'}
                display='flex'
                flexDirection='column'
                padding={0}
            >
                <Box sx={{ ...tableToolbarRowSx, mb: '-0.75rem' }}>
                    <Skeleton
                        className='toolbarSearch'
                        height={40}
                    />
                    <Skeleton
                        className='toolbarSlot'
                        width={195}
                        height={40}
                    />
                </Box>
                <SkeletonTable
                    rowCount={5}
                    columns={isCompact ? columns.filter((c) => !MOBILE_HIDDEN_COLUMNS.has(c.key)) : columns}
                />
            </Box>
        )
    }

    if (isError || !usersData) {
        TOAST_ERROR('Ошибка получения пользователей')
        return <LoaderTable />
    }

    return (
        <>
            <Box sx={tableToolbarRowSx}>
                <TextField
                    className='toolbarSearch'
                    size='small'
                    variant='outlined'
                    placeholder='Поиск по таблице'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={tableToolbarSearchSx}
                />
                {toolbarSlot ? <Box className='toolbarSlot'>{toolbarSlot}</Box> : null}
            </Box>

            <TableContainer
                component={Paper}
                sx={{
                    'maxHeight': '85vh',
                    '& .MuiTableCell-head': {
                        backgroundColor: 'var(--primary-color)',
                        color: '#FFF',
                    },
                    '& .MuiTableBody-root .MuiTableCell-root': {
                        backgroundColor: '#fdc7b154',
                    },
                    '& .MuiTableSortLabel-root, & .MuiTableSortLabel-icon': {
                        color: '#FFF !important',
                    },
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {visibleColumns.map((col) => (
                                <TableCell
                                    key={col.id}
                                    sx={{ minWidth: col.minWidth }}
                                    sortDirection={orderBy === col.id ? order || false : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === col.id}
                                        direction={order === '' ? 'asc' : order}
                                        onClick={() => handleRequestSort(col.id)}
                                        hideSortIcon={orderBy !== col.id}
                                    >
                                        {col.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell
                                align='right'
                                sx={{ backgroundColor: 'var(--primary-color)', color: '#FFF' }}
                            >
                                Действия
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedData.map((row: any, idx: any) => (
                            <TableRow
                                hover
                                tabIndex={-1}
                                key={row.id ?? idx}
                            >
                                {visibleColumns.map((col) => (
                                    <TableCell
                                        key={col.id}
                                        sx={{ minWidth: col.minWidth }}
                                    >
                                        {row[col.id] ?? '–'}
                                    </TableCell>
                                ))}
                                <TableCell align='right'>
                                    <Box
                                        display='flex'
                                        justifyContent='flex-end'
                                    >
                                        <ChangeUser id={row.id} />
                                        <RemoveUser id={row.id} />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <TablePagination
                    component='div'
                    count={sortedData.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[rowsPerPage]}
                    labelRowsPerPage=''
                />
            </TableContainer>
        </>
    )
})
