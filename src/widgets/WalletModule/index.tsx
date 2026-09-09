import styles from './WalletModule.module.css'
import tableStyles from '../SalesListModule/SalesListModule.module.css'
import { formatAmountWithCurrency, formatWalletMoney } from './mockData'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { ELinks } from '@/shared/constants/appLinks.ts'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import SavingsIcon from '@mui/icons-material/Savings'
import { PageLoader } from '@/shared/ui/PageLoader'
import { useToast } from '@/shared/lib/hooks/toast'
import { useAppSelector } from '@/shared/store'
import {
    useConfirmWalletTransactionMutation,
    useGetWalletSummaryQuery,
    useGetWalletTransactionMutation,
    useGetWalletTransactionsListQuery,
    useRejectWalletTransactionMutation,
} from '@/shared/api'
import type { IWalletTransactionListItem } from '@/shared/api/list/walletApi/types.ts'
import { WalletTransactionShowModal } from './ui/WalletTransactionModals'

type WalletTab = 'deposit' | 'withdraw'

const tabs: { id: WalletTab; label: string }[] = [
    { id: 'deposit', label: 'Пополнить' },
    { id: 'withdraw', label: 'Вывести' },
]

interface WalletRow {
    id: number
    orderNo: string
    amount: string
    network: string
    status: IWalletTransactionListItem['status']
    statusLabel: string
    actualReceived: string | null
    address: string
    completedAt: string
    createdAt: string
    remarks: string
}

const mapRow = (item: IWalletTransactionListItem): WalletRow => ({
    id: item.id,
    orderNo: item.order_no,
    amount: formatAmountWithCurrency(item.amount, item.currency),
    network: item.network,
    status: item.status,
    statusLabel: item.status_label,
    actualReceived:
        item.actual_received !== null ? formatAmountWithCurrency(item.actual_received, item.currency) : null,
    address: item.address,
    completedAt: item.completed_at ?? '--',
    createdAt: item.created_at,
    remarks: item.remarks ?? '—',
})

const getErrorMessage = (err: unknown, fallback: string) => {
    if (typeof err === 'object' && err !== null && 'data' in err) {
        const data = (err as { data?: { message?: string } }).data
        if (data?.message) return data.message
    }

    return fallback
}

const WalletModule = () => {
    useSetPageTitle('Мой бумажник')
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const userData = useAppSelector((state) => state.auth.data)
    const canProcess = userData?.role === 'superadmin'

    const [activeTab, setActiveTab] = useState<WalletTab>('deposit')
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [openedOperationId, setOpenedOperationId] = useState<number | null>(null)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [viewId, setViewId] = useState<number | null>(null)

    const { data: summaryResponse, isFetching: isSummaryLoading } = useGetWalletSummaryQuery()
    const { data: listResponse, isFetching, isError } = useGetWalletTransactionsListQuery({
        type: activeTab,
        page,
        per_page: rowsPerPage,
    })

    const [getWalletTransaction, { data: showResponse, isLoading: isShowLoading }] = useGetWalletTransactionMutation()
    const [confirmWalletTransaction, { isLoading: isConfirming }] = useConfirmWalletTransactionMutation()
    const [rejectWalletTransaction, { isLoading: isRejecting }] = useRejectWalletTransactionMutation()

    const rows = useMemo(() => (listResponse?.data ?? []).map(mapRow), [listResponse?.data])
    const total = listResponse?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / rowsPerPage))
    const safePage = Math.min(page, totalPages)
    const isAllRowsSelected = rows.length > 0 && rows.every((row) => selectedRows.includes(row.id))

    const balance = summaryResponse?.data.balance ?? 0
    const accumulatedIncome = summaryResponse?.data.accumulated_income ?? 0
    const amountColumnLabel = activeTab === 'deposit' ? 'Сумма пополнения' : 'Сумма вывода'

    const visiblePages = useMemo(() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)
        if (safePage <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
        if (safePage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        return [1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages]
    }, [safePage, totalPages])

    useEffect(() => {
        const handleDocumentClick = () => setOpenedOperationId(null)
        document.addEventListener('click', handleDocumentClick)
        return () => document.removeEventListener('click', handleDocumentClick)
    }, [])

    useEffect(() => {
        if (isError) {
            TOAST_ERROR('Не удалось загрузить заявки кошелька')
        }
    }, [isError, TOAST_ERROR])

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages)
        }
    }, [page, totalPages])

    useEffect(() => {
        if (viewId !== null) {
            void getWalletTransaction(viewId)
        }
    }, [viewId, getWalletTransaction])

    const toggleAllRows = () => {
        const filteredIds = rows.map((row) => row.id)
        setSelectedRows((prev) => {
            if (isAllRowsSelected) return prev.filter((id) => !filteredIds.includes(id))
            return Array.from(new Set([...prev, ...filteredIds]))
        })
    }

    const toggleRow = (rowId: number) => {
        setSelectedRows((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]))
    }

    const openView = (row: WalletRow) => {
        setViewId(row.id)
        setOpenedOperationId(null)
    }

    const handleConfirm = async (transactionId = viewId) => {
        if (transactionId === null) return

        try {
            const response = await confirmWalletTransaction(transactionId).unwrap()
            if (response.code !== 200) {
                TOAST_ERROR(response.message || 'Не удалось подтвердить заявку')
                return
            }
            TOAST_SUCCESS(response.message || 'Заявка подтверждена')
            if (viewId === transactionId) {
                void getWalletTransaction(transactionId)
            }
            setOpenedOperationId(null)
        } catch (err) {
            TOAST_ERROR(getErrorMessage(err, 'Не удалось подтвердить заявку'))
        }
    }

    const handleReject = async (transactionId = viewId) => {
        if (transactionId === null) return

        const remarks = window.prompt('Причина отклонения (необязательно)') ?? undefined

        try {
            const response = await rejectWalletTransaction({ id: transactionId, remarks }).unwrap()
            if (response.code !== 200) {
                TOAST_ERROR(response.message || 'Не удалось отклонить заявку')
                return
            }
            TOAST_SUCCESS(response.message || 'Заявка отклонена')
            if (viewId === transactionId) {
                void getWalletTransaction(transactionId)
            }
            setOpenedOperationId(null)
        } catch (err) {
            TOAST_ERROR(getErrorMessage(err, 'Не удалось отклонить заявку'))
        }
    }

    return (
        <div className={styles.WalletModule}>
            <PageLoader active={isFetching || isSummaryLoading || isConfirming || isRejecting} />

            <section className={styles.summaryPanel}>
                <div className={styles.summaryStats}>
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryIcon}>
                            <AccountBalanceWalletIcon />
                        </span>
                        <div className={styles.summaryText}>
                            <span>Баланс</span>
                            <strong>{formatWalletMoney(balance)}</strong>
                        </div>
                    </div>
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryIcon}>
                            <SavingsIcon />
                        </span>
                        <div className={styles.summaryText}>
                            <span>Накопленный доход</span>
                            <strong>{formatWalletMoney(accumulatedIncome)}</strong>
                        </div>
                    </div>
                </div>
                <div className={styles.summaryActions}>
                    <Link
                        className={styles.actionLink}
                        to={ELinks.MONEY_DEPOSIT}
                    >
                        Пополнить
                    </Link>
                    <Link
                        className={styles.actionLink}
                        to={ELinks.MONEY_WITHDRAW}
                    >
                        Вывести
                    </Link>
                </div>
            </section>

            <section className={tableStyles.tablePanel}>
                <div className={styles.tableTabsRow}>
                    {tabs.map((tab) => (
                        <button
                            className={activeTab === tab.id ? tableStyles.tabActive : tableStyles.tab}
                            type='button'
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id)
                                setPage(1)
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className={tableStyles.tableWrap}>
                    <table className={`${tableStyles.ordersTable} ${styles.wideTable}`}>
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type='checkbox'
                                        checked={isAllRowsSelected}
                                        onChange={toggleAllRows}
                                    />
                                </th>
                                <th>Номер заказа</th>
                                <th>{amountColumnLabel}</th>
                                <th>Сеть</th>
                                <th>Статус заказа</th>
                                <th>Чек</th>
                                <th>Фактически получено</th>
                                <th>Адрес получения</th>
                                <th>Время завершения</th>
                                <th>Время создания</th>
                                <th>Примечания</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <TransactionRow
                                    key={row.id}
                                    row={row}
                                    selected={selectedRows.includes(row.id)}
                                    isOperationOpen={openedOperationId === row.id}
                                    onToggle={() => toggleRow(row.id)}
                                    onToggleOperation={(event) => {
                                        event.stopPropagation()
                                        setOpenedOperationId((prev) => (prev === row.id ? null : row.id))
                                    }}
                                    onView={() => openView(row)}
                                    canProcess={canProcess}
                                    onConfirm={() => void handleConfirm(row.id)}
                                    onReject={() => void handleReject(row.id)}
                                />
                            ))}
                            {!rows.length && !isFetching ? (
                                <tr>
                                    <td
                                        colSpan={12}
                                        className={tableStyles.emptyCell}
                                    >
                                        Нет данных
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                <div className={tableStyles.pagination}>
                    <div className={tableStyles.paginationMeta}>
                        <span>Всего {total}</span>
                        <select
                            value={rowsPerPage}
                            onChange={(event) => {
                                setRowsPerPage(Number(event.target.value))
                                setPage(1)
                            }}
                        >
                            <option value='10'>10/страница</option>
                            <option value='20'>20/страница</option>
                            <option value='50'>50/страница</option>
                        </select>
                    </div>

                    <div className={tableStyles.paginationPages}>
                        <button
                            type='button'
                            disabled={safePage === 1}
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        >
                            ‹
                        </button>
                        {visiblePages.map((pageItem, index) => (
                            <button
                                className={pageItem === safePage ? tableStyles.pageActive : undefined}
                                type='button'
                                disabled={pageItem === '...'}
                                onClick={() => typeof pageItem === 'number' && setPage(pageItem)}
                                key={`${pageItem}-${index}`}
                            >
                                {pageItem}
                            </button>
                        ))}
                        <button
                            type='button'
                            disabled={safePage === totalPages}
                            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        >
                            ›
                        </button>
                    </div>

                    <div className={tableStyles.paginationJump}>
                        <span>Перейти к</span>
                        <input
                            type='text'
                            value={safePage}
                            onChange={(event) => {
                                const nextPage = Number(event.target.value)
                                if (!Number.isNaN(nextPage)) {
                                    setPage(Math.min(totalPages, Math.max(1, nextPage)))
                                }
                            }}
                        />
                    </div>
                </div>
            </section>

            <WalletTransactionShowModal
                open={viewId !== null}
                isLoading={isShowLoading}
                detail={showResponse?.data ?? null}
                canProcess={canProcess}
                isProcessing={isConfirming || isRejecting}
                onClose={() => setViewId(null)}
                onConfirm={() => void handleConfirm()}
                onReject={() => void handleReject()}
            />
        </div>
    )
}

const AmountCurrency = ({ value }: { value: string | null }) => {
    if (!value || value === '--') {
        return <>--</>
    }

    const match = value.match(/^([\d,.\s]+)\s+([A-Za-z0-9]+)$/)
    if (!match) {
        return <span className={styles.amountValue}>{value}</span>
    }

    return (
        <span className={styles.amountCell}>
            <span className={styles.amountValue}>{match[1]}</span>
            <span className={styles.currencyTag}>{match[2]}</span>
        </span>
    )
}

const statusClassMap = {
    success: styles.statusSuccess,
    failed: styles.statusFailed,
    pending: styles.statusPending,
} as const

interface TransactionRowProps {
    row: WalletRow
    selected: boolean
    isOperationOpen: boolean
    onToggle: () => void
    onToggleOperation: (event: MouseEvent<HTMLButtonElement>) => void
    onView: () => void
    canProcess: boolean
    onConfirm: () => void
    onReject: () => void
}

const TransactionRow = ({
    row,
    selected,
    isOperationOpen,
    onToggle,
    onToggleOperation,
    onView,
    canProcess,
    onConfirm,
    onReject,
}: TransactionRowProps) => (
    <tr>
        <td>
            <input
                type='checkbox'
                checked={selected}
                onChange={onToggle}
            />
        </td>
        <td>{row.orderNo}</td>
        <td>
            <AmountCurrency value={row.amount} />
        </td>
        <td>{row.network}</td>
        <td>
            <span className={statusClassMap[row.status]}>{row.statusLabel}</span>
        </td>
        <td>
            <button
                className={styles.viewLink}
                type='button'
                onClick={onView}
            >
                Просмотреть
            </button>
        </td>
        <td>
            <AmountCurrency value={row.actualReceived} />
        </td>
        <td>{row.address}</td>
        <td>{row.completedAt}</td>
        <td>{row.createdAt}</td>
        <td>{row.remarks}</td>
        <td className={tableStyles.operationCell}>
            <button
                className={tableStyles.operationButton}
                type='button'
                onClick={onToggleOperation}
            >
                Действия
                <span className={tableStyles.operationArrow} />
            </button>
            {isOperationOpen ? (
                <div
                    className={tableStyles.operationMenu}
                    onClick={(event) => event.stopPropagation()}
                >
                    <button
                        type='button'
                        onClick={onView}
                    >
                        Просмотр
                    </button>
                    {canProcess && row.status === 'pending' ? (
                        <>
                            <button
                                type='button'
                                onClick={onConfirm}
                            >
                                Подтвердить
                            </button>
                            <button
                                type='button'
                                onClick={onReject}
                            >
                                Отклонить
                            </button>
                        </>
                    ) : null}
                </div>
            ) : null}
        </td>
    </tr>
)

export default WalletModule
