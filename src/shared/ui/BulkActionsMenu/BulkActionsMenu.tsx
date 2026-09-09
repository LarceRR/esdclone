import styles from './BulkActionsMenu.module.css'
import { useEffect, useRef, useState } from 'react'

export interface BulkActionMenuItem {
    id: string
    label: string
    danger?: boolean
}

interface BulkActionsMenuProps {
    label?: string
    triggerClassName?: string
    wrapperClassName?: string
    disabled?: boolean
    items: BulkActionMenuItem[]
    onSelect: (id: string) => void
}

export const BulkActionsMenu = ({
    label = 'Массовые действия',
    triggerClassName = '',
    wrapperClassName = '',
    disabled = false,
    items,
    onSelect,
}: BulkActionsMenuProps) => {
    const [open, setOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return undefined

        const handlePointerDown = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handlePointerDown)
        return () => document.removeEventListener('mousedown', handlePointerDown)
    }, [open])

    const handleSelect = (id: string) => {
        setOpen(false)
        onSelect(id)
    }

    return (
        <div
            className={`${styles.root} ${wrapperClassName}`.trim()}
            ref={rootRef}
        >
            <button
                className={`${styles.trigger} ${triggerClassName}`.trim()}
                type='button'
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
            >
                <span>{label}</span>
                <span className={styles.caret} aria-hidden />
            </button>

            {open ? (
                <div className={styles.menu}>
                    {items.map((item) => (
                        <button
                            key={item.id}
                            type='button'
                            className={item.danger ? styles.dangerItem : undefined}
                            onClick={() => handleSelect(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    )
}
