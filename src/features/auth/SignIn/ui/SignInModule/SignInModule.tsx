import React, { useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import classNames from 'classnames'
import styles from './SignInModule.module.css'
import { Form } from '../Form/Form.tsx'
import { RecoveryForm } from '../RecoveryForm/RecoveryForm.tsx'
import Logo from '@public/general/logo.svg'
import { ELinks } from '@/shared/constants/appLinks.ts'

type SignInMode = 'signIn' | 'recovery'

const HEADER: Record<SignInMode, { title: string; subtitle: string }> = {
    signIn: {
        title: 'С возвращением',
        subtitle: 'Введите свои данные для успешной авторизации',
    },
    recovery: {
        title: 'Восстановление пароля',
        subtitle: 'Укажите email — ссылка для сброса появится в консоли',
    },
}

export const SignInModule: React.FC = () => {
    const location = useLocation()
    const [mode, setMode] = useState<SignInMode>(
        location.pathname === ELinks.RECOVERY ? 'recovery' : 'signIn',
    )
    const isRecovery = mode === 'recovery'
    const { title, subtitle } = HEADER[mode]
    const signInPanelRef = useRef<HTMLDivElement>(null)
    const recoveryPanelRef = useRef<HTMLDivElement>(null)
    const [formsHeight, setFormsHeight] = useState<number | null>(null)

    useLayoutEffect(() => {
        const panel = isRecovery ? recoveryPanelRef.current : signInPanelRef.current
        if (!panel) return

        const syncHeight = () => setFormsHeight(panel.offsetHeight)

        syncHeight()
        const observer = new ResizeObserver(syncHeight)
        observer.observe(panel)
        return () => observer.disconnect()
    }, [mode])

    return (
        <Box
            className={styles.root}
            component='section'
            aria-labelledby='signin-heading'
        >
            <Box className={styles.header}>
                <Box className={styles.logoWrap}>
                    <Logo />
                </Box>
                <Box
                    className={styles.intro}
                    key={mode}
                >
                    <h3
                        id='signin-heading'
                        className={styles.title}
                    >
                        {title}
                    </h3>
                    <p className={styles.subtitle}>{subtitle}</p>
                </Box>
            </Box>
            <Box
                className={styles.formsViewport}
                style={formsHeight !== null ? { height: formsHeight } : undefined}
            >
                <Box
                    ref={signInPanelRef}
                    className={classNames(
                        styles.formPanel,
                        !isRecovery ? styles.formPanelActive : styles.formPanelInactive,
                    )}
                    aria-hidden={isRecovery}
                >
                    <Form onForgotPassword={() => setMode('recovery')} />
                </Box>
                <Box
                    ref={recoveryPanelRef}
                    className={classNames(
                        styles.formPanel,
                        isRecovery ? styles.formPanelActive : styles.formPanelInactive,
                    )}
                    aria-hidden={!isRecovery}
                >
                    <RecoveryForm onBack={() => setMode('signIn')} />
                </Box>
            </Box>
        </Box>
    )
}
