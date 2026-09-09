import { useToast } from '@/shared/lib/hooks/toast'
import { useGetCarListQuery, useGetCustomerOrderMutation, useGetDiscountListQuery, useUpdateCustomerOrderMutation } from '@/shared/api'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ICustomerOrder, ICustomerOrderAction } from '@/shared/api/list/customerOrdersApi/types.ts'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextareaAutosize, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import styles from './index.module.css'

export const Form = ({ id, onCloseModal }: { id: number; onCloseModal: () => void }) => {
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()

    const [getOrder] = useGetCustomerOrderMutation()
    const { data: discountCards } = useGetDiscountListQuery()
    const { data: cars } = useGetCarListQuery()
    const [updateOrder, { isLoading }] = useUpdateCustomerOrderMutation()

    const { control, handleSubmit } = useForm<ICustomerOrder>({
        defaultValues: async () => {
            return await getOrder(id)
                .unwrap()
                .then((res) => ({ ...res.data[0] }))
                .catch((err) => {
                    console.log(err)
                    return {
                        id: '',
                        created_at: '',
                        update_at: '',
                        name: '',
                        phone: '',
                        discount_card: '',
                        car_id: '',
                        description: '',
                        sum: '',
                        status: '',
                    }
                })
        },
    })

    const onSubmit: SubmitHandler<ICustomerOrderAction> = (data) => {
        const replacedData = {
            id,
            name: data.name,
            phone: data.phone,
            discount_card: data.discount_card,
            // @ts-ignore
            car_id: data.car.car_id,
            description: data.description,
            sum: data.sum,
            status: data.status,
        }
        updateOrder(replacedData)
            .unwrap()
            .then(() => TOAST_SUCCESS('Заказ успешно обновлен'))
            .catch((err) => {
                console.log(err)
                TOAST_ERROR(`Ошибка при обновлении заказа! ${err?.data?.message}`)
            })
            .finally(() => onCloseModal())
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
                        value={field.value || ''}
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
                        value={field.value || ''}
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
                            {discountCards?.data?.find((card) => card.id === Number(field.value))?.title || 'Дисконтная карта'}
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
                            {/*@ts-ignore*/}
                            {cars?.data?.find((car) => car.car_id === field.value)?.brand || 'Автомобиль'}
                        </InputLabel>
                        <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            label='Автомобиль'
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
                        value={field.value || ''}
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
                            defaultValue={'Заявка'}
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
                        value={field.value || ''}
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
                    Изменить
                </LoadingButton>
                <Button
                    size={'medium'}
                    onClick={onCloseModal}
                    color={'error'}
                    variant={'outlined'}
                >
                    Отменить
                </Button>
            </Box>
        </form>
    )
}
