import styles from './index.module.css'
import { useLazyGetBoxQuery, useUpdateBoxMutation } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { IBoxUpdate } from '@/shared/api/types'
import { Box, Button, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export const Form = ({ id, onClose }: { id: number; onClose: () => void }) => {
    const [getBox] = useLazyGetBoxQuery()
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()

    const [updateBox, { isLoading }] = useUpdateBoxMutation()

    const { control, handleSubmit } = useForm<IBoxUpdate>({
        defaultValues: async () => {
            return await getBox(id)
                .unwrap()
                .then((res) => res.data)
                .catch((err) => {
                    console.log(err)
                    return {
                        id,
                        name: '',
                        position: 1,
                    }
                })
        },
    })

    const onSubmit: SubmitHandler<IBoxUpdate> = (data) => {
        updateBox(data)
            .unwrap()
            .then(() => TOAST_SUCCESS('Успешное обновление бокса'))
            .catch((err) => {
                console.log(err)
                TOAST_ERROR(`Ошибка при изменении бокса. ${err?.data?.message}`)
            })
            .finally(() => onClose())
    }
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.Form}
        >
            <Box
                display={'flex'}
                flexDirection={'column'}
                gap={'0.5rem'}
            >
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            label={'Наименование'}
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
                            type={'number'}
                            label={'Позиция'}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'position'}
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
