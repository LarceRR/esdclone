import { EGroupNaming } from '@/shared/api/types'
import type { IUserData } from '@/shared/types/auth'
import type { INavigationList } from '../types'
import { ESection } from '../types'

const sectionToGroup: Record<ESection, EGroupNaming> = {
    [ESection.Group]: EGroupNaming.Group,
    [ESection.User]: EGroupNaming.User,
    [ESection.Categories]: EGroupNaming.Categories,
    [ESection.Product]: EGroupNaming.Product,
}

/** Проверка доступа к пункту меню по секции прав (ListController). */
export function canAccessNavSection(user: IUserData, section?: ESection): boolean {
    if (user.role === 'superadmin') return true
    if (!section) return true
    const key = sectionToGroup[section]
    return Boolean(user.rules?.[key]?.ListController)
}

export function filterVisibleBottomNavItems(items: INavigationList[], user: IUserData): INavigationList[] {
    return items.filter((item) => canAccessNavSection(user, item.section))
}
