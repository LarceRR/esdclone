import styles from './RequiredFields.module.css'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import ArrowRightIcon from '@public/icons/arrow-right.svg'
import ArrowDownIcon from '@public/icons/arrow-down.svg'
import { useState } from 'react'
const data = {
    workOrder: [
        {
            id: 1,
            type: 1,
            title: 'Имя',
            active: false,
            changed: true,
        },
        {
            id: 2,
            type: 1,
            title: 'Телефон',
            active: false,
            changed: false,
        },
        {
            id: 3,
            type: 1,
            title: 'Дисконтная карта',
            active: false,
            changed: true,
        },
        {
            id: 4,
            type: 1,
            title: 'Реклама',
            active: false,
            changed: true,
        },
        {
            id: 5,
            type: 1,
            title: 'Марка и модель',
            active: false,
            changed: true,
        },
        {
            id: 6,
            type: 1,
            title: 'Год',
            active: false,
            changed: true,
        },
        {
            id: 7,
            type: 1,
            title: 'Номер',
            active: false,
            changed: true,
        },
    ],
    customerOrder: [
        {
            id: 1,
            type: 1,
            title: 'Имя',
            active: false,
            changed: true,
        },
        {
            id: 2,
            type: 1,
            title: 'Телефон',
            active: false,
            changed: false,
        },
        {
            id: 3,
            type: 1,
            title: 'Дисконтная карта',
            active: false,
            changed: true,
        },
        {
            id: 4,
            type: 1,
            title: 'Реклама',
            active: false,
            changed: true,
        },
        {
            id: 5,
            type: 1,
            title: 'Марка и модель',
            active: false,
            changed: true,
        },
        {
            id: 6,
            type: 1,
            title: 'Год',
            active: false,
            changed: true,
        },
        {
            id: 7,
            type: 1,
            title: 'Номер',
            active: false,
            changed: true,
        },
    ],
}

interface IForm {
    workOrder: IRequiredFields[]
    customerOrder: IRequiredFields[]
}
interface IRequiredFields {
    id: number
    type: number
    title: string
    active: boolean
    changed: boolean
}

export const RequiredFields = () => {
    const [workOrdersVisible, setWorkOrdersVisible] = useState<boolean>(false)
    const [customersOrderVisible, setCustomersOrderVisible] = useState<boolean>(false)

    const { control, handleSubmit } = useForm<IForm>({
        defaultValues: {
            workOrder: data.workOrder,
            customerOrder: data.customerOrder,
        },
    })

    const onSubmit: SubmitHandler<IForm> = (data) => console.log(data)

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.RequiredFields}
        >
            <TableContainer>
                <Table
                    stickyHeader
                    size='small'
                    aria-label='sticky table'
                >
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    background: 'var(--primary-color)',
                                    py: 0.75,
                                    px: 1,
                                }}
                                width={'35%'}
                            >
                                <span className={styles.label}>Документ</span>
                            </TableCell>
                            <TableCell
                                sx={{
                                    background: 'var(--primary-color)',
                                    py: 0.75,
                                    px: 1,
                                }}
                                width={'65%'}
                            >
                                <span className={styles.label}>Обязательное поле</span>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow
                            onClick={() => setWorkOrdersVisible(!workOrdersVisible)}
                            className={styles.buttonCollapse}
                        >
                            <TableCell>
                                <IconButton
                                    aria-label='expand row'
                                    size='medium'
                                >
                                    {!workOrdersVisible ? <ArrowRightIcon /> : <ArrowDownIcon />}
                                </IconButton>
                                <span className={styles.title}>Заказ-наряд</span>
                            </TableCell>
                            <TableCell />
                        </TableRow>

                        {data.workOrder.map((order, index) => (
                            <TableRow
                                key={index}
                                sx={{ visibility: workOrdersVisible ? 'visible' : 'collapse' }}
                                className={styles.row}
                            >
                                <TableCell width={'25%'}>
                                    <span className={styles.label}>{order.title}</span>
                                </TableCell>
                                <TableCell>
                                    <Controller
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                disabled={!order.changed}
                                                size={'small'}
                                                onChange={(e) => {
                                                    if (order.changed) {
                                                        const filteredFieldValue = field.value.filter((value) => value.id !== order.id)
                                                        field.onChange([...filteredFieldValue, { ...order, ['active']: e.currentTarget.checked }])
                                                    }
                                                }}
                                            />
                                        )}
                                        name={'workOrder'}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}

                        <TableRow
                            onClick={() => setCustomersOrderVisible(!customersOrderVisible)}
                            className={styles.buttonCollapse}
                        >
                            <TableCell>
                                <IconButton
                                    aria-label='expand row'
                                    size='medium'
                                    // onClick={() => setOpen(!open)}
                                >
                                    {!customersOrderVisible ? <ArrowRightIcon /> : <ArrowDownIcon />}
                                </IconButton>
                                <span className={styles.title}>Заказ-клиента</span>
                            </TableCell>
                            <TableCell />
                        </TableRow>

                        {data.customerOrder.map((order, index) => (
                            <TableRow
                                key={index}
                                sx={{ visibility: customersOrderVisible ? 'visible' : 'collapse' }}
                                className={styles.row}
                            >
                                <TableCell width={'25%'}>
                                    <span className={styles.label}>{order.title}</span>
                                </TableCell>
                                <TableCell>
                                    <Controller
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                disabled={!order.changed}
                                                size={'small'}
                                                onChange={(e) => {
                                                    if (order.changed) {
                                                        const filteredFieldValue = field.value.filter((value) => value.id !== order.id)
                                                        field.onChange([...filteredFieldValue, { ...order, ['active']: e.currentTarget.checked }])
                                                    }
                                                }}
                                            />
                                        )}
                                        name={'customerOrder'}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                type={'submit'}
                variant={'contained'}
                size={'medium'}
                sx={{ maxWidth: '15%' }}
            >
                Сохранить
            </Button>
        </form>
    )
}
