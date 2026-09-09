import type { ReactNode } from 'react'
import type { ELinks } from '@/shared/constants/appLinks.ts'
import type { ESection } from './index.ts'

export interface SidebarLeaf {
    path: ELinks
    title: string
    icon: ReactNode
    section?: ESection
}

export interface SidebarAccordionDef {
    id: string
    title: string
    icon: ReactNode
    children: SidebarLeaf[]
}
