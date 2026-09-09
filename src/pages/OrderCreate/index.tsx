import { memo, useState, useEffect, useMemo } from 'react'
import LayoutContent from '@/widgets/general/LayoutContent'
import { useGetListGoodsQuery } from '@/shared/api'
import { Box, Tabs, Tab, Button } from '@mui/material'
import { ProductItem } from '@/entities/sales/OrdersTable'
import { mapHoldItemsToOrderProducts, type OrderCatalogProduct } from '@/entities/sales/OrdersTable/lib/mapOrderProduct'
import { XlsParser } from '@/pages/Order/XlsParser'
import { CsvParser } from '@/pages/Order/CsvParser'
import { EditProductsTable } from '@/pages/OrderCreate/EditProductsTable.tsx'

export const OrderCreate = memo(() => {
    const { data: goodsData } = useGetListGoodsQuery()

    const [status, setStatus] = useState(0)

    const [tabIndex, setTabIndex] = useState<number>(0)
    const [products, setProducts] = useState<OrderCatalogProduct[]>([])
    const [editedProducts, setEditedProducts] = useState<ProductItem[] | null>([])
    const [date, setDate] = useState<Date>(new Date())

    useEffect(() => {
        if (goodsData?.data) setProducts(mapHoldItemsToOrderProducts(goodsData.data))
    }, [goodsData])

    const orderCatalogProducts = useMemo(
        () => mapHoldItemsToOrderProducts(goodsData?.data ?? []),
        [goodsData?.data],
    )

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
                    <Tab label='Создание заказа' />
                </Tabs>

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
            </Box>

            {tabIndex === 0 && (
                <EditProductsTable
                    onChangeDate={setDate}
                    date={date}
                    switchChecked={!!status || false}
                    onSwitchChecked={() => setStatus(status === 0 ? 1 : 0)}
                    // @ts-ignore
                    products={products}
                    // @ts-ignore
                    selectedProducts={editedProducts}
                    // @ts-ignore
                    setSelectedProducts={setEditedProducts}
                />
            )}
        </LayoutContent>
    )
})

export default OrderCreate
