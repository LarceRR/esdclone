import { memo, useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import LayoutContent from '@/widgets/general/LayoutContent'
import { useGetCustomerOrderMutation, useGetCustomerOrdersListQuery, useGetListGoodsQuery, useUpdateCustomerOrderMutation } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { LoaderTable } from '@/shared/ui/LoaderTable/LoaderTable'
import { Box, TextField, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Tabs, Tab, Button } from '@mui/material'
import { EditProductsTable } from '@/entities/sales/OrdersTable/EditProductsTable'
import { ProductItem } from '@/entities/sales/OrdersTable'
import { mapHoldItemsToOrderProducts, type OrderCatalogProduct } from '@/entities/sales/OrdersTable/lib/mapOrderProduct'
import { XlsParser } from '@/pages/Order/XlsParser'
import { CsvParser } from '@/pages/Order/CsvParser'

export function formatDateRu(dateString: string): string {
    const [datePart, timePart] = dateString.split(' ')
    const [yearStr, monthStr, dayStr] = datePart.split('-')
    const year = +yearStr
    const month = +monthStr
    const day = +dayStr

    const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

    const dd = String(day).padStart(2, '0')
    const mm = monthNames[month - 1]

    return `${dd} ${mm} ${year} ${timePart}`
}

export const Order = memo(() => {
    const { id } = useParams<{ id: string }>()
    const { data: ordersData, isLoading, isError } = useGetCustomerOrdersListQuery()
    const { data: goodsData } = useGetListGoodsQuery()
    const [updateOrder] = useUpdateCustomerOrderMutation()
    const [getOrder] = useGetCustomerOrderMutation()
    const { TOAST_ERROR } = useToast()

    const [status, setStatus] = useState(0)

    const [tabIndex, setTabIndex] = useState<number>(0)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [products, setProducts] = useState<OrderCatalogProduct[]>([])
    const [editedProducts, setEditedProducts] = useState<ProductItem[] | null>([])

    useEffect(() => {
        if (goodsData?.data) setProducts(mapHoldItemsToOrderProducts(goodsData.data))
    }, [goodsData])

    const orderCatalogProducts = useMemo(
        () => mapHoldItemsToOrderProducts(goodsData?.data ?? []),
        [goodsData?.data],
    )

    useEffect(() => {
        // @ts-ignore
        getOrder(id)
            .unwrap()
            .then((res) => {
                if (res.code === 200) {
                    setStatus(res.data.order.status || 0)
                }
            })
    }, [id, updateOrder, ordersData, status])

    const order = useMemo(() => ordersData?.data.find((o: any) => String(o.id) === id) || null, [ordersData, id])

    useEffect(() => {
        if (!order) return
        setEditedProducts(order.products.map((p: any) => ({ quantity: p.quantity, product: p.product })))
    }, [order])

    const originalProducts = useMemo(() => (order ? order.products.map((p: any) => ({ quantity: p.quantity, product: p.product })) : []), [order])

    const onUpdateActiveOrder = () => {
        updateOrder({ ...order, status: status === 0 ? 1 : 0 })
            .unwrap()
            .then(() => setStatus(status === 0 ? 1 : 0))
    }

    const containerSx = useMemo(
        () => ({
            'width': '100%',
            'maxHeight': '65vh',
            '& .MuiTableCell-head': {
                backgroundColor: 'var(--primary-color)',
                color: '#FFF',
            },
        }),
        [],
    )

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return originalProducts
        const term = searchTerm.toLowerCase()
        return originalProducts.filter((item: any) => item.product?.title.toLowerCase().includes(term))
    }, [originalProducts, searchTerm])

    if (isLoading) return <LoaderTable />
    if (isError || !order) {
        TOAST_ERROR('Не удалось загрузить заказ')
        return <LoaderTable />
    }

    return (
        <LayoutContent>
            <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                mb={2}
            >
                <Tabs
                    value={tabIndex}
                    onChange={(_, v) => setTabIndex(v)}
                    aria-label='Табы заказа'
                >
                    <Tab label='Заказ' />
                    <Tab label='Продукция' />
                </Tabs>

                {tabIndex === 0 ? (
                    <TextField
                        size='small'
                        variant='outlined'
                        placeholder='Поиск по товарам'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                ) : (
                    <Box
                        display={'flex'}
                        alignItems={'center'}
                        gap={'0.5rem'}
                    >
                        <Box
                            display={'flex'}
                            alignItems={'center'}
                            gap={'0.5rem'}
                            style={{ display: !status ? 'none' : 'flex' }}
                        >
                            <CsvParser
                                goodsData={orderCatalogProducts}
                                setEditedProducts={setEditedProducts}
                            />
                            <XlsParser
                                goodsData={orderCatalogProducts}
                                setEditedProducts={setEditedProducts}
                            />
                        </Box>
                        <Button
                            onClick={() => {
                                // @ts-ignore
                                setEditedProducts((prev) => [...prev, { quantity: 0, product: { title: '', cash: 0 } }])
                            }}
                            variant={'contained'}
                            size={'medium'}
                        >
                            Добавить новый товар
                        </Button>
                    </Box>
                )}
            </Box>

            {tabIndex === 0 && (
                <Box
                    mb={2}
                    display={'flex'}
                    alignItems={'center'}
                    gap={'0.5rem'}
                >
                    <h6>Дата заказа:</h6>
                    <h6>{formatDateRu(order.date)}</h6>
                </Box>
            )}

            {tabIndex === 0 && (
                <TableContainer
                    component={Paper}
                    sx={containerSx}
                >
                    <Table
                        stickyHeader
                        aria-label='order-products-table'
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Продукция</TableCell>
                                <TableCell>Кол-во</TableCell>
                                <TableCell>Цена за ед.</TableCell>
                                <TableCell>Сумма</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.map((item: any, idx: number) => {
                                const title = item.product?.title || '—'
                                const qty = item.quantity
                                const unitPrice = item.product?.cash ?? 0
                                const sum = qty * unitPrice
                                return (
                                    <TableRow key={idx}>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>{title}</TableCell>
                                        <TableCell>{qty}</TableCell>
                                        <TableCell>{unitPrice}</TableCell>
                                        <TableCell>{sum}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {tabIndex === 1 && (
                <EditProductsTable
                    switchChecked={!!status || false}
                    onSwitchChecked={onUpdateActiveOrder}
                    // @ts-ignore
                    products={products}
                    order={order}
                    // @ts-ignore
                    selectedProducts={editedProducts}
                    // @ts-ignore
                    setSelectedProducts={setEditedProducts}
                />
            )}
        </LayoutContent>
    )
})

export default Order
