import React, { memo } from 'react'
import classNames from 'classnames'
import { ButtonLogout } from '@/widgets/general/NavbarContent/ui/ButtonLogout/ButtonLogout.tsx'
import { ButtonToggle } from '@/widgets/general/NavbarContent/ui/ButtonToggle/ButtonToggle.tsx'
import styles from './SidebarDesktopFooter.module.css'

interface SidebarDesktopFooterProps {
    expanded: boolean
    onToggle: () => void
}

export const SidebarDesktopFooter: React.FC<SidebarDesktopFooterProps> = memo(({ expanded, onToggle }) => {
    return (
        <footer className={classNames(styles.footer, !expanded && styles.footerCollapsed)}>
            <ButtonLogout toggled={expanded} />
            <ButtonToggle
                toggled={expanded}
                onToggle={onToggle}
            />
        </footer>
    )
})
