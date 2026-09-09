import React, { useState, useMemo, useEffect, type ReactNode } from 'react'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Paper, Box, TablePagination, TextField } from '@mui/material'
import { useGetGroupsQuery } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { LoaderTable } from '@/shared/ui/LoaderTable/LoaderTable'
import { ChangeGroup } from '@/features/groups-list/ChangeGroup'
import { RemoveGroup } from '@/features/groups-list/RemoveGroup'
import { columnsTable } from './model/columnsTable'
import Skeleton from '@mui/material/Skeleton'
import { ColumnSkeletonDef, SkeletonTable } from '@/shared/ui/SkeletonTable'
import { tableToolbarRowSx, tableToolbarSearchSx } from '@/shared/lib/mui/tableToolbarSplitSx'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'

type Order = 'asc' | 'desc' | ''

const columns: ColumnSkeletonDef[] = [
    { key: 'id', width: '13%', skeletonWidth: 25 },
    { key: 'name', width: '90%' },
    { key: 'actions', width: '0.5%', variant: 'circular', skeletonWidth: 34, skeletonHeight: 34 },
]

interface GroupsTableProps {
    toolbarSlot?: ReactNode
    pageTitle?: string
}

export const GroupsTable: React.FC<GroupsTableProps> = ({ toolbarSlot, pageTitle }) => {
    useSetPageTitle(pageTitle)
    const { data: groupsData, isLoading, isError } = useGetGroupsQuery()
    const { TOAST_ERROR } = useToast()

    const [orderBy, setOrderBy] = useState<string>('')
    const [order, setOrder] = useState<Order>('')
    const [page, setPage] = useState(0)
    const [searchTerm, setSearchTerm] = useState<string>('')

    const rowsPerPage = 15

    useEffect(() => {
        setPage(0)
    }, [orderBy, order, groupsData?.data, searchTerm])

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
        const rows = groupsData?.data || []
        if (!searchTerm) return rows
        const term = searchTerm.toLowerCase()
        return rows.filter((row) =>
            columnsTable.some((col) => {
                const raw = row[col.id]
                return String(raw ?? '')
                    .toLowerCase()
                    .includes(term)
            }),
        )
    }, [groupsData?.data, searchTerm])

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
                    rowCount={4}
                    columns={columns}
                />
            </Box>
        )
    }
    if (isError) {
        TOAST_ERROR('Ошибка получения групп')
        return <LoaderTable />
    }
    // if (!sortedData.length) return <p>Нет групп</p>

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
                            {columnsTable.map((col) => (
                                <TableCell
                                    key={col.id}
                                    sx={{ maxWidth: col.minWidth }}
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
                        {paginatedData.map((row, idx) => (
                            <TableRow
                                hover
                                tabIndex={-1}
                                key={row.id ?? idx}
                            >
                                {columnsTable.map((col) => (
                                    <TableCell
                                        key={col.id}
                                        sx={{ maxWidth: col.minWidth }}
                                    >
                                        {row[col.id] ?? '–'}
                                    </TableCell>
                                ))}
                                <TableCell align='right'>
                                    <Box
                                        display='flex'
                                        justifyContent='flex-end'
                                    >
                                        <ChangeGroup id={row.id} />
                                        <RemoveGroup id={row.id} />
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
}
