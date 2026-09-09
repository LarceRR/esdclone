import React, { useCallback, useLayoutEffect, useRef } from 'react'
import { Box, TextField } from '@mui/material'
import styles from './Form.module.css'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ISignInFormData } from '../../model/types'
import { validatePassword, validatePhoneNumber } from '../../model/validation'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { useInfoUserMutation, useSignInMutation } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { LoadingButton } from '@mui/lab'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { signInButtonSx, signInTextFieldSx } from '../signInTheme'

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null): void {
    if (!ref) return
    if (typeof ref === 'function') {
        ref(value)
        return
    }
    ;(ref as React.MutableRefObject<T | null>).current = value
}

interface FormProps {
    onForgotPassword: () => void
}

export const Form: React.FC<FormProps> = ({ onForgotPassword }) => {
    const {
        control,
        formState: { errors },
        handleSubmit,
        setError,
        getValues,
        setValue,
    } = useForm<ISignInFormData>({
        defaultValues: {
            phone: '',
            password: '',
        },
    })
    const phoneInputRef = useRef<HTMLInputElement | null>(null)

    /** Браузерный autofill пишет в DOM без onChange; для MUI+RHF value остаётся '' и label снова «пустой». */
    const syncPhoneFromDomIfNeeded = useCallback(() => {
        const el = phoneInputRef.current
        if (!el) return
        const v = el.value.replace(/\D/g, '')
        if (!v) return
        const cur = getValues('phone') ?? ''
        if (v === cur) return
        setValue('phone', v, { shouldValidate: true, shouldDirty: true })
    }, [getValues, setValue])

    useLayoutEffect(() => {
        syncPhoneFromDomIfNeeded()
        const t0 = window.setTimeout(syncPhoneFromDomIfNeeded, 0)
        const t1 = window.setTimeout(syncPhoneFromDomIfNeeded, 100)
        const t2 = window.setTimeout(syncPhoneFromDomIfNeeded, 300)
        const t3 = window.setTimeout(syncPhoneFromDomIfNeeded, 600)
        const t4 = window.setTimeout(syncPhoneFromDomIfNeeded, 1200)
        let rafInner = 0
        const rafOuter = window.requestAnimationFrame(() => {
            rafInner = window.requestAnimationFrame(syncPhoneFromDomIfNeeded)
        })
        return () => {
            window.clearTimeout(t0)
            window.clearTimeout(t1)
            window.clearTimeout(t2)
            window.clearTimeout(t3)
            window.clearTimeout(t4)
            window.cancelAnimationFrame(rafOuter)
            window.cancelAnimationFrame(rafInner)
        }
    }, [syncPhoneFromDomIfNeeded])
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const { setUser } = useAuth()
    const [signIn, { isLoading: isLoadingSignIn }] = useSignInMutation()
    const [getInfoUser, { isLoading: isLoadingInfoUser }] = useInfoUserMutation()

    const onSubmit: SubmitHandler<ISignInFormData> = (data) => {
        const digits = data.phone.replace(/\D/g, '')
        signIn({ ...data, phone: digits })
            .unwrap()
            .then((res) => {
                if (res.code > 200) {
                    TOAST_ERROR(res.message)
                    return
                }
                if (res?.data?.original?.access_token) {
                    const token = res?.data?.original?.access_token
                    TOAST_SUCCESS('Успешная авторизация')
                    // В случае успешной авторизации - получаем информацию о пользователе
                    getInfoUser(res?.data?.original?.access_token)
                        .unwrap()
                        .then((user) => {
                            if (user?.data) {
                                setUser(user?.data, token)
                            }
                            window.location.replace(ELinks.HOME)
                        })
                        .catch((err) => {
                            console.log(err)
                            TOAST_ERROR('Не удалось получить информацию о пользователе')
                        })
                }
            })
            .catch((err: unknown) => {
                const fb = err as FetchBaseQueryError
                const data = fb?.data as { message?: string; error?: string } | undefined
                const message = data?.message ?? data?.error ?? 'Ошибка авторизации'
                TOAST_ERROR(message)
                setError('phone', { message })
                setError('password', { message })
            })
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
                onSubmit={handleSubmit(onSubmit)}
            >
                <Controller
                    rules={validatePhoneNumber}
                    control={control}
                    render={({ field }) => {
                        const { ref: rhfInputRef, ...fieldRest } = field
                        return (
                            <TextField
                                {...fieldRest}
                                inputRef={(el) => {
                                    phoneInputRef.current = el
                                    assignRef(rhfInputRef, el)
                                }}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                    onAnimationStart: (e: React.AnimationEvent<HTMLInputElement>) => {
                                        if (
                                            e.animationName === 'mui-auto-fill' ||
                                            e.animationName === 'mui-auto-fill-cancel'
                                        ) {
                                            const v = e.currentTarget.value.replace(/\D/g, '')
                                            field.onChange(v)
                                        }
                                    },
                                    onInput: (e: React.FormEvent<HTMLInputElement>) => {
                                        const v = e.currentTarget.value.replace(/\D/g, '')
                                        if (v !== field.value) {
                                            field.onChange(v)
                                        }
                                    },
                                }}
                                onChange={(e) => {
                                    const v = e.target.value.replace(/\D/g, '')
                                    field.onChange(v)
                                }}
                                name='phone'
                                type='text'
                                inputMode='numeric'
                                autoComplete='tel'
                                label='Телефон'
                                placeholder='9XXXXXXXXX'
                                size='small'
                                error={!!errors.phone?.message}
                                helperText={errors.phone?.message}
                                fullWidth
                                sx={signInTextFieldSx}
                            />
                        )
                    }}
                    name={'phone'}
                />
                <Controller
                    control={control}
                    rules={validatePassword}
                    render={({ field }) => (
                        <TextField
                            onChange={(e) => field.onChange(e)}
                            name={'password'}
                            type={'password'}
                            error={!!errors.password?.message}
                            label={'Пароль'}
                            size={'small'}
                            helperText={errors.password?.message}
                            sx={signInTextFieldSx}
                        />
                    )}
                    name={'password'}
                />
                <LoadingButton
                    loading={isLoadingInfoUser || isLoadingSignIn}
                    type={'submit'}
                    variant={'contained'}
                    sx={signInButtonSx}
                >
                    Авторизоваться
                </LoadingButton>
            </form>
            <Box
                className={styles.actions}
                width={'100%'}
                display={'flex'}
                justifyContent={'space-between'}
            >
                <button
                    type='button'
                    className={styles.linkButton}
                    onClick={onForgotPassword}
                >
                    Забыли пароль?
                </button>
            </Box>
        </Box>
    )
}
