import React, { ReactNode, useEffect } from 'react'

import styles from './LayoutContent.module.css'

import classNames from 'classnames'

import NavbarContent from '@/widgets/general/NavbarContent'

import { MobileBottomNav } from '@/widgets/general/NavbarContent/ui/MobileBottomNav'

import { useAuth } from '@/shared/lib/hooks/useAuth'

import { ELinks } from '@/shared/constants/appLinks.ts'

import { Drawer, useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { LayoutUserBar } from './LayoutUserBar'

import { LayoutMobileTopBar } from './LayoutMobileTopBar'

import { useAppDispatch, useAppSelector } from '@/shared/store'

import { mobileDrawerOpenReducer } from '@/widgets/general/NavbarContent/model/reducers/toggleReducer/toggleReducer.ts'

import { navbarActions } from '@/widgets/general/NavbarContent/model/slices/navbarSlice.ts'

import { PageTitleProvider } from '@/shared/lib/pageTitle/PageTitleContext.tsx'

import { LayoutPageTitle } from './LayoutPageTitle'

interface ILayoutContent {
    children: ReactNode

    className?: string
}

export const LayoutContent: React.FC<ILayoutContent> = ({ children, className }) => {
    const { isAuth } = useAuth()
    const navigate = useNavigate()

    const isMobileLayout = useMediaQuery('(max-width:768px)')
    const dispatch = useAppDispatch()
    const mobileDrawerOpen = useAppSelector(mobileDrawerOpenReducer)

    useEffect(() => {
        if (!isAuth) {
            navigate(ELinks.SIGN_IN, { replace: true })
        }
    }, [isAuth, navigate])

    return (
        <div className={classNames(styles.LayoutContent, className)}>
            {!isMobileLayout && (
                <div className={styles.sidebarShell}>
                    <NavbarContent />
                </div>
            )}

            {isMobileLayout && (
                <Drawer
                    anchor='left'
                    open={mobileDrawerOpen}
                    onClose={() => dispatch(navbarActions.setMobileDrawerOpen(false))}
                    PaperProps={{
                        sx: {
                            width: 'min(19.5rem, 88vw)',
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    <NavbarContent
                        variant='drawer'
                        onRequestCloseDrawer={() => dispatch(navbarActions.setMobileDrawerOpen(false))}
                    />
                </Drawer>
            )}

            <div
                className={styles.content}
            >
                <PageTitleProvider>
                    {isMobileLayout && <LayoutMobileTopBar />}

                    <div className={styles.desktopHeaderRow}>
                        <LayoutUserBar />

                        <LayoutPageTitle />
                    </div>

                    {children}
                </PageTitleProvider>
            </div>

            {isMobileLayout && <MobileBottomNav />}
        </div>
    )
}
