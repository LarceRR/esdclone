import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import styles from './Form.module.css'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { useCreateWorkOrderMutation, useGetAllBoxesQuery } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { LoadingButton } from '@mui/lab'
import { IWorkOrderCreate } from '@/shared/api/types'
import { useAppSelector } from '@/shared/store'
import { getSelectEvent } from '@/widgets/CalendarModule/model/selectors'
import dayjs from 'dayjs'

interface IForm {
    onClose: () => void
}

export const Form: React.FC<IForm> = ({ onClose }) => {
    const [createOrder, { isLoading }] = useCreateWorkOrderMutation()
    const selectedRangeEvent = useAppSelector(getSelectEvent)
    const { data: boxList } = useGetAllBoxesQuery()
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const { handleSubmit, control } = useForm<IWorkOrderCreate>({
        defaultValues: {
            date_start_work: selectedRangeEvent?.start || new Date(),
            date_end_work: selectedRangeEvent?.end || new Date(),
            counterparty: '',
            cars: '',
            sum: 0,
            payed: 0,
            status: '',
            comments: '',
            box_id: Number(selectedRangeEvent?.resource?.id) || 0,
        },
    })

    const onSubmit: SubmitHandler<IWorkOrderCreate> = (data) => {
        createOrder(data)
            .unwrap()
            .then((res) => {
                if (res) {
                    TOAST_SUCCESS('Заказ наряд успешно добавлен')
                }
            })
            .catch((err) => {
                console.log(err)
                TOAST_ERROR('Ошибка при добавлении заказа наряда')
            })
            .finally(() => onClose())
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.Form}
        >
            <h3>Создание нового заказ-наряда</h3>
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
                                        label='Выберите дату начала'
                                        value={dayjs(field.value).locale('ru')}
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
                                        sx={{ width: 'auto' }}
                                        ampm={false}
                                        format={'DD.MM.YYYY HH:mm'}
                                        label='Выберите дату конца'
                                        value={dayjs(field.value).locale('ru')}
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
                                {selectedRangeEvent?.resource?.title ? selectedRangeEvent?.resource?.title : 'Бокс'}
                            </InputLabel>
                            <Select
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                label='Бокс'
                                size={'small'}
                                disabled={!!selectedRangeEvent?.resource?.title}
                                onChange={(e) => field.onChange(e)}
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
                        Создать
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
