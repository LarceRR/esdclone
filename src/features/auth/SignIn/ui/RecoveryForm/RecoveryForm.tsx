import React from 'react'
import { Box, TextField } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import styles from '../Form/Form.module.css'
import { IRecoveryEmailFormData } from '../../model/types/recovery'
import { validateEmail } from '../../model/validation'
import { signInButtonSx, signInTextFieldSx } from '../signInTheme'
import { useToast } from '@/shared/lib/hooks/toast'
import { useForgotPasswordMutation } from '@/shared/api'

interface RecoveryFormProps {
    onBack: () => void
}

export const RecoveryForm: React.FC<RecoveryFormProps> = ({ onBack }) => {
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()
    const [forgotPassword, { isLoading: isSending }] = useForgotPasswordMutation()

    const emailForm = useForm<IRecoveryEmailFormData>({
        defaultValues: { email: '' },
    })

    const onEmailSubmit: SubmitHandler<IRecoveryEmailFormData> = async (data) => {
        try {
            const response = await forgotPassword({ email: data.email }).unwrap()
            const resetUrl = response.data?.debug_reset_url

            if (resetUrl) {
                console.info('[Password Reset] Ссылка для сброса пароля:', resetUrl)
            }

            TOAST_SUCCESS(
                resetUrl
                    ? 'Ссылка сгенерирована — смотрите консоль браузера'
                    : response.message || 'Если email зарегистрирован, ссылка будет сгенерирована',
            )
        } catch (error: unknown) {
            const message =
                error && typeof error === 'object' && 'data' in error
                    ? (error as { data?: { message?: string } }).data?.message
                    : undefined
            TOAST_ERROR(message || 'Не удалось запросить ссылку')
        }
    }

    return (
        <Box
            className={styles.wrap}
            color={'#FFF'}
            display={'flex'}
            flexDirection={'column'}
            gap={'0.5rem'}
        >
            <form
                className={styles.form}
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
            >
                <Controller
                    control={emailForm.control}
                    rules={validateEmail}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            name='email'
                            type='email'
                            autoComplete='email'
                            label='Эл. почта'
                            placeholder='example@mail.ru'
                            size='small'
                            fullWidth
                            error={!!emailForm.formState.errors.email?.message}
                            helperText={emailForm.formState.errors.email?.message}
                            sx={signInTextFieldSx}
                        />
                    )}
                    name='email'
                />
                <LoadingButton
                    type='submit'
                    variant='contained'
                    loading={isSending}
                    sx={signInButtonSx}
                >
                    Отправить ссылку
                </LoadingButton>
            </form>
            <Box
                className={styles.actions}
                width='100%'
                display='flex'
                justifyContent='flex-start'
            >
                <button
                    type='button'
                    className={styles.linkButton}
                    onClick={onBack}
                >
                    Вернуться к входу
                </button>
            </Box>
        </Box>
    )
}
