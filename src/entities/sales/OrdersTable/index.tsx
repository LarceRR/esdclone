import { memo, useState, useMemo, useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Box,
    TextField,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableSortLabel,
    Paper,
    TablePagination,
} from '@mui/material'
import { LoaderTable } from '@/shared/ui/LoaderTable/LoaderTable'
import { useToast } from '@/shared/lib/hooks/toast'
import { useGetCustomerOrdersListQuery } from '@/shared/api'
import { ViewSale } from '@/features/sales/sale/ViewSale'
import { columnsTable } from './model/columnsTable'
import { formatDateRu } from '@/pages/Order'
import { ColumnSkeletonDef, SkeletonTable } from '@/shared/ui/SkeletonTable'
import Skeleton from '@mui/material/Skeleton'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { tableToolbarSplitRowSx } from '@/shared/lib/mui/tableToolbarSplitSx'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { CreatePlusTrigger } from '@/shared/ui/CreatePlusTrigger'

export type ProductItem = {
    quantity: number
    product: {
        id: number
        title: string
        cash: number
        image: string | File
    } | null
}

type OrderSort = 'asc' | 'desc' | ''

interface OrderData {
    id: number
    user: (Record<string, any> & { created_at: string }) | null
    products: ProductItem[]
}

const columns: ColumnSkeletonDef[] = [
    { key: 'id', width: '1%' },
    { key: 'created_at', width: '6%' },
    { key: 'name', width: '8%' },
    { key: 'phone', width: '8%' },
    { key: 'email', width: '10%' },
    { key: 'actions', width: '0.5%', variant: 'circular', skeletonWidth: 34, skeletonHeight: 34 },
]

export const OrdersTable = memo(() => {
    const navigate = useNavigate()
    const { data: customerOrdersData, isLoading, isError } = useGetCustomerOrdersListQuery()
    const { TOAST_ERROR } = useToast()
    const { pathname } = useLocation()

    const [orderBy, setOrderBy] = useState<string>('')
    const [order, setOrder] = useState<OrderSort>('')
    const [page, setPage] = useState<number>(() => {
        const saved = window.localStorage.getItem('ordersTablePage')
        const isDeleted = window.localStorage.getItem('isDeleted')
        return saved !== null && isDeleted === 'true' ? parseInt(saved, 10) : 0
    })
    const [searchTerm, setSearchTerm] = useState<string>('')
    const rowsPerPage = 15

    useSetPageTitle(`Заказы – страница ${page + 1}`)

    const handleRequestSort = useCallback(
        (property: string) => {
            if (orderBy !== property) {
                setOrderBy(property)
                setOrder('asc')
            } else if (order === 'asc') {
                setOrder('desc')
            } else {
                setOrderBy('')
                setOrder('')
            }
        },
        [orderBy, order],
    )

    useEffect(() => {
        const isDeleted = window.localStorage.getItem('isDeleted')
        if (isDeleted && isDeleted === 'true') {
            window.localStorage.setItem('isDeleted', 'false')
        } else {
            window.localStorage.setItem('isDeleted', 'false')
        }
    }, [pathname, window.localStorage])

    const handleChangePage = useCallback((_: unknown, newPage: number) => {
        setPage(newPage)
        window.localStorage.setItem('ordersTablePage', newPage.toString())
        window.localStorage.setItem('isDeleted', 'false')
    }, [])

    const filteredData = useMemo(() => {
        const rows: OrderData[] = customerOrdersData?.data || []
        if (!searchTerm) return rows
        const term = searchTerm.toLowerCase()
        return rows.filter((row: OrderData) =>
            columnsTable.some((col) => {
                const rawValue = col.id === 'id' ? row.id : col.id === 'created_at' ? row.user?.created_at : row.user?.[col.id]
                return String(rawValue ?? '')
                    .toLowerCase()
                    .includes(term)
            }),
        )
    }, [customerOrdersData?.data, searchTerm])

    const comparator = useCallback((a: OrderData, b: OrderData, property: string) => {
        let aVal: number | string | null | undefined
        let bVal: number | string | null | undefined

        if (property === 'id') {
            aVal = a.id
            bVal = b.id
        } else if (property === 'created_at') {
            aVal = a.user?.created_at
            bVal = b.user?.created_at
        } else {
            aVal = a.user?.[property]
            bVal = b.user?.[property]
        }

        if (aVal == null) return 1
        if (bVal == null) return -1
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return aVal - bVal
        }
        return String(aVal).localeCompare(String(bVal))
    }, [])

    const sortedData = useMemo(() => {
        if (!orderBy || !order) return filteredData
        return [...filteredData].sort((a, b) => {
            const cmp = comparator(a, b, orderBy)
            return order === 'asc' ? cmp : -cmp
        })
    }, [filteredData, orderBy, order, comparator])

    const paginatedData = useMemo(() => {
        const start = page * rowsPerPage
        return sortedData.slice(start, start + rowsPerPage)
    }, [sortedData, page])

    const containerSx = useMemo(
        () => ({
            'width': '100%',
            'maxHeight': '75vh',
            'overflowY': 'auto',
            '& .MuiTableCell-head': {
                backgroundColor: 'var(--primary-color)',
                color: '#FFF',
            },
            '& .MuiTableSortLabel-root, & .MuiTableSortLabel-icon': {
                color: '#FFF !important',
            },
        }),
        [],
    )

    if (isLoading) {
        return (
            <Box
                mt={'-0.75rem'}
                display='flex'
                flexDirection='column'
                padding={0}
            >
                <Box
                    mb={'-0.25rem'}
                    display={'flex'}
                    justifyContent={'flex-end'}
                >
                    <Skeleton
                        width={'195px'}
                        height={'65px'}
                    />
                </Box>
                <SkeletonTable
                    rowCount={11}
                    columns={columns}
                />
            </Box>
        )
    }

    if (isError) {
        TOAST_ERROR('Ошибка получения заказов')
        return <LoaderTable />
    }

    return (
        <>
            <Box sx={{ ...tableToolbarSplitRowSx, mb: 2 }}>
                <TextField
                    className='toolbarSearch'
                    size='small'
                    variant='outlined'
                    placeholder='Поиск по таблице'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        '@media (max-width: 767px)': {
                            '& .MuiOutlinedInput-root': { width: '100%' },
                        },
                    }}
                />
                <Box className='toolbarSlot'>
                    <CreatePlusTrigger
                        label='Добавить новый заказ'
                        onClick={() => navigate(ELinks.SALES_ORDER_CREATE)}
                    />
                </Box>
            </Box>

            <TableContainer
                component={Paper}
                sx={containerSx}
            >
                <Table
                    stickyHeader
                    aria-label='orders table'
                >
                    <TableHead>
                        <TableRow>
                            {columnsTable.map((column) => (
                                <TableCell
                                    key={column.id}
                                    sx={{ maxWidth: column.minWidth }}
                                    sortDirection={orderBy === column.id ? order || false : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={order === '' ? 'asc' : order}
                                        onClick={() => handleRequestSort(column.id)}
                                        hideSortIcon={orderBy !== column.id}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell
                                align='right'
                                sx={{ backgroundColor: 'var(--primary-color)', color: '#FFF' }}
                            >
                                Управление
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row: OrderData) => (
                            <TableRow
                                hover
                                key={row.id}
                                sx={{ cursor: 'pointer' }}
                                onClick={() => {
                                    window.localStorage.setItem('ordersTablePage', page.toString())
                                    navigate(`/sales/${row.id}`)
                                }}
                            >
                                {columnsTable.map((col) => (
                                    <TableCell
                                        key={col.id}
                                        sx={{ minWidth: col.minWidth }}
                                    >
                                        {col.id === 'id'
                                            ? row.id
                                            : col.id === 'created_at'
                                              ? // @ts-ignore
                                                formatDateRu(row?.date || '')
                                              : (row.user?.[col.id] ?? '-')}
                                    </TableCell>
                                ))}
                                <TableCell
                                    align='right'
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/*@ts-ignore*/}
                                    <ViewSale products={row.products} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component='div'
                count={sortedData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[rowsPerPage]}
                labelRowsPerPage=''
            />
        </>
    )
})
