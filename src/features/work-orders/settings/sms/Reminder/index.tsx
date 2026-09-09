import styles from './Reminder.module.css'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Box, Checkbox, FormControlLabel, TextareaAutosize } from '@mui/material'
import { ISMS } from '@/shared/api/list/smsApi/types.ts'
import { useUpdateSMSMutation } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { LoadingButton } from '@mui/lab'

export const Reminder = ({ options }: { options: ISMS }) => {
    const [updateSMS, { isLoading }] = useUpdateSMSMutation()
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()

    const { control, handleSubmit } = useForm<ISMS>({
        defaultValues: {
            ...options,
        },
    })

    const onSubmit: SubmitHandler<ISMS> = (data) => {
        updateSMS(data)
            .unwrap()
            .then(() => TOAST_SUCCESS('Напоминания обновлены'))
            .catch((err) => {
                console.error(err)
                TOAST_ERROR('Ошибка при сохранении изменений в напоминаниях')
            })
    }

    return (
        <div className={styles.Reminder}>
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
                            placeholder={'Напоминание о визите'}
                        />
                    )}
                    name={'message'}
                />
                <Box>
                    <p>Выберите за какое время до визита выслать напоминание</p>
                    <Box
                        display={'flex'}
                        alignItems={'center'}
                        gap={'1rem'}
                    >
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
                                    label={'1 день'}
                                />
                            )}
                            name={'1d'}
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
                                    label={'1 день'}
                                />
                            )}
                            name={'2d'}
                        />
                    </Box>
                </Box>
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
                            label={'По умолчанию включать в заказ-наряде'}
                        />
                    )}
                    name={'in_order'}
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
