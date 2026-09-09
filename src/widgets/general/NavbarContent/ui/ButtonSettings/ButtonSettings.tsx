import React, { memo } from 'react'
import SettingsIcon from '@public/icons/settings-icon.svg'
import { Button } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { ELinks } from '@/shared/constants/appLinks.ts'
import styles from './ButtonSettings.module.css'
import classNames from 'classnames'

export const ButtonSettings: React.FC<{ toggled: boolean }> = memo(({ toggled }: { toggled: boolean }) => {
    const { pathname } = useLocation()
    return (
        <Button
            variant={'text'}
            sx={{
                width: '105%',
                padding: '0.75rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'flex-start',
                textAlign: 'left',
            }}
        >
            <Link
                className={classNames(styles.link, pathname === ELinks.SETTINGS && styles.selected, toggled && styles.toggled)}
                to={ELinks.SETTINGS}
            >
                <SettingsIcon />
                {toggled && <span className={styles.itemText}>Настройки</span>}
            </Link>
        </Button>
    )
})
