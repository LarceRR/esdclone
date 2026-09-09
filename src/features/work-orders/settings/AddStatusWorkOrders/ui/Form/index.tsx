import styles from './Form.module.css'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

interface IStatusWorkOrders {
    status: string
    name: string
    position: string
}

export const Form = () => {
    const { handleSubmit, control } = useForm<IStatusWorkOrders>({
        defaultValues: {
            status: '',
            name: '',
            position: '',
        },
    })
    const onSubmit: SubmitHandler<IStatusWorkOrders> = (data) => console.log(data)
    return (
        <form
            className={styles.Form}
            onSubmit={handleSubmit(onSubmit)}
        >
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
                            size={'small'}
                            defaultValue={'order'}
                            onChange={(e) => field.onChange(e)}
                        >
                            <MenuItem
                                selected
                                value={'order'}
                            >
                                Заявка
                            </MenuItem>
                            <MenuItem
                                sx={{ color: 'orange' }}
                                value={'inWork'}
                            >
                                В работе
                            </MenuItem>
                            <MenuItem
                                sx={{ color: 'green' }}
                                value={'success'}
                            >
                                Выполнен
                            </MenuItem>
                            <MenuItem
                                sx={{ color: 'red' }}
                                value={'cancel'}
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
