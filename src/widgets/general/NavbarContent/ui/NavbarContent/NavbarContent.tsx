import React, { useCallback } from 'react'
import styles from './NavbarContent.module.css'
import { IconButton, Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Logo from '@public/general/logo.svg'
import LogoCup from '@public/general/logo-cup.svg'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/shared/store'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { toggleReducer } from '../../model/reducers/toggleReducer/toggleReducer.ts'
import { navbarActions } from '../../model/slices/navbarSlice.ts'
import { SidebarNav } from '@/widgets/general/NavbarContent/ui/SidebarNav/SidebarNav.tsx'
import { SidebarDesktopFooter } from '@/widgets/general/NavbarContent/ui/SidebarDesktopFooter/SidebarDesktopFooter.tsx'

export type NavbarContentVariant = 'docked' | 'drawer'

interface NavbarContentProps {
    variant?: NavbarContentVariant
    onRequestCloseDrawer?: () => void
}

const headerBtnSx = {
    'width': 36,
    'height': 36,
    'flexShrink': 0,
    'color': 'var(--text-color)',
    'borderRadius': '8px',
    '&:hover': { backgroundColor: '#f471391a' },
} as const

export const NavbarContent: React.FC<NavbarContentProps> = ({ variant = 'docked', onRequestCloseDrawer }) => {
    const dispatch = useAppDispatch()
    const toggleSize = useAppSelector(toggleReducer)

    const onToggleSize = useCallback(() => dispatch(navbarActions.toggleNavbar()), [dispatch])

    const isDrawer = variant === 'drawer'
    const isDocked = !isDrawer
    const isWide = toggleSize || isDrawer

    return (
        <div className={classNames(styles.NavbarContent, isWide ? styles.wide : styles.narrow)}>
            {(isDrawer || isDocked) && (
                <div
                    className={classNames(
                        styles.headerRow,
                        isDrawer && styles.headerRowDrawer,
                        isDocked && isWide && styles.headerRowCentered,
                        isDocked && !isWide && styles.headerRowCollapsed,
                    )}
                >
                    {isDrawer ? (
                        <div className={styles.headerSlot}>
                            <Tooltip
                                title='Закрыть меню'
                                placement='right'
                                arrow
                            >
                                <IconButton
                                    aria-label='Закрыть меню'
                                    onClick={onRequestCloseDrawer}
                                    sx={headerBtnSx}
                                    size='small'
                                >
                                    <CloseIcon fontSize='small' />
                                </IconButton>
                            </Tooltip>
                        </div>
                    ) : isWide ? (
                        <div className={styles.headerLogo}>
                            <NavLink
                                to={ELinks.DASHBOARD}
                                className={styles.headerLogoLink}
                                aria-label='Перейти на дашборды'
                            >
                                <Logo />
                            </NavLink>
                        </div>
                    ) : (
                        <div className={styles.headerLogoCompact}>
                            <NavLink
                                to={ELinks.DASHBOARD}
                                className={styles.headerLogoCompactLink}
                                aria-label='Перейти на дашборды'
                            >
                                <span
                                    className={styles.logoCupIcon}
                                    aria-hidden='true'
                                >
                                    <LogoCup />
                                </span>
                            </NavLink>
                        </div>
                    )}
                </div>
            )}

            <div className={styles.navScroll}>
                <SidebarNav
                    toggled={isWide}
                    onLeafNavigate={isDrawer ? onRequestCloseDrawer : undefined}
                />
            </div>

            {isDocked && (
                <SidebarDesktopFooter
                    expanded={isWide}
                    onToggle={onToggleSize}
                />
            )}
        </div>
    )
}
