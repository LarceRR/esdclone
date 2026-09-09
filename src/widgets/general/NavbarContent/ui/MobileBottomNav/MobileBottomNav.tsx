import React, { memo, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { isBottomNavItemActive } from '@/shared/lib/nav/navLinkActive.ts'
import classNames from 'classnames'
import { bottomNavigationList } from '@/widgets/general/NavbarContent/model/lib/bottomNavigationList.tsx'
import { filterVisibleBottomNavItems } from '@/widgets/general/NavbarContent/model/lib/filterVisibleBottomNavItems.ts'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import styles from './MobileBottomNav.module.css'

export const MobileBottomNav: React.FC = memo(() => {
    const { pathname } = useLocation()
    const { userData, removeUser } = useAuth()

    const items = useMemo(() => {
        if (!userData) return []
        return filterVisibleBottomNavItems(bottomNavigationList, userData)
    }, [userData])

    if (!userData) {
        removeUser()
        return null
    }

    return (
        <nav
            className={styles.bar}
            aria-label='Основная навигация'
        >
            {items.map((item, index) => {
                const active = isBottomNavItemActive(pathname, item.path)
                return (
                    <Link
                        key={`${item.path}-${index}`}
                        to={item.path}
                        className={classNames(styles.navLink, active && styles.navLinkActive)}
                        aria-current={active ? 'page' : undefined}
                        aria-label={item.title}
                    >
                        <span className={styles.iconWrap}>{item.icon}</span>
                        <span className={styles.label}>{item.title.length > 9 ? item.title.slice(0, 9) + '...' : item.title}</span>
                    </Link>
                )
            })}
        </nav>
    )
})
