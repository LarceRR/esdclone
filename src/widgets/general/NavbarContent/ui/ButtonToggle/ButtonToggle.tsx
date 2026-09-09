import React, { memo } from 'react'
import { Button, Tooltip } from '@mui/material'
import ShowIcon from '@public/icons/show-navbar-icon.svg'
import HideIcon from '@public/icons/hide-navbar-icon.svg'
import classNames from 'classnames'
import styles from './ButtonToggle.module.css'

interface IButtonToggle {
    toggled: boolean
    onToggle: () => void
}

export const ButtonToggle: React.FC<IButtonToggle> = memo(({ toggled, onToggle }) => {
    const label = toggled ? 'Свернуть' : 'Развернуть'

    const button = (
        <Button
            className={classNames(styles.btn, !toggled && styles.btnIconOnly)}
            variant='text'
            aria-label={label}
            sx={{
                width: toggled ? '100%' : 44,
                minWidth: toggled ? undefined : 44,
                minHeight: 44,
                padding: toggled ? '0.35rem 0.65rem' : 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: toggled ? 'flex-start' : 'center',
                gap: '0.65rem',
                color: 'var(--text-color)',
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': { backgroundColor: '#f471391a' },
            }}
            onClick={onToggle}
        >
            {toggled ? (
                <>
                    <span
                        className={styles.iconBox}
                        aria-hidden='true'
                    >
                        <HideIcon />
                    </span>
                    <span className={styles.itemText}>Свернуть</span>
                </>
            ) : (
                <span
                    className={styles.iconBox}
                    aria-hidden='true'
                >
                    <ShowIcon />
                </span>
            )}
        </Button>
    )

    if (toggled) return button

    return (
        <Tooltip
            title={label}
            placement='right'
            arrow
        >
            <span className={styles.tooltipHost}>{button}</span>
        </Tooltip>
    )
})
