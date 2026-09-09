import React, { memo, useCallback, useState } from 'react'
import { Button, Tooltip } from '@mui/material'
import classNames from 'classnames'
import LogoutIcon from '@public/icons/logout-icon.svg'
import styles from './ButtonLogout.module.css'
import { LogoutConfirmDialog } from '@/widgets/general/NavbarContent/ui/LogoutFlow/LogoutConfirmDialog.tsx'
import { usePerformLogout } from '@/widgets/general/NavbarContent/ui/LogoutFlow/usePerformLogout.ts'

export const ButtonLogout: React.FC<{ toggled: boolean }> = memo(({ toggled }) => {
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const performLogout = usePerformLogout()

    const onOpenConfirm = useCallback(() => setConfirmOpen(true), [])

    const onCloseConfirm = useCallback(() => setConfirmOpen(false), [])

    const button = (
        <Button
            className={classNames(styles.btn, !toggled && styles.btnIconOnly)}
            variant='text'
            aria-label='Выйти'
            sx={{
                width: toggled ? '100%' : 44,
                minWidth: toggled ? undefined : 44,
                minHeight: 44,
                padding: toggled ? '0.35rem 0.65rem' : 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                justifyContent: toggled ? 'flex-start' : 'center',
                textAlign: 'left',
                color: 'var(--text-color)',
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': { backgroundColor: '#f471391a' },
            }}
            onClick={onOpenConfirm}
        >
            <span
                className={styles.iconBox}
                aria-hidden='true'
            >
                <LogoutIcon />
            </span>

            {toggled && <span className={styles.itemText}>Выйти</span>}
        </Button>
    )

    return (
        <>
            <LogoutConfirmDialog
                open={confirmOpen}
                onClose={onCloseConfirm}
                onConfirm={performLogout}
            />

            {toggled ? (
                button
            ) : (
                <Tooltip
                    title='Выйти'
                    placement='right'
                    arrow
                >
                    <span className={styles.tooltipHost}>{button}</span>
                </Tooltip>
            )}
        </>
    )
})
