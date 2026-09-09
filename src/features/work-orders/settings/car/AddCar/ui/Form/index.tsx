import styles from './Form.module.css'
import { TextField } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ICarAction } from '@/shared/api/list/carApi/types.ts'
import { useCreateCarMutation } from '@/shared/api'
import { LoadingButton } from '@mui/lab'
import { useToast } from '@/shared/lib/hooks/toast'

export const Form = ({ onHide }: { onHide: () => void }) => {
    const [createCar, { isLoading }] = useCreateCarMutation()
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()
    const { handleSubmit, control } = useForm<ICarAction>({
        defaultValues: {
            brand: '',
            model: '',
        },
    })
    const onSubmit: SubmitHandler<ICarAction> = async (data) => {
        createCar(data)
            .unwrap()
            .then(() => TOAST_SUCCESS('Автомобиль успешно добавлен'))
            .catch((err) => {
                console.log(err)
                TOAST_ERROR(`Ошибка при добавлении автомобиля! ${err?.data?.message}`)
            })
            .finally(() => onHide())
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
                        value={field.value}
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
                        value={field.value}
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
                Добавить
            </LoadingButton>
        </form>
    )
}
