import styles from './Form.module.css'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { IDiscountAction } from '@/shared/api/list/discountApi/types.ts'
import { useCreateDiscountMutation } from '@/shared/api'
import { LoadingButton } from '@mui/lab'
import { useToast } from '@/shared/lib/hooks/toast'

export const Form = ({ onHide }: { onHide: () => void }) => {
    const { control, handleSubmit } = useForm<IDiscountAction>({
        defaultValues: {
            title: '',
            type: '',
            discount_work: '5',
            discount_product: '10',
        },
    })
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()

    const [onCreate, { isLoading }] = useCreateDiscountMutation()

    const onSubmit: SubmitHandler<IDiscountAction> = (data) => {
        onCreate(data)
            .unwrap()
            .then(() => TOAST_SUCCESS('Карта успешно добавлена'))
            .catch((err) => {
                console.log(err)
                TOAST_ERROR(`Ошибка при добавлении карты! ${err?.data?.message}`)
            })
            .finally(() => onHide())
    }

    return (
        <form
            className={styles.Form}
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
                            value={field.value}
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
                            value={field.value}
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
                            value={field.value}
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
                Добавить
            </LoadingButton>
        </form>
    )
}
