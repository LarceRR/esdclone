import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import styles from './Form.module.css'
import CloseIcon from '@public/icons/close-icon.svg'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'

interface IArticle {
    name: string
    category: string
}

export const Form = ({ onHide }: { onHide: () => void }) => {
    const { handleSubmit, control } = useForm<IArticle>({
        defaultValues: {
            name: '',
            category: '',
        },
    })
    const onSubmit: SubmitHandler<IArticle> = (data) => console.log(data)
    return (
        <div className={styles.Form}>
            <header className={styles.header}>
                <h4>Добавить статью</h4>
                <button onClick={onHide}>
                    <CloseIcon />
                </button>
            </header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputLabel
                                size={'small'}
                                id='demo-simple-select-label'
                            >
                                Категория
                            </InputLabel>
                            <Select
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                label='Категория'
                                size={'small'}
                                onChange={(e) => field.onChange(e)}
                            >
                                <MenuItem value={'name'}>Наименование</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                    name={'category'}
                />
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
