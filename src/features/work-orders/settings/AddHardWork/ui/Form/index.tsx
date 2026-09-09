import styles from './Form.module.css'
import { Button, TextField } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

interface IHardWork {
    name: string
    position: string
}

export const Form = () => {
    const { handleSubmit, control } = useForm<IHardWork>({
        defaultValues: {
            name: '',
            position: '',
        },
    })
    const onSubmit: SubmitHandler<IHardWork> = (data) => console.log(data)
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
                        label={'Название'}
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
                        label={'Позиция'}
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                    />
                )}
                name={'position'}
            />
            <Button
                type={'submit'}
                variant={'contained'}
                size={'medium'}
            >
                Добавить
            </Button>
        </form>
    )
}
