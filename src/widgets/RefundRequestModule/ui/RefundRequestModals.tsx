import { ModalSample } from '@/shared/ui/ModalSample'
import { PageLoader } from '@/shared/ui/PageLoader'
import tableStyles from '../../SalesListModule/SalesListModule.module.css'
import styles from '../RefundRequestModule.module.css'
import { refundReasons, refundStatuses } from '@/shared/api/list/refundRequestApi/types.ts'

interface RefundCreateModalProps {
    open: boolean
    isSaving: boolean
    orderNo: string
    refundReason: string
    refundInstructions: string
    productAmount: string
    onClose: () => void
    onOrderNoChange: (value: string) => void
    onRefundReasonChange: (value: string) => void
    onRefundInstructionsChange: (value: string) => void
    onProductAmountChange: (value: string) => void
    onSubmit: () => void
}

export const RefundCreateModal = ({
    open,
    isSaving,
    orderNo,
    refundReason,
    refundInstructions,
    productAmount,
    onClose,
    onOrderNoChange,
    onRefundReasonChange,
    onRefundInstructionsChange,
    onProductAmountChange,
    onSubmit,
}: RefundCreateModalProps) => (
    <ModalSample
        title='Создать возврат'
        toggleModal={open}
        onCloseModal={onClose}
        style={{ width: 'min(42rem, calc(100vw - 1.5rem))' }}
    >
        <div className={styles.modalBody}>
            <PageLoader active={isSaving} />
            <div className={styles.formGrid}>
                <label className={styles.formField}>
                    <span>Номер заказа *</span>
                    <input
                        type='text'
                        value={orderNo}
                        onChange={(event) => onOrderNoChange(event.target.value)}
                    />
                </label>
                <label className={styles.formField}>
                    <span>Причина возврата *</span>
                    <select
                        value={refundReason}
                        onChange={(event) => onRefundReasonChange(event.target.value)}
                    >
                        {refundReasons.map((reason) => (
                            <option
                                value={reason}
                                key={reason}
                            >
                                {reason}
                            </option>
                        ))}
                    </select>
                </label>
                <label className={styles.formField}>
                    <span>Сумма товара</span>
                    <input
                        type='number'
                        min={0}
                        step='0.01'
                        placeholder='По умолчанию сумма заказа'
                        value={productAmount}
                        onChange={(event) => onProductAmountChange(event.target.value)}
                    />
                </label>
                <label className={`${styles.formField} ${styles.formFieldWide}`}>
                    <span>Инструкции по возврату</span>
                    <textarea
                        rows={3}
                        value={refundInstructions}
                        onChange={(event) => onRefundInstructionsChange(event.target.value)}
                    />
                </label>
            </div>
            <div className={tableStyles.filterActions}>
                <button
                    className={tableStyles.primaryButton}
                    type='button'
                    disabled={isSaving}
                    onClick={onSubmit}
                >
                    Создать
                </button>
                <button
                    className={tableStyles.secondaryButton}
                    type='button'
                    onClick={onClose}
                >
                    Отмена
                </button>
            </div>
        </div>
    </ModalSample>
)

interface RefundShowModalProps {
    open: boolean
    isLoading: boolean
    orderNo: string
    applicationDate: string
    refundReason: string
    refundInstructions: string
    productAmount: string
    status: string
    onClose: () => void
}

export const RefundShowModal = ({
    open,
    isLoading,
    orderNo,
    applicationDate,
    refundReason,
    refundInstructions,
    productAmount,
    status,
    onClose,
}: RefundShowModalProps) => (
    <ModalSample
        title={orderNo ? `Заявка: ${orderNo}` : 'Просмотр заявки'}
        toggleModal={open}
        onCloseModal={onClose}
        style={{ width: 'min(42rem, calc(100vw - 1.5rem))' }}
    >
        <div className={styles.modalBody}>
            <PageLoader active={isLoading} />
            {orderNo ? (
                <div className={styles.detailGrid}>
                    <DetailItem
                        label='Номер заказа'
                        value={orderNo}
                    />
                    <DetailItem
                        label='Дата подачи'
                        value={applicationDate}
                    />
                    <DetailItem
                        label='Статус'
                        value={status}
                    />
                    <DetailItem
                        label='Сумма товара'
                        value={productAmount}
                    />
                    <DetailItem
                        label='Причина возврата'
                        value={refundReason}
                        wide
                    />
                    <DetailItem
                        label='Инструкции'
                        value={refundInstructions || '—'}
                        wide
                    />
                </div>
            ) : null}
        </div>
    </ModalSample>
)

interface RefundProcessModalProps {
    open: boolean
    isSaving: boolean
    orderNo: string
    status: string
    refundInstructions: string
    onClose: () => void
    onStatusChange: (value: string) => void
    onRefundInstructionsChange: (value: string) => void
    onSubmit: () => void
}

export const RefundProcessModal = ({
    open,
    isSaving,
    orderNo,
    status,
    refundInstructions,
    onClose,
    onStatusChange,
    onRefundInstructionsChange,
    onSubmit,
}: RefundProcessModalProps) => (
    <ModalSample
        title={orderNo ? `Обработка: ${orderNo}` : 'Обработать возврат'}
        toggleModal={open}
        onCloseModal={onClose}
        style={{ width: 'min(36rem, calc(100vw - 1.5rem))' }}
    >
        <div className={styles.modalBody}>
            <PageLoader active={isSaving} />
            <div className={styles.formGrid}>
                <label className={styles.formField}>
                    <span>Статус *</span>
                    <select
                        value={status}
                        onChange={(event) => onStatusChange(event.target.value)}
                    >
                        {refundStatuses.map((item) => (
                            <option
                                value={item}
                                key={item}
                            >
                                {item}
                            </option>
                        ))}
                    </select>
                </label>
                <label className={`${styles.formField} ${styles.formFieldWide}`}>
                    <span>Инструкции по возврату</span>
                    <textarea
                        rows={4}
                        value={refundInstructions}
                        onChange={(event) => onRefundInstructionsChange(event.target.value)}
                    />
                </label>
            </div>
            <div className={tableStyles.filterActions}>
                <button
                    className={tableStyles.primaryButton}
                    type='button'
                    disabled={isSaving}
                    onClick={onSubmit}
                >
                    Сохранить
                </button>
                <button
                    className={tableStyles.secondaryButton}
                    type='button'
                    onClick={onClose}
                >
                    Отмена
                </button>
            </div>
        </div>
    </ModalSample>
)

const DetailItem = ({ label, value, wide }: { label: string; value: string; wide?: boolean }) => (
    <div className={wide ? `${styles.detailItem} ${styles.formFieldWide}` : styles.detailItem}>
        <span>{label}</span>
        <b>{value}</b>
    </div>
)

interface RefundBulkProcessModalProps {
    open: boolean
    isSaving: boolean
    selectedCount: number
    status: string
    refundInstructions: string
    onClose: () => void
    onStatusChange: (value: string) => void
    onRefundInstructionsChange: (value: string) => void
    onSubmit: () => void
}

export const RefundBulkProcessModal = ({
    open,
    isSaving,
    selectedCount,
    status,
    refundInstructions,
    onClose,
    onStatusChange,
    onRefundInstructionsChange,
    onSubmit,
}: RefundBulkProcessModalProps) => (
    <ModalSample
        title='Массовая обработка'
        toggleModal={open}
        onCloseModal={onClose}
        style={{ width: 'min(36rem, calc(100vw - 1.5rem))' }}
    >
        <div className={styles.modalBody}>
            <PageLoader active={isSaving} />
            <p className={styles.bulkModalHint}>Будет обработано заявок: {selectedCount}</p>
            <div className={styles.formGrid}>
                <label className={styles.formField}>
                    <span>Новый статус *</span>
                    <select
                        value={status}
                        onChange={(event) => onStatusChange(event.target.value)}
                    >
                        {refundStatuses.map((item) => (
                            <option
                                value={item}
                                key={item}
                            >
                                {item}
                            </option>
                        ))}
                    </select>
                </label>
                <label className={`${styles.formField} ${styles.formFieldWide}`}>
                    <span>Инструкции по возврату</span>
                    <textarea
                        rows={4}
                        placeholder='Оставьте пустым, чтобы не менять инструкции'
                        value={refundInstructions}
                        onChange={(event) => onRefundInstructionsChange(event.target.value)}
                    />
                </label>
            </div>
            <div className={tableStyles.filterActions}>
                <button
                    className={tableStyles.primaryButton}
                    type='button'
                    disabled={isSaving}
                    onClick={onSubmit}
                >
                    Применить
                </button>
                <button
                    className={tableStyles.secondaryButton}
                    type='button'
                    onClick={onClose}
                >
                    Отмена
                </button>
            </div>
        </div>
    </ModalSample>
)
