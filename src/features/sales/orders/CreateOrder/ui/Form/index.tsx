import { useCreateCustomerOrderMutation, useGetCarListQuery, useGetDiscountListQuery } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ICustomerOrderAction } from '@/shared/api/list/customerOrdersApi/types.ts'
import styles from './Form.module.css'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextareaAutosize, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export const Form = ({ onClose }: { onClose: () => void }) => {
    const [createOrder, { isLoading }] = useCreateCustomerOrderMutation()
    const { data: discountCards } = useGetDiscountListQuery()
    const { data: cars } = useGetCarListQuery()
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()
    const { control, handleSubmit } = useForm<ICustomerOrderAction>()

    const onSubmit: SubmitHandler<ICustomerOrderAction> = (data) => {
        createOrder(data)
            .unwrap()
            .then(() => TOAST_SUCCESS('Заказ успешно добавлен'))
            .catch((err) => {
                console.log(err)
                TOAST_ERROR(`Ошибка при добавлении заказа! ${err?.data?.message}`)
            })
            .finally(() => onClose())
    }

    return (
        <form
            className={styles.Form}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Controller
                control={control}
                render={({ field }) => (
                    <TextField
                        required
                        size={'small'}
                        fullWidth
                        label={'Контрагент'}
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                    />
                )}
                name={'name'}
            />
            <Controller
                control={control}
                render={({ field }) => (
                    <TextField
                        required
                        size={'small'}
                        fullWidth
                        label={'Телефон'}
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                    />
                )}
                name={'phone'}
            />
            <Controller
                control={control}
                render={({ field }) => (
                    <FormControl fullWidth>
                        <InputLabel
                            size={'small'}
                            id='demo-simple-select-label'
                        >
                            Дисконтная карта
                        </InputLabel>
                        <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            label='Дисконтная карта'
                            size={'small'}
                            onChange={(e) => field.onChange(e)}
                        >
                            {discountCards?.data?.map((item) => (
                                <MenuItem
                                    key={item.id}
                                    value={String(item.id)}
                                >
                                    {item.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                name={'discount_card'}
            />
            <Controller
                control={control}
                render={({ field }) => (
                    <FormControl fullWidth>
                        <InputLabel
                            size={'small'}
                            id='demo-simple-select-label'
                        >
                            Автомобиль
                        </InputLabel>
                        <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            label='Дисконтная карта'
                            size={'small'}
                            onChange={(e) => field.onChange(e)}
                        >
                            {cars?.data?.map((item) => (
                                <MenuItem
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.brand} ({item.model})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                name={'car_id'}
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
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                    />
                )}
                name={'sum'}
            />
            <Controller
                control={control}
                render={({ field }) => (
                    <FormControl fullWidth>
                        <InputLabel
                            size={'small'}
                            id='demo-simple-select-label'
                        >
                            Статус
                        </InputLabel>
                        <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            label='Статус'
                            placeholder={'Выберите'}
                            size={'small'}
                            defaultValue={'order'}
                            onChange={(e) => field.onChange(e)}
                        >
                            <MenuItem
                                selected
                                value={'Заявка'}
                            >
                                Заявка
                            </MenuItem>
                            <MenuItem
                                sx={{ color: 'orange' }}
                                value={'В работе'}
                            >
                                В работе
                            </MenuItem>
                            <MenuItem
                                sx={{ color: 'green' }}
                                value={'Выполнен'}
                            >
                                Выполнен
                            </MenuItem>
                            <MenuItem
                                sx={{ color: 'red' }}
                                value={'Отменён'}
                            >
                                Отменён
                            </MenuItem>
                        </Select>
                    </FormControl>
                )}
                name={'status'}
            />
            <Controller
                control={control}
                render={({ field }) => (
                    <TextareaAutosize
                        minRows={2}
                        value={field.value}
                        placeholder={'Оставьте комментарий'}
                        onChange={(e) => field.onChange(e)}
                        style={{ borderRadius: '0.5rem', padding: '1rem', width: '100%', resize: 'none' }}
                    />
                )}
                name={'description'}
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
                    Добавить
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
        </form>
    )
}
