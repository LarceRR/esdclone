import { useCallback, useState } from 'react'
import { EditButtonTable } from '@/shared/ui/EditButtonTable'
import ShowIcon from '@public/icons/show-icon.svg'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

type ProductItem = {
    quantity: number
    product: {
        id: number
        category_id: number
        title: string
        description: string | null
        cash: number
        image: string
        created_at: string
        updated_at: string
    } | null
}

export const ViewSale = ({ products }: { products: ProductItem[] }) => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const onOpenModal = useCallback(() => setToggleModal(true), [])
    const onCloseModal = useCallback(() => setToggleModal(false), [])

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
        }).format(value)

    return (
        <EditButtonTable
            onClose={onCloseModal}
            onOpen={onOpenModal}
            toggle={toggleModal}
            icon={<ShowIcon />}
            title='Товары заказа'
        >
            {products && products.length > 0 ? (
                <TableContainer
                    component={Paper}
                    sx={{ mt: 2 }}
                >
                    <Table
                        size='small'
                        aria-label='products table'
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell align='right'>Количество</TableCell>
                                <TableCell align='right'>Цена за единицу</TableCell>
                                <TableCell align='right'>Сумма</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((item, idx) => {
                                const { quantity, product } = item
                                const title = product?.title ?? '—'
                                const price = product?.cash ?? 0
                                const total = price * quantity
                                return (
                                    <TableRow key={idx}>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>
                                            {product ? (
                                                <Typography variant='body2'>{title}</Typography>
                                            ) : (
                                                <Typography
                                                    variant='body2'
                                                    color='text.disabled'
                                                >
                                                    Нет данных
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align='right'>{quantity}</TableCell>
                                        <TableCell align='right'>{product ? formatCurrency(price) : '—'}</TableCell>
                                        <TableCell align='right'>{product ? formatCurrency(total) : '—'}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography
                    variant='body2'
                    sx={{ mt: 2 }}
                >
                    Нет продуктов для отображения
                </Typography>
            )}
        </EditButtonTable>
    )
}
