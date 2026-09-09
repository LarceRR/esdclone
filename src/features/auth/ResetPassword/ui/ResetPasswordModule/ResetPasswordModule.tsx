import React from 'react'
import { Box, TextField } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import styles from '@/features/auth/SignIn/ui/Form/Form.module.css'
import moduleStyles from './ResetPasswordModule.module.css'
import { signInButtonSx, signInTextFieldSx } from '@/features/auth/SignIn/ui/signInTheme'
import { useToast } from '@/shared/lib/hooks/toast'
import { useResetPasswordMutation } from '@/shared/api'
import { ELinks } from '@/shared/constants/appLinks.ts'
import Logo from '@public/general/logo.svg'

interface IResetPasswordFormData {
    password: string
    password_confirmation: string
}

export const ResetPasswordModule: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') ?? ''
    const email = searchParams.get('email') ?? ''
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()
    const [resetPassword, { isLoading }] = useResetPasswordMutation()

    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues,
    } = useForm<IResetPasswordFormData>({
        defaultValues: {
            password: '',
            password_confirmation: '',
        },
    })

    const onSubmit: SubmitHandler<IResetPasswordFormData> = async (data) => {
        if (!token || !email) {
            TOAST_ERROR('Недействительная ссылка для сброса пароля')
            return
        }

        try {
            const response = await resetPassword({
                email,
                token,
                password: data.password,
                password_confirmation: data.password_confirmation,
            }).unwrap()

            TOAST_SUCCESS(response.message || 'Пароль успешно изменён')
            navigate(ELinks.SIGN_IN, { replace: true })
        } catch (error: unknown) {
            const message =
                error && typeof error === 'object' && 'data' in error
                    ? (error as { data?: { message?: string } }).data?.message
                    : undefined
            TOAST_ERROR(message || 'Не удалось изменить пароль')
        }
    }

    const linkInvalid = !token || !email

    return (
        <Box
            className={moduleStyles.root}
            component='section'
            aria-labelledby='reset-password-heading'
        >
            <Box className={moduleStyles.header}>
                <Box className={moduleStyles.logoWrap}>
                    <Logo />
                </Box>
                <Box className={moduleStyles.intro}>
                    <h3
                        id='reset-password-heading'
                        className={moduleStyles.title}
                    >
                        Новый пароль
                    </h3>
                    <p className={moduleStyles.subtitle}>
                        {linkInvalid
                            ? 'Ссылка недействительна. Запросите восстановление пароля снова.'
                            : 'Введите новый пароль для вашего аккаунта'}
                    </p>
                </Box>
            </Box>

            <Box
                className={styles.wrap}
                color={'#FFF'}
                display={'flex'}
                flexDirection={'column'}
                gap={'0.5rem'}
            >
                {linkInvalid ? (
                    <Box className={styles.actions}>
                        <Link
                            to={ELinks.SIGN_IN}
                            className={styles.linkButton}
                        >
                            Вернуться к входу
                        </Link>
                    </Box>
                ) : (
                    <form
                        className={styles.form}
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Controller
                            control={control}
                            rules={{
                                required: 'Обязательно для заполнения',
                                minLength: { value: 6, message: 'Минимум 6 символов' },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    name='password'
                                    type='password'
                                    autoComplete='new-password'
                                    label='Новый пароль'
                                    placeholder='Введите новый пароль'
                                    size='small'
                                    fullWidth
                                    error={!!errors.password?.message}
                                    helperText={errors.password?.message}
                                    sx={signInTextFieldSx}
                                />
                            )}
                            name='password'
                        />
                        <Controller
                            control={control}
                            rules={{
                                required: 'Обязательно для заполнения',
                                validate: (value) =>
                                    value === getValues('password') || 'Пароли не совпадают',
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    name='password_confirmation'
                                    type='password'
                                    autoComplete='new-password'
                                    label='Повторите пароль'
                                    placeholder='Повторите новый пароль'
                                    size='small'
                                    fullWidth
                                    error={!!errors.password_confirmation?.message}
                                    helperText={errors.password_confirmation?.message}
                                    sx={signInTextFieldSx}
                                />
                            )}
                            name='password_confirmation'
                        />
                        <LoadingButton
                            type='submit'
                            variant='contained'
                            loading={isLoading}
                            sx={signInButtonSx}
                        >
                            Сохранить пароль
                        </LoadingButton>
                    </form>
                )}
            </Box>
        </Box>
    )
}
