import { ELinks } from '@/shared/constants/appLinks.ts'
import { ReactNode } from 'react'

export enum ESection {
    Group = 'Group',
    User = 'User',
    Categories = 'Categories',
    Product = 'Product',
}
export interface INavigationList {
    path: ELinks
    title: string
    icon: ReactNode
    section?: ESection
}
