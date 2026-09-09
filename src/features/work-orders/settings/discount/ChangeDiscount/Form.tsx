import styles from './index.module.css'
import { useGetDiscountMutation, useUpdateDiscountMutation } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { IDiscount } from '@/shared/api/list/discountApi/types.ts'
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export const Form = ({ id, onClose }: { id: number; onClose: () => void }) => {
    const [getDiscount] = useGetDiscountMutation()
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()

    const [updateDiscount, { isLoading }] = useUpdateDiscountMutation()

    const { control, handleSubmit } = useForm<IDiscount>({
        // @ts-ignore
        defaultValues: async () => {
            return await getDiscount(id)
                .unwrap()
                .then((res) => {
                    console.log(res)
                    return res.data as IDiscount
                })
                .catch((err) => {
                    console.log(err)
                    return {
                        title: '',
                        type: '',
                        discount_work: '5',
                        discount_product: '10',
                        created_at: '',
                        updated_at: '',
                    }
                })
        },
    })
    const onSubmit: SubmitHandler<IDiscount> = (data) => {
        updateDiscount(data)
            .unwrap()
            .then(() => TOAST_SUCCESS('Успешное обновление дисконтной карты'))
            .catch((err) => {
                console.log(err)
                TOAST_ERROR(`Ошибка при изменении карты. ${err?.data?.message}`)
            })
            .finally(() => onClose())
    }
    return (
        <form
            className={styles.Form}
            // @ts-ignore
            onSubmit={handleSubmit(onSubmit)}
        >
            <Box
                display={'flex'}
                gap={'0.5rem'}
                alignItems={'flex-start'}
            >
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            label={'Название'}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'title'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputLabel
                                size={'small'}
                                id='demo-simple-select-label'
                            >
                                Тип карты
                            </InputLabel>
                            <Select
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                label='Тип карты'
                                size={'small'}
                                onChange={(e) => field.onChange(e)}
                            >
                                <MenuItem value={'Фиксированная'}>{'Фиксированная'}</MenuItem>
                                <MenuItem value={'Накопительная'}>{'Накопительная'}</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                    name={'type'}
                />
            </Box>
            <Box
                display={'flex'}
                gap={'0.5rem'}
                alignItems={'flex-start'}
            >
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            label={'Скидка на работы (%)'}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'discount_work'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            label={'Скидка на товары (%)'}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'discount_product'}
                />
            </Box>
            <LoadingButton
                loading={isLoading}
                type={'submit'}
                variant={'contained'}
                size={'medium'}
            >
                Изменить
            </LoadingButton>
        </form>
    )
}
