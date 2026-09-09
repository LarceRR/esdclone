import { ModalSample } from '@/shared/ui/ModalSample'
import { PageLoader } from '@/shared/ui/PageLoader'
import tableStyles from '../../SalesListModule/SalesListModule.module.css'
import styles from '../RecordFundModule.module.css'
import { fundOrderTypes } from '@/shared/api/list/fundRecordApi/types.ts'
import { formatBalance, formatSignedAmount } from '../mockData'

interface FundRecordCreateModalProps {
    open: boolean
    isSaving: boolean
    orderType: string
    amountChange: string
    changedAt: string
    onClose: () => void
    onOrderTypeChange: (value: string) => void
    onAmountChange: (value: string) => void
    onChangedAtChange: (value: string) => void
    onSubmit: () => void
}

export const FundRecordCreateModal = ({
    open,
    isSaving,
    orderType,
    amountChange,
    changedAt,
    onClose,
    onOrderTypeChange,
    onAmountChange,
    onChangedAtChange,
    onSubmit,
}: FundRecordCreateModalProps) => (
    <ModalSample
        title='Создать операцию'
        toggleModal={open}
        onCloseModal={onClose}
        style={{ width: 'min(42rem, calc(100vw - 1.5rem))' }}
    >
        <div className={styles.modalBody}>
            <PageLoader active={isSaving} />
            <div className={styles.formGrid}>
                <label className={styles.formField}>
                    <span>Тип заказа *</span>
                    <select
                        value={orderType}
                        onChange={(event) => onOrderTypeChange(event.target.value)}
                    >
                        {fundOrderTypes.map((type) => (
                            <option
                                value={type}
                                key={type}
                            >
                                {type}
                            </option>
                        ))}
                    </select>
                </label>
                <label className={styles.formField}>
                    <span>Сумма изменения *</span>
                    <input
                        type='number'
                        step='0.01'
                        placeholder='Положительная или отрицательная'
                        value={amountChange}
                        onChange={(event) => onAmountChange(event.target.value)}
                    />
                </label>
                <label className={styles.formField}>
                    <span>Время изменения</span>
                    <input
                        type='datetime-local'
                        value={changedAt}
                        onChange={(event) => onChangedAtChange(event.target.value)}
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

interface FundRecordShowModalProps {
    open: boolean
    isLoading: boolean
    orderType: string
    serialNumber: string
    amountChange: number
    balanceBefore: number
    balanceAfter: number
    changedAt: string
    reversalOfId: number | null
    referenceType: string | null
    referenceId: number | null
    createdBy: number | null
    onClose: () => void
}

export const FundRecordShowModal = ({
    open,
    isLoading,
    orderType,
    serialNumber,
    amountChange,
    balanceBefore,
    balanceAfter,
    changedAt,
    reversalOfId,
    referenceType,
    referenceId,
    createdBy,
    onClose,
}: FundRecordShowModalProps) => (
    <ModalSample
        title={serialNumber ? `Операция: ${serialNumber.slice(0, 12)}…` : 'Просмотр операции'}
        toggleModal={open}
        onCloseModal={onClose}
        style={{ width: 'min(42rem, calc(100vw - 1.5rem))' }}
    >
        <div className={styles.modalBody}>
            <PageLoader active={isLoading} />
            {serialNumber ? (
                <div className={styles.detailGrid}>
                    <DetailItem
                        label='Тип заказа'
                        value={orderType}
                    />
                    <DetailItem
                        label='Серийный номер'
                        value={serialNumber}
                    />
                    <DetailItem
                        label='Сумма изменения'
                        value={formatSignedAmount(amountChange)}
                    />
                    <DetailItem
                        label='До изменения'
                        value={formatBalance(balanceBefore)}
                    />
                    <DetailItem
                        label='После изменения'
                        value={formatBalance(balanceAfter)}
                    />
                    <DetailItem
                        label='Время изменения'
                        value={changedAt}
                    />
                    {reversalOfId ? (
                        <DetailItem
                            label='Сторно для записи'
                            value={`#${reversalOfId}`}
                        />
                    ) : null}
                    {referenceType ? (
                        <DetailItem
                            label='Ссылка'
                            value={`${referenceType}${referenceId ? ` #${referenceId}` : ''}`}
                        />
                    ) : null}
                    {createdBy ? (
                        <DetailItem
                            label='Создал'
                            value={`Пользователь #${createdBy}`}
                        />
                    ) : null}
                </div>
            ) : null}
            <div className={tableStyles.filterActions}>
                <button
                    className={tableStyles.secondaryButton}
                    type='button'
                    onClick={onClose}
                >
                    Закрыть
                </button>
            </div>
        </div>
    </ModalSample>
)

const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className={styles.detailItem}>
        <span className={styles.detailLabel}>{label}</span>
        <span className={styles.detailValue}>{value}</span>
    </div>
)
