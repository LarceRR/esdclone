import styles from './RecordFundModule.module.css'
import tableStyles from '../SalesListModule/SalesListModule.module.css'
import { normalizeFilterDate } from './filterUtils'
import { formatBalance, formatSignedAmount } from './mockData'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { FilterAltOutlineIcon } from '@/shared/ui/icons/FilterAltOutlineIcon'
import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { PageLoader } from '@/shared/ui/PageLoader'
import { useToast } from '@/shared/lib/hooks/toast'
import {
    useCreateFundRecordMutation,
    useGetFundRecordMutation,
    useGetFundRecordsListQuery,
    useReverseFundRecordMutation,
} from '@/shared/api'
import { fundOrderTypes, type IFundRecordListItem } from '@/shared/api/list/fundRecordApi/types.ts'
import { FundRecordCreateModal, FundRecordShowModal } from './ui/FundRecordModals'

interface RecordFundRow {
    id: number
    orderType: string
    serialNumber: string
    amountChange: number
    beforeChange: number
    afterChange: number
    changeTime: string
    reversalOfId: number | null
    isReversed: boolean
}

const mapRow = (item: IFundRecordListItem): RecordFundRow => ({
    id: item.id,
    orderType: item.order_type,
    serialNumber: item.serial_number,
    amountChange: Number(item.amount_change),
    beforeChange: Number(item.balance_before),
    afterChange: Number(item.balance_after),
    changeTime: item.changed_at,
    reversalOfId: item.reversal_of_id,
    isReversed: item.is_reversed,
})

const getErrorMessage = (err: unknown, fallback: string) => {
    if (typeof err === 'object' && err !== null && 'data' in err) {
        const data = (err as { data?: { message?: string } }).data
        if (data?.message) return data.message
    }

    return fallback
}

const toApiDateTime = (value: string) => {
    if (!value) return undefined
    const normalized = value.includes('T') ? value.replace('T', ' ') : value
    return normalized.length === 16 ? `${normalized}:00` : normalized
}

const RecordFundModule = () => {
    useSetPageTitle('Фонд записи')
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()

    const [orderTypeFilter, setOrderTypeFilter] = useState('all')
    const [startDateFilter, setStartDateFilter] = useState('')
    const [endDateFilter, setEndDateFilter] = useState('')
    const [appliedFilters, setAppliedFilters] = useState({
        orderType: 'all',
        startDate: '',
        endDate: '',
    })
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [openedOperationId, setOpenedOperationId] = useState<number | null>(null)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [viewId, setViewId] = useState<number | null>(null)
    const [createOrderType, setCreateOrderType] = useState<string>(fundOrderTypes[0])
    const [createAmount, setCreateAmount] = useState('')
    const [createChangedAt, setCreateChangedAt] = useState('')

    const { data: listResponse, isFetching, isError } = useGetFundRecordsListQuery({
        order_type: appliedFilters.orderType !== 'all' ? appliedFilters.orderType : undefined,
        date_from: appliedFilters.startDate || undefined,
        date_to: appliedFilters.endDate || undefined,
        page,
        per_page: rowsPerPage,
    })

    const [createFundRecord, { isLoading: isCreating }] = useCreateFundRecordMutation()
    const [reverseFundRecord, { isLoading: isReversing }] = useReverseFundRecordMutation()
    const [getFundRecord, { data: showResponse, isLoading: isShowLoading }] = useGetFundRecordMutation()

    const rows = useMemo(() => (listResponse?.data ?? []).map(mapRow), [listResponse?.data])
    const total = listResponse?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / rowsPerPage))
    const safePage = Math.min(page, totalPages)
    const isAllRowsSelected = rows.length > 0 && rows.every((row) => selectedRows.includes(row.id))

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
            TOAST_ERROR('Не удалось загрузить записи фонда')
        }
    }, [isError, TOAST_ERROR])

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages)
        }
    }, [page, totalPages])

    useEffect(() => {
        if (viewId !== null) {
            void getFundRecord(viewId)
        }
    }, [viewId, getFundRecord])

    const applyFilters = () => {
        const startDate = normalizeFilterDate(startDateFilter)
        const endDate = normalizeFilterDate(endDateFilter)

        if (startDate && endDate && startDate > endDate) {
            setAppliedFilters({
                orderType: orderTypeFilter,
                startDate: endDate,
                endDate: startDate,
            })
            setStartDateFilter(endDate)
            setEndDateFilter(startDate)
        } else {
            setAppliedFilters({
                orderType: orderTypeFilter,
                startDate,
                endDate,
            })
        }

        setPage(1)
        setIsMobileFiltersOpen(false)
    }

    const resetFilters = () => {
        setOrderTypeFilter('all')
        setStartDateFilter('')
        setEndDateFilter('')
        setAppliedFilters({ orderType: 'all', startDate: '', endDate: '' })
        setPage(1)
    }

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

    const openCreateModal = () => {
        setCreateOrderType(fundOrderTypes[0])
        setCreateAmount('')
        setCreateChangedAt('')
        setIsCreateOpen(true)
    }

    const handleCreate = async () => {
        const parsedAmount = Number(createAmount)
        if (!Number.isFinite(parsedAmount) || parsedAmount === 0) {
            TOAST_ERROR('Укажите ненулевую сумму изменения')
            return
        }

        try {
            const response = await createFundRecord({
                order_type: createOrderType,
                amount_change: parsedAmount,
                changed_at: toApiDateTime(createChangedAt),
            }).unwrap()

            if (response.code !== 200) {
                TOAST_ERROR(response.message || 'Не удалось создать запись')
                return
            }

            TOAST_SUCCESS(response.message || 'Запись создана')
            setIsCreateOpen(false)
        } catch (err) {
            TOAST_ERROR(getErrorMessage(err, 'Не удалось создать запись'))
        }
    }

    const handleReverse = async (row: RecordFundRow) => {
        if (!window.confirm(`Сторнировать операцию #${row.id}?`)) {
            return
        }

        try {
            const response = await reverseFundRecord(row.id).unwrap()

            if (response.code !== 200) {
                TOAST_ERROR(response.message || 'Не удалось создать сторно')
                return
            }

            TOAST_SUCCESS(response.message || 'Сторно создано')
            setOpenedOperationId(null)
        } catch (err) {
            TOAST_ERROR(getErrorMessage(err, 'Не удалось создать сторно'))
        }
    }

    const openView = (row: RecordFundRow) => {
        setViewId(row.id)
        setOpenedOperationId(null)
    }

    const showDetail = showResponse?.data

    return (
        <div className={styles.RecordFundModule}>
            <PageLoader active={isFetching || isCreating || isReversing} />

            <div className={tableStyles.mobileFilterBar}>
                <button
                    className={isMobileFiltersOpen ? tableStyles.mobileFilterButtonActive : tableStyles.mobileFilterButton}
                    type='button'
                    onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
                >
                    <FilterAltOutlineIcon
                        size={15}
                        strokeWidth={0.5}
                    />
                    Фильтры
                </button>
            </div>

            <section className={`${tableStyles.filtersPanel} ${isMobileFiltersOpen ? tableStyles.filtersPanelOpen : ''}`}>
                <div className={styles.recordFundFiltersGrid}>
                    <label className={tableStyles.filterField}>
                        <span>Тип заказа</span>
                        <select
                            value={orderTypeFilter}
                            onChange={(event) => setOrderTypeFilter(event.target.value)}
                        >
                            <option value='all'>Все</option>
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
                    <div
                        className={tableStyles.dateRange}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                applyFilters()
                            }
                        }}
                    >
                        <span>Время заказа</span>
                        <input
                            type='date'
                            value={startDateFilter}
                            onChange={(event) => setStartDateFilter(event.target.value)}
                        />
                        <b>до</b>
                        <input
                            type='date'
                            value={endDateFilter}
                            onChange={(event) => setEndDateFilter(event.target.value)}
                        />
                    </div>
                </div>

                <div className={tableStyles.filterActions}>
                    <button
                        className={tableStyles.primaryButton}
                        type='button'
                        onClick={applyFilters}
                    >
                        Найти
                    </button>
                    <button
                        className={tableStyles.secondaryButton}
                        type='button'
                        onClick={resetFilters}
                    >
                        Сбросить
                    </button>
                </div>
            </section>

            <section className={tableStyles.tablePanel}>
                <div className={tableStyles.tableToolbar}>
                    <div className={tableStyles.tableToolbarActions}>
                        <button
                            className={tableStyles.createButton}
                            type='button'
                            onClick={openCreateModal}
                        >
                            Создать операцию
                        </button>
                    </div>
                </div>

                <div className={`${tableStyles.tableWrap} ${styles.recordTableWrap}`}>
                    <table className={`${tableStyles.ordersTable} ${styles.recordTable}`}>
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type='checkbox'
                                        checked={isAllRowsSelected}
                                        onChange={toggleAllRows}
                                    />
                                </th>
                                <th>Тип заказа</th>
                                <th>Серийный номер</th>
                                <th>Сумма изменения</th>
                                <th>До изменения</th>
                                <th>После изменения</th>
                                <th>Время изменения</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <RecordFundTableRow
                                    key={row.id}
                                    row={row}
                                    selected={selectedRows.includes(row.id)}
                                    isOperationOpen={openedOperationId === row.id}
                                    onToggleRow={() => toggleRow(row.id)}
                                    onToggleOperation={(event) => {
                                        event.stopPropagation()
                                        setOpenedOperationId((prev) => (prev === row.id ? null : row.id))
                                    }}
                                    onView={() => openView(row)}
                                    onReverse={() => void handleReverse(row)}
                                />
                            ))}
                            {!rows.length && !isFetching ? (
                                <tr>
                                    <td
                                        colSpan={8}
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

            <FundRecordCreateModal
                open={isCreateOpen}
                isSaving={isCreating}
                orderType={createOrderType}
                amountChange={createAmount}
                changedAt={createChangedAt}
                onClose={() => setIsCreateOpen(false)}
                onOrderTypeChange={setCreateOrderType}
                onAmountChange={setCreateAmount}
                onChangedAtChange={setCreateChangedAt}
                onSubmit={() => void handleCreate()}
            />

            <FundRecordShowModal
                open={viewId !== null}
                isLoading={isShowLoading}
                orderType={showDetail?.order_type ?? ''}
                serialNumber={showDetail?.serial_number ?? ''}
                amountChange={showDetail ? Number(showDetail.amount_change) : 0}
                balanceBefore={showDetail ? Number(showDetail.balance_before) : 0}
                balanceAfter={showDetail ? Number(showDetail.balance_after) : 0}
                changedAt={showDetail?.changed_at ?? ''}
                reversalOfId={showDetail?.reversal_of_id ?? null}
                referenceType={showDetail?.reference_type ?? null}
                referenceId={showDetail?.reference_id ?? null}
                createdBy={showDetail?.created_by ?? null}
                onClose={() => setViewId(null)}
            />
        </div>
    )
}

interface RecordFundTableRowProps {
    row: RecordFundRow
    selected: boolean
    isOperationOpen: boolean
    onToggleRow: () => void
    onToggleOperation: (event: MouseEvent<HTMLButtonElement>) => void
    onView: () => void
    onReverse: () => void
}

const canReverse = (row: RecordFundRow) => row.reversalOfId === null && !row.isReversed

const RecordFundTableRow = ({
    row,
    selected,
    isOperationOpen,
    onToggleRow,
    onToggleOperation,
    onView,
    onReverse,
}: RecordFundTableRowProps) => (
    <tr>
        <td>
            <input
                type='checkbox'
                checked={selected}
                onChange={onToggleRow}
            />
        </td>
        <td>
            {row.orderType}
            {row.reversalOfId ? <span className={styles.reversalBadge}>Сторно</span> : null}
        </td>
        <td className={styles.serialNumber}>{row.serialNumber}</td>
        <td className={row.amountChange >= 0 ? styles.amountPositive : styles.amountNegative}>
            {formatSignedAmount(row.amountChange)}
        </td>
        <td>{formatBalance(row.beforeChange)}</td>
        <td>{formatBalance(row.afterChange)}</td>
        <td>{row.changeTime}</td>
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
                    {canReverse(row) ? (
                        <button
                            type='button'
                            onClick={onReverse}
                        >
                            Сторнировать
                        </button>
                    ) : null}
                </div>
            ) : null}
        </td>
    </tr>
)

export default RecordFundModule
