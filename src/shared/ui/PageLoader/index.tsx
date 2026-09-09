import { memo, useEffect, useState } from 'react'
import styles from './PageLoader.module.css'
import classNames from 'classnames'

interface PageLoaderProps {
    active: boolean
}

export const PageLoader = memo(({ active }: PageLoaderProps) => {
    const [mounted, setMounted] = useState(active)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (active) {
            setMounted(true)
            const frame = requestAnimationFrame(() => setVisible(true))
            return () => cancelAnimationFrame(frame)
        }

        setVisible(false)
        const timeout = window.setTimeout(() => setMounted(false), 280)
        return () => window.clearTimeout(timeout)
    }, [active])

    if (!mounted) {
        return null
    }

    return (
        <div
            className={classNames(styles.PageLoader, visible && styles.PageLoader_visible)}
            role='status'
            aria-live='polite'
            aria-busy={active}
            aria-label='Загрузка'
        >
            <div className={styles.spinner} />
        </div>
    )
})

PageLoader.displayName = 'PageLoader'
