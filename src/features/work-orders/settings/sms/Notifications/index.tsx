import styles from './Notifications.module.css'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Checkbox, FormControlLabel, TextareaAutosize } from '@mui/material'
import { ISMS } from '@/shared/api/list/smsApi/types.ts'
import { LoadingButton } from '@mui/lab'
import { useToast } from '@/shared/lib/hooks/toast'
import { useUpdateSMSMutation } from '@/shared/api'

export const Notifications = ({ options }: { options: ISMS }) => {
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
            .then(() => TOAST_SUCCESS('Уведомления обновлены'))
            .catch((err) => {
                console.error(err)
                TOAST_ERROR('Ошибка при сохранении изменений в уведомлениях')
            })
    }

    return (
        <div className={styles.Notifications}>
            <form
                className={styles.form}
                onSubmit={handleSubmit(onSubmit)}
            >
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextareaAutosize
                            style={{ padding: '1rem', width: '100%' }}
                            minRows={6}
                            onChange={(e) => field.onChange(e)}
                            value={field.value}
                            placeholder={'Уведомление о создании заказ-наряда. Клиенту отправляется СМС при создании заказ-наряда.'}
                        />
                    )}
                    name={'message'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                />
                            }
                            label={'Уведомлять'}
                        />
                    )}
                    name={'on'}
                />
                <LoadingButton
                    loading={isLoading}
                    type={'submit'}
                    variant={'contained'}
                    size={'medium'}
                    sx={{ maxWidth: '15%' }}
                >
                    Сохранить
                </LoadingButton>
            </form>
            <section className={styles.info}>
                <p>– Стоимость одного SMS – 6 руб.</p>
                <p>– Одно SMS вмещает 70 символов. SMS длиной более 70 символов разбивается на несколько частей.</p>
            </section>
        </div>
    )
}
