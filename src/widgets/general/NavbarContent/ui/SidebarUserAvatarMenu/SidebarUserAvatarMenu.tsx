import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Avatar, IconButton } from '@mui/material'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { LogoutConfirmDialog } from '@/widgets/general/NavbarContent/ui/LogoutFlow/LogoutConfirmDialog.tsx'
import { usePerformLogout } from '@/widgets/general/NavbarContent/ui/LogoutFlow/usePerformLogout.ts'
import styles from './SidebarUserAvatarMenu.module.css'

const MENU_MIN_WIDTH_PX = 160

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

function computeMenuPosition(triggerEl: HTMLElement): { top: number; left: number } {
    const r = triggerEl.getBoundingClientRect()
    const gap = 6
    const margin = 8
    let left = r.right - MENU_MIN_WIDTH_PX
    if (left < margin) left = margin
    const maxLeft = window.innerWidth - MENU_MIN_WIDTH_PX - margin
    if (left > maxLeft) left = Math.max(margin, maxLeft)
    return { top: r.bottom + gap, left }
}

interface SidebarUserAvatarMenuProps {
    avatarSize?: number
}

export const SidebarUserAvatarMenu: React.FC<SidebarUserAvatarMenuProps> = memo(({ avatarSize = 36 }) => {
    const { userData, removeUser } = useAuth()
    const performLogout = usePerformLogout()

    const [menuOpen, setMenuOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null)
    const wrapRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    const displayName = useMemo(() => userData?.name?.trim() || 'Пользователь', [userData?.name])
    const initials = useMemo(() => initialsFromName(displayName), [displayName])

    const toggleMenu = useCallback(() => {
        setMenuOpen((o) => !o)
    }, [])

    const onLogoutClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setMenuOpen(false)
        setConfirmOpen(true)
    }, [])

    const updateMenuPosition = useCallback(() => {
        const el = wrapRef.current
        if (!el) return
        setMenuPos(computeMenuPosition(el))
    }, [])

    useLayoutEffect(() => {
        if (!menuOpen) {
            setMenuPos(null)
            return
        }
        updateMenuPosition()
        window.addEventListener('resize', updateMenuPosition)
        return () => window.removeEventListener('resize', updateMenuPosition)
    }, [menuOpen, updateMenuPosition])

    useEffect(() => {
        if (!menuOpen) return
        const onDocPointerDown = (e: PointerEvent) => {
            const t = e.target as Node
            if (wrapRef.current?.contains(t) || menuRef.current?.contains(t)) return
            setMenuOpen(false)
        }
        document.addEventListener('pointerdown', onDocPointerDown, true)
        return () => document.removeEventListener('pointerdown', onDocPointerDown, true)
    }, [menuOpen])

    useEffect(() => {
        if (!menuOpen) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenuOpen(false)
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [menuOpen])

    if (!userData) {
        removeUser()
        return null
    }

    const menuPortal =
        menuOpen &&
        menuPos &&
        createPortal(
            <div
                ref={menuRef}
                id='sidebar-user-menu'
                className={styles.menuPanel}
                role='menu'
                aria-label='Действия аккаунта'
                style={{ top: menuPos.top, left: menuPos.left }}
            >
                <button
                    type='button'
                    className={styles.logoutBtn}
                    role='menuitem'
                    onClick={onLogoutClick}
                >
                    Выйти
                </button>
            </div>,
            document.body,
        )

    return (
        <>
            <LogoutConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={performLogout}
            />
            {menuPortal}
            <div
                ref={wrapRef}
                className={styles.wrap}
            >
                <IconButton
                    type='button'
                    size='small'
                    onClick={toggleMenu}
                    aria-haspopup='menu'
                    aria-controls={menuOpen ? 'sidebar-user-menu' : undefined}
                    aria-expanded={menuOpen}
                    aria-label='Меню пользователя'
                    className={styles.iconBtn}
                >
                    <Avatar
                        alt={displayName}
                        sx={{
                            width: avatarSize,
                            height: avatarSize,
                            bgcolor: 'var(--primary-color)',
                            color: 'var(--text-color-light, #fff)',
                            fontSize: avatarSize > 32 ? '0.9rem' : '0.75rem',
                            fontWeight: 600,
                        }}
                    >
                        {initials}
                    </Avatar>
                </IconButton>
            </div>
        </>
    )
})
