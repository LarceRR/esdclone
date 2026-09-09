import { ELinks } from '@/shared/constants/appLinks.ts'

function pathBase(pathname: string): string {
    return pathname.split('?')[0] || pathname
}

/** Подсветка пунктов сайдбара: каждый пункт только на своём пути. */
export function isSidebarNavLinkActive(pathname: string, linkPath: ELinks): boolean {
    const base = pathBase(pathname)
    if (linkPath === ELinks.HOME) return base === '/'
    if (base === linkPath) return true
    return base.startsWith(`${linkPath}/`)
}

/** Нижняя панель: прежняя логика по первому сегменту пути (как было до сайдбара). */
export function isBottomNavItemActive(pathname: string, linkPath: ELinks): boolean {
    const base = pathBase(pathname)
    const segment = linkPath.split('/')[1] ?? ''
    return segment ? base.includes(segment) : base === linkPath
}
