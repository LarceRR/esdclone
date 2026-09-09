import styles from './FinancialReportModule.module.css'
import tableStyles from '../SalesListModule/SalesListModule.module.css'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { useEffect, useMemo, useState } from 'react'
import { FilterAltOutlineIcon } from '@/shared/ui/icons/FilterAltOutlineIcon'
import { PageLoader } from '@/shared/ui/PageLoader'
import { useGetFinancialReportListQuery, useGetFinancialSummaryQuery } from '@/shared/api'
import type { FinancialReportPeriod } from '@/shared/api/list/financialReportApi/types.ts'

const periods: { id: FinancialReportPeriod; label: string }[] = [
    { id: 'yesterday', label: 'Вчера' },
    { id: 'today', label: 'Сегодня' },
    { id: 'week', label: 'Эта неделя' },
    { id: 'month', label: 'Этот месяц' },
    { id: 'all', label: 'Все' },
]

type SummaryKey = 'pendingAmount' | 'totalSales' | 'totalProfit' | 'totalOrders' | 'cancelOrder' | 'refundOrder'

const summaryCards: { key: SummaryKey; label: string; format: 'money' | 'number' }[] = [
    { key: 'pendingAmount', label: 'Ожидающая сумма', format: 'money' },
    { key: 'totalSales', label: 'Общие продажи', format: 'money' },
    { key: 'totalProfit', label: 'Общая прибыль', format: 'money' },
    { key: 'totalOrders', label: 'Всего заказов', format: 'number' },
    { key: 'cancelOrder', label: 'Отменённые заказы', format: 'number' },
    { key: 'refundOrder', label: 'Возвраты', format: 'number' },
]

const formatMoney = (value: number) => `$${value.toFixed(2)}`

const FinancialReportModule = () => {
    useSetPageTitle('Финансовый отчёт')
    const [activePeriod, setActivePeriod] = useState<FinancialReportPeriod>('all')
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const listParams = useMemo(
        () => ({
            period: activePeriod,
            page,
            per_page: rowsPerPage as 10 | 20 | 50,
        }),
        [activePeriod, page, rowsPerPage],
    )

    const {
        data: summaryResponse,
        isFetching: isSummaryFetching,
        isError: isSummaryError,
    } = useGetFinancialSummaryQuery({ period: activePeriod })

    const {
        data: listResponse,
        isFetching: isListFetching,
        isError: isListError,
    } = useGetFinancialReportListQuery(listParams)

    const selectPeriod = (period: FinancialReportPeriod) => {
        setActivePeriod(period)
        setPage(1)
        setSelectedRows([])
    }

    const rows = listResponse?.data ?? []
    const total = listResponse?.total ?? 0
    const isAnyRowSelected = selectedRows.length > 0
    const isFetching = isSummaryFetching || isListFetching
    const isError = isSummaryError || isListError

    const summary = useMemo(() => {
        const data = summaryResponse?.data
        if (!data) {
            return {
                pendingAmount: 0,
                totalSales: 0,
                totalProfit: 0,
                totalOrders: 0,
                cancelOrder: 0,
                refundOrder: 0,
            }
        }

        return {
            pendingAmount: data.pending_amount,
            totalSales: data.total_sales,
            totalProfit: data.total_profit,
            totalOrders: data.total_orders,
            cancelOrder: data.cancel_order,
            refundOrder: data.refund_order,
        }
    }, [summaryResponse])

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
        if (page > totalPages) {
            setPage(totalPages)
        }
    }, [page, totalPages])

    const getSummaryValue = (key: SummaryKey) => {
        const value = summary[key]
        const card = summaryCards.find((item) => item.key === key)
        if (!card) return ''
        return card.format === 'money' ? formatMoney(value) : String(value)
    }

    const toggleAllRows = () => {
        const rowIds = rows.map((row) => row.id)
        setSelectedRows((prev) => {
            if (isAllRowsSelected) return prev.filter((id) => !rowIds.includes(id))
            return Array.from(new Set([...prev, ...rowIds]))
        })
    }

    const toggleRow = (rowId: string) => {
        setSelectedRows((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]))
    }

    return (
        <div className={styles.FinancialReportModule}>
            <PageLoader active={isFetching} />

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

            <section className={tableStyles.tabsPanel}>
                {periods.map((period) => (
                    <button
                        className={activePeriod === period.id ? tableStyles.tabActive : tableStyles.tab}
                        type='button'
                        key={period.id}
                        onClick={() => selectPeriod(period.id)}
                    >
                        {period.label}
                    </button>
                ))}
            </section>

            <section
                className={`${tableStyles.filtersPanel} ${styles.periodFiltersPanel} ${isMobileFiltersOpen ? `${tableStyles.filtersPanelOpen} ${styles.periodFiltersPanelOpen}` : ''}`}
            >
                <div className={tableStyles.mobileTabsInFilters}>
                    {periods.map((period) => (
                        <button
                            className={activePeriod === period.id ? tableStyles.tabActive : tableStyles.tab}
                            type='button'
                            key={`mobile-${period.id}`}
                            onClick={() => selectPeriod(period.id)}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
            </section>

            <section className={styles.summaryPanel}>
                <div className={styles.summaryGrid}>
                    {summaryCards.map((card) => (
                        <article
                            className={styles.summaryCard}
                            key={card.key}
                        >
                            <strong>{getSummaryValue(card.key)}</strong>
                            <span>{card.label}</span>
                        </article>
                    ))}
                </div>
            </section>

            <section className={tableStyles.tablePanel}>
                <div className={`${tableStyles.tableWrap} ${styles.reportTableWrap}`}>
                    <table className={`${tableStyles.ordersTable} ${styles.reportTable}`}>
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type='checkbox'
                                        checked={isAnyRowSelected}
                                        onChange={toggleAllRows}
                                    />
                                </th>
                                <th>Дата</th>
                                <th>Всего заказов</th>
                                <th>Прибыль</th>
                                <th>Отменённые</th>
                                <th>Возвраты</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isError ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className={tableStyles.emptyCell}
                                    >
                                        Не удалось загрузить данные
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row) => (
                                    <tr key={row.id}>
                                        <td>
                                            <input
                                                type='checkbox'
                                                checked={selectedRows.includes(row.id)}
                                                onChange={() => toggleRow(row.id)}
                                            />
                                        </td>
                                        <td>{row.date}</td>
                                        <td>{row.total_orders}</td>
                                        <td>{formatMoney(row.profit)}</td>
                                        <td>{row.cancel_order}</td>
                                        <td>{row.refund_order}</td>
                                    </tr>
                                ))
                            )}
                            {!isError && !rows.length && !isFetching ? (
                                <tr>
                                    <td
                                        colSpan={6}
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
                            disabled={isListFetching}
                        >
                            <option value='10'>10/страница</option>
                            <option value='20'>20/страница</option>
                            <option value='50'>50/страница</option>
                        </select>
                    </div>

                    <div className={tableStyles.paginationPages}>
                        <button
                            type='button'
                            disabled={safePage === 1 || isListFetching}
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        >
                            ‹
                        </button>
                        {visiblePages.map((pageItem, index) => (
                            <button
                                className={pageItem === safePage ? tableStyles.pageActive : undefined}
                                type='button'
                                disabled={pageItem === '...' || isListFetching}
                                onClick={() => typeof pageItem === 'number' && setPage(pageItem)}
                                key={`${pageItem}-${index}`}
                            >
                                {pageItem}
                            </button>
                        ))}
                        <button
                            type='button'
                            disabled={safePage === totalPages || isListFetching}
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
                            disabled={isListFetching}
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default FinancialReportModule
