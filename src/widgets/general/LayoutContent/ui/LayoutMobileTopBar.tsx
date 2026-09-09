import React, { memo } from 'react'
import { IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Logo from '@public/general/logo.svg'
import { useAppDispatch } from '@/shared/store'
import { navbarActions } from '@/widgets/general/NavbarContent/model/slices/navbarSlice.ts'
import { SidebarUserAvatarMenu } from '@/widgets/general/NavbarContent/ui/SidebarUserAvatarMenu/SidebarUserAvatarMenu.tsx'
import styles from './LayoutMobileTopBar.module.css'

export const LayoutMobileTopBar: React.FC = memo(() => {
    const dispatch = useAppDispatch()

    return (
        <header className={styles.bar}>
            <div className={styles.side}>
                <IconButton
                    edge='start'
                    color='inherit'
                    aria-label='Открыть меню'
                    onClick={() => dispatch(navbarActions.setMobileDrawerOpen(true))}
                    size='large'
                    className={styles.menuBtn}
                >
                    <MenuIcon />
                </IconButton>
            </div>

            <div className={styles.logoWrap}>
                <Logo />
            </div>

            <div className={styles.side}>
                <SidebarUserAvatarMenu avatarSize={32} />
            </div>
        </header>
    )
})
