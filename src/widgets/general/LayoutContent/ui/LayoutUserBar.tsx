import React, { memo, useMemo } from 'react'
import { Avatar } from '@mui/material'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import styles from './LayoutUserBar.module.css'

const MOCK_EMAIL = 'user@example.com'

function initialsFromName(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
        const a = parts[0][0]
        const b = parts[1][0]
        if (a && b) return `${a}${b}`.toUpperCase()
    }
    const compact = name.replace(/\s+/g, '')
    if (compact.length >= 2) return compact.slice(0, 2).toUpperCase()
    if (compact.length === 1) return compact.toUpperCase()
    return '?'
}

export const LayoutUserBar: React.FC = memo(() => {
    const { userData } = useAuth()

    const displayName = useMemo(() => {
        const n = userData?.name?.trim()
        return n || 'Пользователь'
    }, [userData?.name])

    const displayEmail = useMemo(() => {
        const e = userData?.email?.trim()
        return e || MOCK_EMAIL
    }, [userData?.email])

    const initials = useMemo(() => initialsFromName(displayName), [displayName])

    return (
        <div className={styles.wrap}>
            <div className={styles.block}>
                <div className={styles.textCol}>
                    <span className={styles.name}>{displayName}</span>
                    <span className={styles.email}>{displayEmail}</span>
                </div>
                <Avatar
                    alt={displayName}
                    sx={{
                        width: 48,
                        height: 48,
                        flexShrink: 0,
                        bgcolor: 'var(--primary-color)',
                        color: 'var(--text-color-light, #fff)',
                        fontSize: '1rem',
                        fontWeight: 600,
                    }}
                >
                    {initials}
                </Avatar>
            </div>
        </div>
    )
})
