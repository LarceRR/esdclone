import { ModalSample } from '@/shared/ui/ModalSample'
import { PageLoader } from '@/shared/ui/PageLoader'
import tableStyles from '../../SalesListModule/SalesListModule.module.css'
import styles from '../WalletModule.module.css'
import type { IWalletTransactionDetail } from '@/shared/api/list/walletApi/types.ts'

interface WalletTransactionShowModalProps {
    open: boolean
    isLoading: boolean
    detail: IWalletTransactionDetail | null
    onClose: () => void
    onConfirm?: () => void
    onReject?: () => void
    isProcessing?: boolean
    canProcess?: boolean
}

export const WalletTransactionShowModal = ({
    open,
    isLoading,
    detail,
    onClose,
    onConfirm,
    onReject,
    isProcessing,
    canProcess,
}: WalletTransactionShowModalProps) => (
    <ModalSample
        title={detail?.order_no ? `Заявка ${detail.order_no}` : 'Просмотр заявки'}
        toggleModal={open}
        onCloseModal={onClose}
        style={{ width: 'min(44rem, calc(100vw - 1.5rem))' }}
    >
        <div className={styles.modalBody}>
            <PageLoader active={isLoading || Boolean(isProcessing)} />
            {detail ? (
                <div className={styles.detailGrid}>
                    <DetailItem
                        label='Тип'
                        value={detail.type === 'deposit' ? 'Пополнение' : 'Вывод'}
                    />
                    <DetailItem
                        label='Статус'
                        value={detail.status_label}
                    />
                    <DetailItem
                        label='Сумма'
                        value={`${detail.amount} ${detail.currency}`}
                    />
                    <DetailItem
                        label='Сеть'
                        value={detail.network}
                    />
                    <DetailItem
                        label='Адрес'
                        value={detail.address}
                    />
                    {detail.actual_received !== null ? (
                        <DetailItem
                            label='Фактически получено'
                            value={`${detail.actual_received} ${detail.currency}`}
                        />
                    ) : null}
                    {Number(detail.service_fee) > 0 ? (
                        <DetailItem
                            label='Комиссия'
                            value={`${detail.service_fee} ${detail.currency}`}
                        />
                    ) : null}
                    <DetailItem
                        label='Создано'
                        value={detail.created_at}
                    />
                    <DetailItem
                        label='Завершено'
                        value={detail.completed_at ?? '—'}
                    />
                    {detail.remarks ? (
                        <DetailItem
                            label='Примечания'
                            value={detail.remarks}
                        />
                    ) : null}
                    {detail.proof_url ? (
                        <div className={styles.proofBlock}>
                            <span className={styles.detailLabel}>Чек</span>
                            <a
                                className={styles.proofLink}
                                href={detail.proof_url}
                                target='_blank'
                                rel='noreferrer'
                            >
                                Просмотреть подтверждение оплаты
                            </a>
                        </div>
                    ) : null}
                </div>
            ) : null}
            <div className={tableStyles.filterActions}>
                {canProcess && detail?.status === 'pending' ? (
                    <>
                        <button
                            className={tableStyles.primaryButton}
                            type='button'
                            disabled={isProcessing}
                            onClick={onConfirm}
                        >
                            Подтвердить
                        </button>
                        <button
                            className={tableStyles.secondaryButton}
                            type='button'
                            disabled={isProcessing}
                            onClick={onReject}
                        >
                            Отклонить
                        </button>
                    </>
                ) : null}
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
