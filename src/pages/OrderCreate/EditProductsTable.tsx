import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Autocomplete,
    Box,
    Button,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material'
import { CreateSubmitLoadingButton } from '@/shared/ui/CreateSubmitLoadingButton'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { format } from 'date-fns'
import { useToast } from '@/shared/lib/hooks/toast'
import { IOSSwitch } from '@/features/money/settings/OnlineCashbox'
// import { MoreActions } from '@/entities/sales/OrdersTable/MoreActions.tsx'
import { RemoveProduct } from '@/entities/sales/OrdersTable/RemoveProduct'
import { useCreateCustomerOrderMutation, useGetUsersListQuery } from '@/shared/api'
import { useNavigate } from 'react-router-dom'

export interface ProductItemWithId {
    rowId: string
    product: { id: number; title: string; cash: number }
    quantity: number
    isCancelled?: boolean
}

interface IProps {
    selectedProducts: ProductItemWithId[] | null
    setSelectedProducts: (products: ProductItemWithId[] | null) => void
    products: Array<{ id: number; title: string; cash: number }>
    switchChecked: boolean
    onSwitchChecked: () => void
    date: Date
    onChangeDate: (date: Date) => void
}

export const EditProductsTable = ({ selectedProducts, onChangeDate, date, switchChecked, onSwitchChecked, setSelectedProducts, products }: IProps) => {
    const [createOrder, { isLoading }] = useCreateCustomerOrderMutation()
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const { data: usersList } = useGetUsersListQuery()
    const [userId, setUserId] = useState('')
    const navigate = useNavigate()

    const [inputValues, setInputValues] = useState<string[]>(selectedProducts?.map((item) => item.product.title) ?? [])

    useEffect(() => {
        setInputValues((prev) => {
            const newLen = selectedProducts?.length ?? 0
            if (prev.length < newLen) {
                return [...prev, ...Array(newLen - prev.length).fill('')]
            }
            if (prev.length > newLen) {
                return prev.slice(0, newLen)
            }
            return prev
        })
    }, [selectedProducts?.length])

    const handleInputChange = useCallback((index: number, text: string) => {
        setInputValues((prev) => {
            const next = [...prev]
            next[index] = text
            return next
        })
    }, [])

    const handleProductChange = useCallback(
        (index: number, newProduct: ProductItemWithId['product'] | null) => {
            if (!selectedProducts) return

            if (!newProduct) {
                // @ts-ignore
                setSelectedProducts((prev) =>
                    prev
                        ? // @ts-ignore
                          prev.map((it, i) =>
                              i === index
                                  ? { ...it, product: { id: 0, title: '', cash: 0 } } // quantity сохраняется
                                  : it,
                          )
                        : null,
                )
                handleInputChange(index, '')
                return
            }

            // ищем дубликат товара
            const dup = selectedProducts.findIndex((it, i) => i !== index && it.product.id === newProduct.id && !it.isCancelled)

            if (dup !== -1) {
                // сливаем позиции
                // @ts-ignore
                setSelectedProducts((prev) => {
                    if (!prev) return []
                    // @ts-ignore
                    const merged = prev.map((it, i) => (i === dup ? { ...it, quantity: it.quantity + (prev[index]?.quantity ?? 0) } : it))
                    merged.splice(index, 1)
                    return merged
                })
                setInputValues((prev) => {
                    const next = [...prev]
                    next[dup] = newProduct.title
                    next.splice(index, 1)
                    return next
                })
            } else {
                // замена товара в строке
                // @ts-ignore
                setSelectedProducts((prev) => (prev ? prev.map((it, i) => (i === index ? { ...it, product: newProduct } : it)) : []))
                handleInputChange(index, newProduct.title)
            }
        },
        [selectedProducts, setSelectedProducts, handleInputChange],
    )

    const handleQuantityInputChange = useCallback(
        (index: number, value: number) => {
            // @ts-ignore
            setSelectedProducts((prev) => prev?.map((item, i) => (i === index ? { ...item, quantity: Math.max(0, value) } : item)) ?? [])
        },
        [setSelectedProducts],
    )

    const handleHardRemove = useCallback(
        (index: number) => {
            // @ts-ignore
            setSelectedProducts((prev) => prev?.filter((_, i) => i !== index) ?? null)
        },
        [setSelectedProducts],
    )

    const handleSoftDelete = useCallback(
        (index: number) => {
            // @ts-ignore
            setSelectedProducts((prev) => prev?.map((item, i) => (i === index ? { ...item, isCancelled: true } : item)) ?? null)
        },
        [setSelectedProducts],
    )

    const handleUndoDelete = useCallback(
        (index: number) => {
            // @ts-ignore
            setSelectedProducts((prev) => prev?.map((item, i) => (i === index ? { ...item, isCancelled: false } : item)) ?? null)
        },
        [setSelectedProducts],
    )

    const activeProducts = selectedProducts?.filter((item) => !item.isCancelled) ?? []

    const onUpdateOrder = () => {
        if (!date) {
            TOAST_ERROR('Выберите дату заказа')
            return
        }
        if (!userId) {
            TOAST_ERROR('Вы не выбрали клиента')
            return
        }
        if (activeProducts.some((el) => !el.product || el.product.id === 0)) {
            TOAST_ERROR('Имеются незаполненные товары')
            return
        }
        const cart = activeProducts.reduce<Record<string, number>>((acc, item) => {
            acc[String(item.product.id)] = item.quantity
            return acc
        }, {})

        if (Object.keys(cart).some((key) => key === '0' || key === 'undefined')) {
            TOAST_ERROR('В вашем списке найдены товары, которые не соответствуют товарам из базы данных!')
            return
        }
        if (Object.values(cart).some((value) => value === 0)) {
            TOAST_ERROR('В вашем списке найдены товары, которые имеют нулевое количество!')
            return
        }
        if (Object.keys(cart).length === 0) {
            TOAST_ERROR('Заказ пуст, добавьте товары')
            return
        }

        const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss')
        createOrder({
            date: formattedDate,
            user_id: userId,
            cart,
            status: switchChecked ? 1 : 0,
        })
            .unwrap()
            .then((res) => {
                TOAST_SUCCESS(res.message)
                setTimeout(() => {
                    navigate(`/sales/${res.data.id}`)
                }, 1000)
            })
            .catch(() => TOAST_ERROR('Ошибка при создании заказа'))
    }

    const containerSx = useMemo(
        () => ({
            'width': '100%',
            'maxHeight': '65vh',
            '& .MuiTableCell-head': {
                backgroundColor: 'var(--primary-color)',
                color: '#FFF',
            },
            '& .MuiTableCell-body': {
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
            },
        }),
        [],
    )

    return (
        <>
            <Box
                display='flex'
                mb={2}
                alignItems='center'
                gap={0.5}
                justifyContent='space-between'
            >
                <Box
                    display='flex'
                    alignItems='center'
                    gap={1}
                >
                    <Select
                        size='small'
                        displayEmpty
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder={'Выберите клиента'}
                        sx={{ minWidth: 200 }}
                        defaultValue={''}
                    >
                        <MenuItem value={''}>Выберите клиента</MenuItem>
                        {usersList?.data?.map((user: any) => (
                            <MenuItem
                                key={user.id}
                                value={user.id}
                            >
                                {user.name + ' ' + user.surname}
                            </MenuItem>
                        ))}
                    </Select>
                    <DateTimePicker
                        label='Дата заказа'
                        value={date}
                        onChange={(newValue) => {
                            if (newValue) {
                                // @ts-ignore
                                onChangeDate(newValue)
                            } else {
                                TOAST_ERROR('Выберите дату заказа')
                            }
                        }}
                        // @ts-ignore
                        renderInput={(params) => <TextField {...params} />}
                        views={['year', 'month', 'day', 'hours', 'minutes']}
                        openTo='day'
                        inputFormat='dd.MM.yyyy HH:mm:ss'
                        mask='__.__.____ __:__:__'
                        timeSteps={{ minutes: 1 }}
                        slotProps={{
                            textField: {
                                variant: 'outlined',
                                size: 'medium',
                                InputProps: {
                                    sx: {
                                        'height': 38,
                                        'borderRadius': '0.5rem',
                                        '& .MuiOutlinedInput-notchedOutline': { top: 0 },
                                    },
                                },
                                inputProps: { style: { padding: '8px 14px' } },
                            },
                        }}
                    />
                </Box>
                <Box
                    display='flex'
                    alignItems='center'
                    gap={'0.15rem'}
                >
                    <Box
                        display='flex'
                        alignItems='center'
                        gap={'0.15rem'}
                    >
                        <label
                            htmlFor={'checkbox_work'}
                            style={{ fontSize: '14px', fontWeight: '700', color: switchChecked ? '#33cf4d' : 'grey', cursor: 'pointer' }}
                        >
                            {switchChecked ? 'Рабочий' : 'Отменён'}
                        </label>
                        <IOSSwitch
                            id={'checkbox_work'}
                            onChange={onSwitchChecked}
                            checked={switchChecked}
                        />
                    </Box>
                    {/*<MoreActions id={order.id} />*/}
                </Box>
            </Box>

            <TableContainer
                component={Paper}
                sx={containerSx}
            >
                <Table
                    stickyHeader
                    aria-label='edit-products-table'
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Продукция</TableCell>
                            <TableCell>Кол-во</TableCell>
                            <TableCell>Цена за ед.</TableCell>
                            <TableCell>Сумма</TableCell>
                            <TableCell align='right'>Управление</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedProducts?.map((item, idx) => {
                            const isCancelled = item.isCancelled
                            const qty = item.quantity
                            const unitPrice = item.product?.cash ?? 0
                            const sum = qty * unitPrice

                            return (
                                <TableRow
                                    key={item.rowId}
                                    sx={isCancelled ? { backgroundColor: '#ffe9e9' } : {}}
                                >
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell sx={{ width: 250, position: 'relative' }}>
                                        <Autocomplete
                                            size='small'
                                            options={products}
                                            getOptionLabel={(opt) => opt.title}
                                            inputValue={inputValues[idx] || ''}
                                            onInputChange={(_, text) => handleInputChange(idx, text)}
                                            value={item.product.id === 0 ? null : item.product}
                                            onChange={(_, newVal) => handleProductChange(idx, newVal)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    error={!isCancelled && sum === 0 && unitPrice === 0}
                                                    placeholder='Выберите товар'
                                                />
                                            )}
                                        />
                                        {!isCancelled && sum === 0 && unitPrice === 0 && (
                                            <span
                                                style={{
                                                    color: 'red',
                                                    position: 'absolute',
                                                    bottom: '.35rem',
                                                    fontSize: '10px',
                                                }}
                                            >
                                                Данного товара нет в базе данных
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ position: 'relative' }}>
                                        <TextField
                                            type='number'
                                            size='small'
                                            value={qty}
                                            onChange={(e) => handleQuantityInputChange(idx, Number(e.target.value))}
                                            error={!isCancelled && qty === 0}
                                            inputProps={{ min: 0 }}
                                            sx={{ width: 80 }}
                                        />
                                        {!isCancelled && qty === 0 && (
                                            <span
                                                style={{
                                                    color: 'red',
                                                    position: 'absolute',
                                                    bottom: '.35rem',
                                                    fontSize: '10px',
                                                    left: '1rem',
                                                }}
                                            >
                                                Неверное количество
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>{unitPrice}</TableCell>
                                    <TableCell>{sum}</TableCell>
                                    <TableCell align='right'>
                                        {isCancelled ? (
                                            <Button
                                                size='small'
                                                variant='text'
                                                color='error'
                                                onClick={() => handleUndoDelete(idx)}
                                            >
                                                Отменить
                                            </Button>
                                        ) : (
                                            <RemoveProduct
                                                handleRemoveProduct={() => handleHardRemove(idx)}
                                                handleSoftDelete={() => handleSoftDelete(idx)}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box
                display='flex'
                justifyContent='space-between'
                gap={2}
                mt={2}
            >
                <CreateSubmitLoadingButton
                    loading={isLoading}
                    onClick={onUpdateOrder}
                    desktopLabel='Создать заказ'
                    narrowTooltip='Создать заказ'
                />
                <Button
                    disabled={!selectedProducts?.length}
                    onClick={() => setSelectedProducts([])}
                    variant='contained'
                    color={switchChecked ? 'error' : 'success'}
                    size='medium'
                >
                    Очистить заказ
                </Button>
            </Box>
        </>
    )
}
