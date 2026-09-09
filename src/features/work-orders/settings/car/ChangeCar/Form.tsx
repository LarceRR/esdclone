import { useGetCarMutation, useUpdateCarMutation } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ICar } from '@/shared/api/list/carApi/types.ts'
import styles from './index.module.css'
import { TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'

const initialData = {
    model: '',
    brand: '',
}

export const Form = ({ id, onClose }: { id: number; onClose: () => void }) => {
    const [getCar] = useGetCarMutation()
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()

    const [updateCar, { isLoading }] = useUpdateCarMutation()

    const { control, handleSubmit } = useForm<ICar>({
        defaultValues: async () => {
            return await getCar(id)
                .unwrap()
                .then((res) => ({ id, model: res.data.model, brand: res.data.brand }) as ICar)
                .catch((err) => {
                    console.log(err)
                    return {
                        id,
                        ...initialData,
                    }
                })
        },
    })

    const onSubmit: SubmitHandler<ICar> = (data) => {
        updateCar(data)
            .unwrap()
            .then(() => TOAST_SUCCESS('Успешное обновление автомобиля'))
            .catch((err) => {
                console.log(err)
                TOAST_ERROR(`Ошибка при изменении автомобиля. ${err?.data?.message}`)
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
                        label={'Марка'}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e)}
                    />
                )}
                name={'brand'}
            />
            <Controller
                control={control}
                render={({ field }) => (
                    <TextField
                        required
                        size={'small'}
                        fullWidth
                        label={'Модель'}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e)}
                    />
                )}
                name={'model'}
            />

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
