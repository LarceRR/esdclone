import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import styles from './Form.module.css'
import CloseIcon from '@public/icons/close-icon.svg'
import { Button, TextField } from '@mui/material'

interface ICategory {
    name: string
}

export const Form = ({ onHide }: { onHide: () => void }) => {
    const { handleSubmit, control } = useForm<ICategory>({
        defaultValues: {
            name: '',
        },
    })
    const onSubmit: SubmitHandler<ICategory> = (data) => console.log(data)
    return (
        <div className={styles.Form}>
            <header className={styles.header}>
                <h4>Добавить категорию</h4>
                <button onClick={onHide}>
                    <CloseIcon />
                </button>
            </header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            label={'Наименование'}
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'name'}
                />
                <Button
                    type={'submit'}
                    variant={'contained'}
                    size={'medium'}
                >
                    Добавить
                </Button>
            </form>
        </div>
    )
}
