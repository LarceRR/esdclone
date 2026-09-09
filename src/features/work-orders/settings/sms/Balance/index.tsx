import styles from './Balance.module.css'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { TextField } from '@mui/material'
import { ISMS } from '@/shared/api/list/smsApi/types.ts'
import { useToast } from '@/shared/lib/hooks/toast'
import { useUpdateSMSMutation } from '@/shared/api'
import { LoadingButton } from '@mui/lab'

export const Balance = ({ options }: { options: ISMS }) => {
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()
    const [updateSMS, { isLoading }] = useUpdateSMSMutation()

    const { control, handleSubmit } = useForm<ISMS>({
        defaultValues: {
            ...options,
        },
    })

    const onSubmit: SubmitHandler<ISMS> = (data) => {
        updateSMS(data)
            .unwrap()
            .then(() => TOAST_SUCCESS('Баланс пополнен'))
            .catch((err) => {
                console.error(err)
                TOAST_ERROR('Ошибка при пополнении баланса')
            })
    }

    return (
        <div className={styles.Balance}>
            <form
                className={styles.form}
                onSubmit={handleSubmit(onSubmit)}
            >
                <h5>Баланс: ₽ / 0 SMS</h5>
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            size={'medium'}
                            fullWidth
                            onChange={(e) => field.onChange(e)}
                            value={field.value || ''}
                            label={'Пополнить баланс на сумму, ₽'}
                        />
                    )}
                    name={'message'}
                />
                <LoadingButton
                    loading={isLoading}
                    type={'submit'}
                    variant={'contained'}
                    size={'medium'}
                    sx={{ maxWidth: '15%' }}
                >
                    Пополнить
                </LoadingButton>
            </form>
            <section className={styles.info}>
                <p style={{ marginBottom: '2rem' }}>Оплачивая, Вы подтверждаете своё согласие с договором-офертой.</p>
                <p>– Стоимость одного SMS – 6 руб.</p>
                <p>– Одно SMS вмещает 70 символов. SMS длиной более 70 символов разбивается на несколько частей.</p>
            </section>
        </div>
    )
}
