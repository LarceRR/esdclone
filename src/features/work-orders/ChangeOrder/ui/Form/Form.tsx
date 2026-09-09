import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import styles from './Form.module.css'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { useGetAllBoxesQuery, useGetWorkOrderMutation, useUpdateWorkOrderMutation } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { LoadingButton } from '@mui/lab'
import { IDataWorkOrderApi } from '@/shared/api/list/workOrdersApi/types/workOrders.ts'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { useAppSelector } from '@/shared/store'
import { getClickEvent } from '@/widgets/CalendarModule/model/selectors'
import { IWorkOrderUpdate } from '@/shared/api/types'

interface IForm {
    onClose: () => void
    orderId?: number
}

const initialData: IWorkOrderUpdate = {
    id: 0,
    date_start_work: '',
    date_end_work: '',
    counterparty: '',
    cars: '',
    sum: 0,
    payed: 0,
    status: '',
    comments: '',
    box_id: 1,
}

export const Form: React.FC<IForm> = ({ onClose, orderId }) => {
    const selectedOrderId = Number(useAppSelector(getClickEvent)?.event.id) || orderId
    if (!selectedOrderId) {
        onClose()
        return
    }

    // queries
    const [updateOrder, { isLoading }] = useUpdateWorkOrderMutation()
    const [getOrder] = useGetWorkOrderMutation()
    const { data: boxList } = useGetAllBoxesQuery()

    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const { handleSubmit, control } = useForm<IDataWorkOrderApi>({
        // @ts-ignore
        defaultValues: async () => {
            return await getOrder(selectedOrderId)
                .unwrap()
                .then((res) => {
                    return {
                        id: res.data['0'].id,
                        date_start_work: res.data['0'].date_start_work,
                        date_end_work: res.data['0'].date_end_work || res.data['0'].date_start_work,
                        counterparty: res.data['0'].counterparty,
                        cars: res.data['0'].cars,
                        sum: res.data['0'].sum,
                        payed: res.data['0'].payed,
                        status: res.data['0'].status,
                        comments: res.data['0'].comments,
                        box_id: res.data['0'].box_id,
                    }
                })
                .catch((error) => {
                    console.error(error)
                    TOAST_ERROR('Ошибка получения информации о заказ-наряде')
                    return initialData
                })
        },
    })

    const onSubmit: SubmitHandler<IDataWorkOrderApi> = (data) => {
        updateOrder(data)
            .unwrap()
            .then((res) => {
                if (res) {
                    TOAST_SUCCESS('Заказ-наряд успешно изменен')
                }
            })
            .catch((err) => {
                console.log(err)
                TOAST_ERROR('Ошибка при изменении заказ-наряда')
            })
            .finally(() => onClose())
    }

    return (
        <form
            // @ts-ignore
            onSubmit={handleSubmit(onSubmit)}
            className={styles.Form}
        >
            {/*<h3>Редактирование заказ-наряда</h3>*/}
            <Box
                display={'flex'}
                flexDirection={'column'}
                gap={'0.5rem'}
            >
                <Box
                    width={'100%'}
                    display={'flex'}
                    gap={'0.5rem'}
                >
                    <Controller
                        control={control}
                        render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer
                                    sx={{ width: '100%' }}
                                    components={['DateTimePicker']}
                                >
                                    <DateTimePicker
                                        ampm={false}
                                        format={'DD.MM.YYYY HH:mm'}
                                        value={dayjs(field.value).locale('ru') || ''}
                                        label='Выберите дату начала'
                                        slotProps={{ textField: { size: 'small', fullWidth: true, required: true } }}
                                        onChange={(e) => field.onChange(e)}
                                        // @ts-ignore
                                        onAccept={(e) => field.onChange(e?.toDate())}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        )}
                        name={'date_start_work'}
                    />
                    <Controller
                        control={control}
                        render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer
                                    sx={{ width: '100%' }}
                                    components={['DateTimePicker']}
                                >
                                    <DateTimePicker
                                        ampm={false}
                                        format={'DD.MM.YYYY HH:mm'}
                                        value={dayjs(field.value).locale('ru') || ''}
                                        label='Выберите дату конца'
                                        slotProps={{ textField: { size: 'small', fullWidth: true, required: true } }}
                                        onChange={(e) => field.onChange(e)}
                                        // @ts-ignore
                                        onAccept={(e) => field.onChange(e?.toDate())}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        )}
                        name={'date_end_work'}
                    />
                </Box>
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            value={field.value || ''}
                            fullWidth
                            label={'Контрагент'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'counterparty'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            value={field.value || ''}
                            label={'Автомобиль'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'cars'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            value={field.value || ''}
                            label={'Сумма'}
                            type={'number'}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    )}
                    name={'sum'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            value={field.value || ''}
                            label={'Заплатил'}
                            type={'number'}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    )}
                    name={'payed'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            value={field.value || ''}
                            label={'Статус'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'status'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputLabel
                                size={'small'}
                                id='demo-simple-select-label'
                            >
                                {boxList?.data?.find((value) => value.id === field.value)?.name}
                            </InputLabel>
                            <Select
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                label='Бокс'
                                name={''}
                                size={'small'}
                                onSelect={(e) => field.onChange(e)}
                            >
                                {boxList?.data?.map((item) => (
                                    <MenuItem
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    name={'box_id'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            value={field.value || ''}
                            label={'Комментарий'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'comments'}
                />
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    gap={'1rem'}
                    marginTop={'0.5rem'}
                >
                    <LoadingButton
                        loading={isLoading}
                        size={'medium'}
                        type={'submit'}
                        variant={'contained'}
                    >
                        Изменить
                    </LoadingButton>
                    <Button
                        size={'medium'}
                        onClick={onClose}
                        color={'error'}
                        variant={'outlined'}
                    >
                        Отменить
                    </Button>
                </Box>
            </Box>
        </form>
    )
}
