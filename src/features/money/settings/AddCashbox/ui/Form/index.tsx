import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import styles from '@/features/work-orders/settings/AddAd/ui/Form/Form.module.css'
import CloseIcon from '@public/icons/close-icon.svg'
import { Button, TextField } from '@mui/material'

interface ICashbox {
    name: string
    balance: string
}

export const Form = ({ onHide }: { onHide: () => void }) => {
    const { handleSubmit, control } = useForm<ICashbox>({
        defaultValues: {
            name: '',
            balance: '',
        },
    })
    const onSubmit: SubmitHandler<ICashbox> = (data) => console.log(data)
    return (
        <div className={styles.Form}>
            <header className={styles.header}>
                <h4>Добавить кассу</h4>
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
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            label={'Остаток'}
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'balance'}
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
