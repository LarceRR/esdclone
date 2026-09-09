import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import styles from './Recommendations.module.css'
import { Box, Checkbox, FormControlLabel, TextareaAutosize } from '@mui/material'
import { ISMS } from '@/shared/api/list/smsApi/types.ts'
import { useToast } from '@/shared/lib/hooks/toast'
import { useUpdateSMSMutation } from '@/shared/api'
import { LoadingButton } from '@mui/lab'

const periods: { value: string; content: string }[] = [
    { value: '1w', content: 'через 1 неделю после диагностики' },
    { value: '2w', content: 'через 2 недели после диагностики' },
    { value: '1m', content: 'через 1 месяц после диагностики' },
    { value: '2m', content: 'через 2 месяца после диагностики' },
]

export const Recommendations = ({ options }: { options: ISMS }) => {
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
            .then(() => TOAST_SUCCESS('Рекомендации обновлены'))
            .catch((err) => {
                console.error(err)
                TOAST_ERROR('Ошибка при сохранении изменений в рекомендациях')
            })
    }

    return (
        <div className={styles.Recommendations}>
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
                    <p>Выберите через какое время после диагностики выслать СМС</p>
                    <Box
                        display={'flex'}
                        flexWrap={'wrap'}
                        alignItems={'center'}
                        gap={'0 1rem'}
                    >
                        {periods.map((period, i) => (
                            <Controller
                                key={i}
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={!!field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            />
                                        }
                                        label={period.content}
                                    />
                                )}
                                name={period.value as keyof ISMS}
                            />
                        ))}
                    </Box>
                </Box>
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
