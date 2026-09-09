import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import { isBottomNavItemActive } from '@/shared/lib/nav/navLinkActive.ts'
import { Button } from '@mui/material'
import { bottomNavigationList } from '@/widgets/general/NavbarContent/model/lib/bottomNavigationList.tsx'
import { filterVisibleBottomNavItems } from '@/widgets/general/NavbarContent/model/lib/filterVisibleBottomNavItems.ts'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import styles from './BottomNavigation.module.css'

export const BottomNavigation = ({ toggled }: { toggled: boolean }) => {
    const { pathname } = useLocation()
    const { userData, removeUser } = useAuth()

    if (!userData) {
        removeUser()
        return <div />
    }

    const visibleItems = filterVisibleBottomNavItems(bottomNavigationList, userData)

    return (
        <div className={styles.Navigation}>
            {visibleItems.map((item, index) => {
                const includesInPath = isBottomNavItemActive(pathname, item.path)
                return (
                    <Link
                        className={classNames(styles.link, includesInPath && styles.selected, toggled && styles.toggled)}
                        to={item.path}
                        key={`${item.path}-${index}`}
                    >
                        <Button
                            variant={'text'}
                            disabled={includesInPath}
                            sx={{
                                width: 'auto',
                                padding: '0.75rem 1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                justifyContent: 'center',
                            }}
                            className={classNames(styles.button, !toggled && styles.toggledButton)}
                        >
                            {item.icon}
                            {toggled && <span>{item.title}</span>}
                        </Button>
                    </Link>
                )
            })}
        </div>
    )
}
