import { ModalSample } from '@/shared/ui/ModalSample'
import styles from '../ProductWarehouseModule.module.css'
import { useEffect, useState } from 'react'
import { usePublishWarehouseProductsMutation } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'

interface AddProductsModalProps {
    open: boolean
    targetIds: number[]
    onClose: () => void
    onPublished: () => void
}

const getErrorMessage = (err: unknown, fallback: string) => {
    if (typeof err === 'object' && err !== null && 'data' in err) {
        const data = (err as { data?: { message?: string } }).data
        if (data?.message) return data.message
    }

    return fallback
}

export const AddProductsModal = ({ open, targetIds, onClose, onPublished }: AddProductsModalProps) => {
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const [profitRatio, setProfitRatio] = useState('')
    const [discountStartDate, setDiscountStartDate] = useState('')
    const [discountEndDate, setDiscountEndDate] = useState('')
    const [discountPercent, setDiscountPercent] = useState('')
    const [publishProducts, { isLoading }] = usePublishWarehouseProductsMutation()

    useEffect(() => {
        if (!open) {
            setProfitRatio('')
            setDiscountStartDate('')
            setDiscountEndDate('')
            setDiscountPercent('')
        }
    }, [open])

    const handleConfirm = async () => {
        const parsedProfit = Number(profitRatio.replace(',', '.'))

        if (!Number.isFinite(parsedProfit) || parsedProfit <= 0 || parsedProfit > 100) {
            TOAST_ERROR('Укажите долю прибыли от 0.01% до 100%')
            return
        }

        const parsedDiscount = discountPercent.trim()
            ? Number(discountPercent.replace(',', '.'))
            : undefined

        if (parsedDiscount !== undefined && (!Number.isFinite(parsedDiscount) || parsedDiscount <= 0 || parsedDiscount > 100)) {
            TOAST_ERROR('Доля скидки должна быть от 0.01% до 100%')
            return
        }

        try {
            const response = await publishProducts({
                ids: targetIds,
                profit_ratio: parsedProfit,
                discount_start_at: discountStartDate || undefined,
                discount_end_at: discountEndDate || undefined,
                discount_percent: parsedDiscount,
            }).unwrap()

            const { published, skipped } = response.data

            if (skipped.length > 0) {
                TOAST_SUCCESS(`${response.message}. Опубликовано: ${published}, пропущено: ${skipped.length}`)
            } else {
                TOAST_SUCCESS(response.message)
            }

            onPublished()
            onClose()
        } catch (error) {
            TOAST_ERROR(getErrorMessage(error, 'Не удалось опубликовать товары'))
        }
    }

    return (
        <ModalSample
            title='Добавить товары'
            toggleModal={open}
            onCloseModal={onClose}
            style={{ width: 'min(32rem, calc(100vw - 1.5rem))' }}
        >
            <div className={styles.addModal}>
                {targetIds.length > 1 ? (
                    <p className={styles.addModalSelected}>Выбрано товаров: {targetIds.length}</p>
                ) : null}

                <label className={styles.modalField}>
                    <span className={styles.modalLabel}>
                        Доля прибыли <b>*</b>
                    </span>
                    <div className={styles.inputWithSuffix}>
                        <input
                            type='text'
                            inputMode='decimal'
                            placeholder='Введите долю прибыли'
                            value={profitRatio}
                            onChange={(event) => setProfitRatio(event.target.value)}
                        />
                        <span>%</span>
                    </div>
                    <span className={styles.modalHint}>
                        Добавьте выбранный товар в магазин и укажите долю прибыли
                    </span>
                    <span className={styles.modalSuggested}>
                        Рекомендуемая доля прибыли: <b>5.0% — 28.0%</b>
                    </span>
                </label>

                <label className={styles.modalField}>
                    <span className={styles.modalLabel}>Дата скидки</span>
                    <div className={styles.modalDateRange}>
                        <input
                            type='date'
                            value={discountStartDate}
                            onChange={(event) => setDiscountStartDate(event.target.value)}
                        />
                        <b>до</b>
                        <input
                            type='date'
                            value={discountEndDate}
                            min={discountStartDate || undefined}
                            onChange={(event) => setDiscountEndDate(event.target.value)}
                        />
                    </div>
                </label>

                <label className={styles.modalField}>
                    <span className={styles.modalLabel}>Доля скидки</span>
                    <div className={styles.inputWithSuffix}>
                        <input
                            type='text'
                            inputMode='decimal'
                            placeholder='Введите долю скидки'
                            value={discountPercent}
                            onChange={(event) => setDiscountPercent(event.target.value)}
                        />
                        <span>%</span>
                    </div>
                </label>

                <div className={styles.modalActions}>
                    <button
                        className={styles.modalConfirmButton}
                        type='button'
                        disabled={isLoading}
                        onClick={handleConfirm}
                    >
                        {isLoading ? 'Публикация…' : 'Подтвердить'}
                    </button>
                    <button
                        className={styles.modalCancelButton}
                        type='button'
                        disabled={isLoading}
                        onClick={onClose}
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </ModalSample>
    )
}
