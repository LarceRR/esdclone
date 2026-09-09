import styles from './Form.module.css'
import { Button, TextField } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

interface IAd {
    name: string
    desc: string
}

export const Form = () => {
    const { handleSubmit, control } = useForm<IAd>({
        defaultValues: {
            name: '',
            desc: '',
        },
    })
    const onSubmit: SubmitHandler<IAd> = (data) => console.log(data)
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
                        size={'medium'}
                        fullWidth
                        label={'Описание'}
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                    />
                )}
                name={'desc'}
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
