import styles from './RefundRequestModule.module.css'
import tableStyles from '../SalesListModule/SalesListModule.module.css'
import { formatDateTime, formatPrice } from './mockData'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { FilterAltOutlineIcon } from '@/shared/ui/icons/FilterAltOutlineIcon'
import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { PageLoader } from '@/shared/ui/PageLoader'
import { useToast } from '@/shared/lib/hooks/toast'
import {
    useBulkProcessRefundRequestsMutation,
    useCreateRefundRequestMutation,
    useGetRefundRequestsListQuery,
    useUpdateRefundRequestMutation,
} from '@/shared/api'
import {
    refundReasons,
    refundStatuses,
    type IRefundRequestListItem,
} from '@/shared/api/list/refundRequestApi/types.ts'
import { RefundBulkProcessModal, RefundCreateModal, RefundProcessModal, RefundShowModal } from './ui/RefundRequestModals'

interface RefundRequestRow {
    id: number
    orderNo: string
    applicationDate: string
    refundReason: string
    refundInstructions: string
    productAmount: number
    status: string
}

const mapRow = (item: IRefundRequestListItem): RefundRequestRow => ({
    id: item.id,
    orderNo: item.order_no,
    applicationDate: formatDateTime(item.application_time),
    refundReason: item.refund_reason,
    refundInstructions: item.refund_instructions ?? '',
    productAmount: Number(item.product_amount),
    status: item.status,
})

const getErrorMessage = (err: unknown, fallback: string) => {
    if (typeof err === 'object' && err !== null && 'data' in err) {
        const data = (err as { data?: { message?: string } }).data
        if (data?.message) return data.message
    }

    return fallback
}

const RefundRequestModule = () => {
    useSetPageTitle('Запросы на возврат')
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()

    const [statusFilter, setStatusFilter] = useState('all')
    const [startDateFilter, setStartDateFilter] = useState('')
    const [endDateFilter, setEndDateFilter] = useState('')
    const [appliedFilters, setAppliedFilters] = useState({
        status: 'all',
        startDate: '',
        endDate: '',
    })
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [openedOperationId, setOpenedOperationId] = useState<number | null>(null)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isBulkOpen, setIsBulkOpen] = useState(false)
    const [viewDetail, setViewDetail] = useState<RefundRequestRow | null>(null)
    const [processDetail, setProcessDetail] = useState<RefundRequestRow | null>(null)

    const [createOrderNo, setCreateOrderNo] = useState('')
    const [createReason, setCreateReason] = useState<string>(refundReasons[0])
    const [createInstructions, setCreateInstructions] = useState('')
    const [createAmount, setCreateAmount] = useState('')

    const [processStatus, setProcessStatus] = useState<string>(refundStatuses[0])
    const [processInstructions, setProcessInstructions] = useState('')
    const [bulkStatus, setBulkStatus] = useState<string>(refundStatuses[0])
    const [bulkInstructions, setBulkInstructions] = useState('')

    const { data: listResponse, isFetching, isError } = useGetRefundRequestsListQuery({
        status: appliedFilters.status !== 'all' ? appliedFilters.status : undefined,
        date_from: appliedFilters.startDate || undefined,
        date_to: appliedFilters.endDate || undefined,
        page,
        per_page: rowsPerPage,
    })

    const [createRefundRequest, { isLoading: isCreating }] = useCreateRefundRequestMutation()
    const [updateRefundRequest, { isLoading: isUpdating }] = useUpdateRefundRequestMutation()
    const [bulkProcessRefundRequests, { isLoading: isBulkProcessing }] = useBulkProcessRefundRequestsMutation()

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
            TOAST_ERROR('Не удалось загрузить заявки на возврат')
        }
    }, [isError, TOAST_ERROR])

    const applyFilters = () => {
        setAppliedFilters({
            status: statusFilter,
            startDate: startDateFilter.trim(),
            endDate: endDateFilter.trim(),
        })
        setPage(1)
    }

    const resetFilters = () => {
        setStatusFilter('all')
        setStartDateFilter('')
        setEndDateFilter('')
        setAppliedFilters({ status: 'all', startDate: '', endDate: '' })
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
        setCreateOrderNo('')
        setCreateReason(refundReasons[0])
        setCreateInstructions('')
        setCreateAmount('')
        setIsCreateOpen(true)
    }

    const openBulkModal = () => {
        if (!selectedRows.length) {
            TOAST_ERROR('Выберите хотя бы одну заявку')
            return
        }

        setBulkStatus(refundStatuses[0])
        setBulkInstructions('')
        setIsBulkOpen(true)
    }

    const handleBulkProcess = async () => {
        if (!selectedRows.length) return

        try {
            const response = await bulkProcessRefundRequests({
                ids: selectedRows,
                status: bulkStatus,
                refund_instructions: bulkInstructions.trim() || undefined,
            }).unwrap()

            TOAST_SUCCESS(response.message || `Обновлено заявок: ${response.data.updated}`)
            setSelectedRows([])
            setIsBulkOpen(false)
        } catch (err) {
            TOAST_ERROR(getErrorMessage(err, 'Не удалось выполнить массовую обработку'))
        }
    }

    const handleCreate = async () => {
        if (!createOrderNo.trim()) {
            TOAST_ERROR('Укажите номер заказа')
            return
        }

        try {
            const payload = {
                order_no: createOrderNo.trim(),
                refund_reason: createReason,
                refund_instructions: createInstructions.trim() || undefined,
                product_amount: createAmount ? Number(createAmount) : undefined,
            }

            const response = await createRefundRequest(payload).unwrap()
            TOAST_SUCCESS(response.message || 'Заявка создана')
            setIsCreateOpen(false)
        } catch (err) {
            TOAST_ERROR(getErrorMessage(err, 'Не удалось создать заявку'))
        }
    }

    const handleProcess = async () => {
        if (processDetail == null) return

        try {
            const response = await updateRefundRequest({
                id: processDetail.id,
                status: processStatus,
                refund_instructions: processInstructions.trim() || undefined,
            }).unwrap()

            TOAST_SUCCESS(response.message || 'Заявка обновлена')
            setProcessDetail(null)
        } catch (err) {
            TOAST_ERROR(getErrorMessage(err, 'Не удалось обновить заявку'))
        }
    }

    const openView = (row: RefundRequestRow) => {
        setViewDetail(row)
        setOpenedOperationId(null)
    }

    const openProcess = (row: RefundRequestRow) => {
        setProcessDetail(row)
        setProcessStatus(row.status)
        setProcessInstructions(row.refundInstructions)
        setOpenedOperationId(null)
    }

    return (
        <div className={styles.RefundRequestModule}>
            <PageLoader active={isFetching || isCreating || isUpdating || isBulkProcessing} />

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

            <section
                className={`${tableStyles.filtersPanel} ${styles.refundFiltersPanel} ${isMobileFiltersOpen ? `${tableStyles.filtersPanelOpen} ${styles.refundFiltersPanelOpen}` : ''}`}
            >
                <div className={styles.refundFiltersGrid}>
                    <label className={tableStyles.filterField}>
                        <span>Статус заявки</span>
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                        >
                            <option value='all'>Все</option>
                            {refundStatuses.map((status) => (
                                <option
                                    value={status}
                                    key={status}
                                >
                                    {status}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className={tableStyles.dateRange}>
                        <span>Дата подачи заявки</span>
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
                            Создать возврат
                        </button>
                        <button
                            className={tableStyles.bulkButton}
                            type='button'
                            disabled={!selectedRows.length || isBulkProcessing}
                            onClick={openBulkModal}
                        >
                            Массовая обработка
                        </button>
                    </div>
                </div>

                {selectedRows.length ? (
                    <div className={tableStyles.bulkStatusBar}>
                        <span className={tableStyles.bulkHint}>Выбрано заявок: {selectedRows.length}</span>
                    </div>
                ) : null}

                <div className={`${tableStyles.tableWrap} ${styles.refundTableWrap}`}>
                    <table className={`${tableStyles.ordersTable} ${styles.refundTable}`}>
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
                                <th>Дата подачи заявки</th>
                                <th className={styles.refundTextCell}>Причина возврата</th>
                                <th className={styles.refundTextCell}>Инструкции по возврату</th>
                                <th>Сумма товара</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <RefundRequestTableRow
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
                                    onProcess={() => openProcess(row)}
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

            <RefundBulkProcessModal
                open={isBulkOpen}
                isSaving={isBulkProcessing}
                selectedCount={selectedRows.length}
                status={bulkStatus}
                refundInstructions={bulkInstructions}
                onClose={() => setIsBulkOpen(false)}
                onStatusChange={setBulkStatus}
                onRefundInstructionsChange={setBulkInstructions}
                onSubmit={handleBulkProcess}
            />

            <RefundCreateModal
                open={isCreateOpen}
                isSaving={isCreating}
                orderNo={createOrderNo}
                refundReason={createReason}
                refundInstructions={createInstructions}
                productAmount={createAmount}
                onClose={() => setIsCreateOpen(false)}
                onOrderNoChange={setCreateOrderNo}
                onRefundReasonChange={setCreateReason}
                onRefundInstructionsChange={setCreateInstructions}
                onProductAmountChange={setCreateAmount}
                onSubmit={handleCreate}
            />

            <RefundShowModal
                open={viewDetail != null}
                isLoading={false}
                orderNo={viewDetail?.orderNo ?? ''}
                applicationDate={viewDetail?.applicationDate ?? ''}
                refundReason={viewDetail?.refundReason ?? ''}
                refundInstructions={viewDetail?.refundInstructions ?? ''}
                productAmount={viewDetail ? formatPrice(viewDetail.productAmount) : ''}
                status={viewDetail?.status ?? ''}
                onClose={() => setViewDetail(null)}
            />

            <RefundProcessModal
                open={processDetail != null}
                isSaving={isUpdating}
                orderNo={processDetail?.orderNo ?? ''}
                status={processStatus}
                refundInstructions={processInstructions}
                onClose={() => setProcessDetail(null)}
                onStatusChange={setProcessStatus}
                onRefundInstructionsChange={setProcessInstructions}
                onSubmit={handleProcess}
            />
        </div>
    )
}

interface RefundRequestTableRowProps {
    row: RefundRequestRow
    selected: boolean
    isOperationOpen: boolean
    onToggleRow: () => void
    onToggleOperation: (event: MouseEvent<HTMLButtonElement>) => void
    onView: () => void
    onProcess: () => void
}

const RefundRequestTableRow = ({
    row,
    selected,
    isOperationOpen,
    onToggleRow,
    onToggleOperation,
    onView,
    onProcess,
}: RefundRequestTableRowProps) => (
    <tr>
        <td>
            <input
                type='checkbox'
                checked={selected}
                onChange={onToggleRow}
            />
        </td>
        <td className={styles.orderNo}>{row.orderNo}</td>
        <td>{row.applicationDate}</td>
        <td className={styles.refundTextCell}>{row.refundReason}</td>
        <td className={styles.refundTextCell}>{row.refundInstructions}</td>
        <td className={styles.moneyCell}>{formatPrice(row.productAmount)}</td>
        <td>
            <span className={tableStyles.statusBadge}>{row.status}</span>
        </td>
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
                        Просмотр заявки
                    </button>
                    <button
                        type='button'
                        onClick={onProcess}
                    >
                        Обработать возврат
                    </button>
                </div>
            ) : null}
        </td>
    </tr>
)

export default RefundRequestModule
