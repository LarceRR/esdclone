import styles from './Reviews.module.css'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Box, Checkbox, FormControlLabel, TextareaAutosize } from '@mui/material'
import { ISMS } from '@/shared/api/list/smsApi/types.ts'
import { useUpdateSMSMutation } from '@/shared/api'
import { LoadingButton } from '@mui/lab'
import { useToast } from '@/shared/lib/hooks/toast'

const periods: string[] = ['1 час', '1 день', '2 дня', 'Отключить']

export const Reviews = ({ options }: { options: ISMS }) => {
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
            .then(() => TOAST_SUCCESS('Отзывы обновлены'))
            .catch((err) => {
                console.error(err)
                TOAST_ERROR('Ошибка при сохранении изменений в отзывах')
            })
    }

    return (
        <div className={styles.Reviews}>
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
                            placeholder={'Сбор отзывов'}
                        />
                    )}
                    name={'message'}
                />
                <Box>
                    <p>Выберите через какое время после выполнения заказ-наряда выслать СМС</p>
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
                                    label={periods[0]}
                                />
                            )}
                            name={'1h'}
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
                                    label={periods[1]}
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
                                    label={periods[2]}
                                />
                            )}
                            name={'2d'}
                        />
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={!!field.value}
                                            onChange={(e) => {
                                                field.onChange(e.target.checked)
                                            }}
                                        />
                                    }
                                    label={periods[3]}
                                />
                            )}
                            name={'off'}
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
                <section className={styles.info}>
                    <p>– Внимание! Телефонный номер для отправки отзывов: +79061955777. Изменять данный номер нельзя.</p>
                    <p>
                        – После установки статуса заказ–наряда «Выполнен», клиент получит SMS с просьбой оценить качество обслуживания. Полученные оценки
                        будут доступны в разделе {'Отчеты –> SMS –> Входящие.'}
                    </p>
                </section>
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
