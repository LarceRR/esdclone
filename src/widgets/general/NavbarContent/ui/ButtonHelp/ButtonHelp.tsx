import React, { memo } from 'react'
import { Button, Tooltip } from '@mui/material'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import styles from './ButtonHelp.module.css'

export const ButtonHelp: React.FC<{ toggled: boolean }> = memo(({ toggled }) => {
    const navigate = useNavigate()
    const { userRole } = useAuth()

    if (userRole !== 'superadmin') return null

    const button = (
        <Button
            className={classNames(styles.btn, !toggled && styles.btnIconOnly)}
            variant='text'
            aria-label='Справка'
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
            onClick={() => navigate(ELinks.HELP)}
        >
            <span
                className={styles.iconBox}
                aria-hidden='true'
            >
                <HelpOutlineRoundedIcon />
            </span>
            {toggled && <span className={styles.itemText}>Справка</span>}
        </Button>
    )

    return toggled ? (
        button
    ) : (
        <Tooltip
            title='Справка'
            placement='right'
            arrow
        >
            <span className={styles.tooltipHost}>{button}</span>
        </Tooltip>
    )
})
