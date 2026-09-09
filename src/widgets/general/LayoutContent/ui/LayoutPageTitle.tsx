import React, { memo } from 'react'
import { usePageTitleContext } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import styles from './LayoutPageTitle.module.css'

export const LayoutPageTitle: React.FC = memo(() => {
    const { title, titleNode } = usePageTitleContext()

    if (titleNode != null) {
        return (
            <div className={styles.wrap}>
                <h1 className={styles.title}>{titleNode}</h1>
            </div>
        )
    }

    if (!title?.trim()) {
        return null
    }

    return (
        <div className={styles.wrap}>
            <h1 className={styles.title}>{title}</h1>
        </div>
    )
})

LayoutPageTitle.displayName = 'LayoutPageTitle'
