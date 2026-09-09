import React, { useEffect } from 'react'
import { Box, Button, TextField } from '@mui/material'
import styles from './Form.module.css'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ISignUpFormData } from '../../model/types'
import { MuiTelInput } from 'mui-tel-input'
import { validatePhoneNumber, validateName, validateEmail } from '../../model/validation'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ELinks } from '@/shared/constants/appLinks.ts'
import Logo from '@public/general/logo.svg'
import toast from 'react-hot-toast'
import { authApi } from '@/shared/api/list/authApi'

export const Form: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const inviteCode = searchParams.get('invite') ?? undefined
    const [signUp, { isLoading }] = authApi.useSignUpMutation()

    const {
        formState: { errors },
        handleSubmit,
        control,
        setValue,
    } = useForm<ISignUpFormData>({
        defaultValues: {
            invite_code: inviteCode,
        },
    })

    useEffect(() => {
        if (inviteCode) {
            setValue('invite_code', inviteCode)
        }
    }, [inviteCode, setValue])

    const onSubmit: SubmitHandler<ISignUpFormData> = async (data) => {
        try {
            const response = await signUp({
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                password: data.password,
                shop_name: data.shop_name,
                invite_code: data.invite_code || inviteCode,
            }).unwrap()

            toast.success(response.message || 'Вы зарегистрированы')
            navigate(ELinks.SIGN_IN, { replace: true })
        } catch (error: unknown) {
            const message =
                error && typeof error === 'object' && 'data' in error
                    ? (error as { data?: { message?: string } }).data?.message
                    : undefined
            toast.error(message || 'Не удалось зарегистрироваться')
        }
    }

    return (
        <Box
            className={styles.Form}
            padding={'2rem'}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            gap={'0.5rem'}
        >
            <Box
                className={styles.header}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                gap={'1rem'}
                marginBottom={'1rem'}
            >
                <Logo />
                <Box>
                    <h3>Создание аккаунта</h3>
                    <p>Введите свои данные для получения бесплатного доступа</p>
                </Box>
            </Box>
            <form
                className={styles.form}
                onSubmit={handleSubmit(onSubmit)}
            >
                <Controller
                    rules={validateName}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            type={'text'}
                            error={!!errors?.name?.message}
                            helperText={errors?.name?.message}
                            onChange={(e) => field.onChange(e)}
                            placeholder={'Введите ваше имя'}
                            size={'small'}
                            fullWidth
                        />
                    )}
                    name={'name'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            type={'text'}
                            onChange={(e) => field.onChange(e)}
                            placeholder={'Фамилия (необязательно)'}
                            size={'small'}
                            fullWidth
                        />
                    )}
                    name={'surname'}
                />
                <Controller
                    rules={validateEmail}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            error={!!errors?.email?.message}
                            helperText={errors?.email?.message}
                            onChange={(e) => field.onChange(e)}
                            placeholder={'Введите ваш E-Mail'}
                            size={'small'}
                            fullWidth
                        />
                    )}
                    name={'email'}
                />
                <Controller
                    rules={validatePhoneNumber}
                    control={control}
                    render={({ field }) => (
                        <MuiTelInput
                            onChange={(e) => field.onChange(e)}
                            name={'phone'}
                            value={field.value}
                            error={!!errors.phone?.message}
                            label={'Телефон'}
                            size={'small'}
                            helperText={errors.phone?.message}
                            fullWidth
                        />
                    )}
                    name={'phone'}
                />
                <Controller
                    rules={{ required: 'Обязательно для заполнения', minLength: { value: 6, message: 'Минимум 6 символов' } }}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            type={'password'}
                            error={!!errors?.password?.message}
                            helperText={errors?.password?.message}
                            onChange={(e) => field.onChange(e)}
                            placeholder={'Пароль'}
                            size={'small'}
                            fullWidth
                        />
                    )}
                    name={'password'}
                />
                <Controller
                    rules={{ required: 'Обязательно для заполнения', minLength: { value: 2, message: 'Минимум 2 символа' } }}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            type={'text'}
                            error={!!errors?.shop_name?.message}
                            helperText={errors?.shop_name?.message}
                            onChange={(e) => field.onChange(e)}
                            placeholder={'Название магазина'}
                            size={'small'}
                            fullWidth
                        />
                    )}
                    name={'shop_name'}
                />
                <Button
                    variant={'contained'}
                    type={'submit'}
                    disabled={isLoading}
                >
                    Зарегистрироваться
                </Button>
            </form>
            <Link to={ELinks.SIGN_IN}>Уже есть аккаунт? Войти</Link>
        </Box>
    )
}
