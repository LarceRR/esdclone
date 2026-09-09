import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/store'
import { shopContextActions } from '@/shared/store/slices/shopContextSlice.ts'
import { dashboardApi } from '@/shared/api/list/dashboardApi'
import type { IShopListItem } from '@/shared/api/list/shopApi/types.ts'
import styles from './ShopTitleSelect.module.css'

interface ShopTitleSelectProps {
    shops: IShopListItem[]
}

export const ShopTitleSelect = ({ shops }: ShopTitleSelectProps) => {
    const dispatch = useAppDispatch()
    const selectedSellerId = useAppSelector((state) => state.shopContext.selectedSellerId)
    const [open, setOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)

    const activeSellerId = selectedSellerId ?? shops[0]?.seller_id ?? null

    const selectedShop = useMemo(
        () => shops.find((shop) => shop.seller_id === activeSellerId) ?? shops[0] ?? null,
        [activeSellerId, shops],
    )

    useEffect(() => {
        if (!open) {
            return undefined
        }

        const handlePointerDown = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handlePointerDown)
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('mousedown', handlePointerDown)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [open])

    const handleSelect = (sellerId: number) => {
        if (!Number.isFinite(sellerId) || sellerId <= 0 || sellerId === activeSellerId) {
            setOpen(false)
            return
        }

        dispatch(shopContextActions.setSelectedSellerId(sellerId))
        dispatch(dashboardApi.util.invalidateTags(['Dashboard']))
        setOpen(false)
    }

    if (!selectedShop) {
        return null
    }

    return (
        <span
            className={styles.root}
            ref={rootRef}
        >
            <button
                className={styles.trigger}
                type='button'
                aria-label='Выбор магазина'
                aria-haspopup='listbox'
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
            >
                <span className={styles.triggerLabel}>{selectedShop.name}</span>
                <span
                    className={`${styles.caret} ${open ? styles.caretOpen : ''}`}
                    aria-hidden
                />
            </button>

            {open ? (
                <div
                    className={styles.menu}
                    role='listbox'
                    aria-label='Список магазинов'
                >
                    {shops.map((shop) => {
                        const isActive = shop.seller_id === activeSellerId

                        return (
                            <button
                                key={shop.id}
                                type='button'
                                role='option'
                                aria-selected={isActive}
                                className={isActive ? styles.optionActive : styles.option}
                                onClick={() => handleSelect(shop.seller_id)}
                            >
                                {shop.name}
                            </button>
                        )
                    })}
                </div>
            ) : null}
        </span>
    )
}
