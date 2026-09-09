import styles from './PurchaseHistoryModule.module.css'
import tableStyles from '../SalesListModule/SalesListModule.module.css'
import { normalizeFilterDate } from './filterUtils'
import { formatPaymentAmount } from './utils'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { FilterAltOutlineIcon } from '@/shared/ui/icons/FilterAltOutlineIcon'
import { PageLoader } from '@/shared/ui/PageLoader'
import { useGetPurchaseHistoryListQuery } from '@/shared/api'
import { useAppSelector } from '@/shared/store'
import { readPersistedAccessToken } from '@/shared/lib/auth/authStorage.ts'
import { useEffect, useMemo, useState } from 'react'

const PurchaseHistoryModule = () => {
    useSetPageTitle('История покупок')
    const [startDateFilter, setStartDateFilter] = useState('')
    const [endDateFilter, setEndDateFilter] = useState('')
    const [appliedFilters, setAppliedFilters] = useState({ startDate: '', endDate: '' })
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const userToken = useAppSelector((state) => state.auth.userToken) ?? readPersistedAccessToken()

    const listParams = useMemo(
        () => ({
            date_from: appliedFilters.startDate || undefined,
            date_to: appliedFilters.endDate || undefined,
            page,
            per_page: rowsPerPage as 10 | 20 | 50,
        }),
        [appliedFilters, page, rowsPerPage],
    )

    const { data: listResponse, isLoading, isFetching, isError, refetch } = useGetPurchaseHistoryListQuery(listParams, {
        skip: !userToken,
    })

    const rows = listResponse?.data ?? []
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
        if (page > totalPages) {
            setPage(totalPages)
        }
    }, [page, totalPages])

    const applyFilters = () => {
        const startDate = normalizeFilterDate(startDateFilter)
        const endDate = normalizeFilterDate(endDateFilter)

        if (startDate && endDate && startDate > endDate) {
            setAppliedFilters({ startDate: endDate, endDate: startDate })
            setStartDateFilter(endDate)
            setEndDateFilter(startDate)
        } else {
            setAppliedFilters({ startDate, endDate })
        }

        setPage(1)
        setIsMobileFiltersOpen(false)
    }

    const resetFilters = () => {
        setStartDateFilter('')
        setEndDateFilter('')
        setAppliedFilters({ startDate: '', endDate: '' })
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

    return (
        <div className={styles.PurchaseHistoryModule}>
            <PageLoader active={isLoading} />

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
                <div className={styles.filtersRow}>
                    <div
                        className={tableStyles.dateRange}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                applyFilters()
                            }
                        }}
                    >
                        <span>Дата покупки</span>
                        <input
                            type='date'
                            value={startDateFilter}
                            aria-label='Дата начала'
                            onChange={(event) => setStartDateFilter(event.target.value)}
                        />
                        <b>до</b>
                        <input
                            type='date'
                            value={endDateFilter}
                            aria-label='Дата окончания'
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
                <div className={`${tableStyles.tableWrap} ${styles.purchaseTableWrap}`}>
                    <table className={`${tableStyles.ordersTable} ${styles.purchaseTable}`}>
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type='checkbox'
                                        checked={selectedRows.length > 0}
                                        onChange={toggleAllRows}
                                        aria-label='Выбрать все записи'
                                    />
                                </th>
                                <th>Пакет покупки</th>
                                <th>Время покупки</th>
                                <th>Срок действия</th>
                                <th>Сумма оплаты</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isError ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className={tableStyles.emptyCell}
                                    >
                                        Не удалось загрузить данные
                                        <button
                                            className={tableStyles.primaryButton}
                                            type='button'
                                            style={{ marginLeft: '0.75rem' }}
                                            onClick={() => void refetch()}
                                        >
                                            Повторить
                                        </button>
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
                                                aria-label={`Выбрать ${row.package_name}`}
                                            />
                                        </td>
                                        <td>{row.package_name}</td>
                                        <td>{row.purchase_time}</td>
                                        <td>{row.expiration_time}</td>
                                        <td className={styles.paymentAmount}>{formatPaymentAmount(row.payment_amount)}</td>
                                    </tr>
                                ))
                            )}
                            {!isError && !rows.length && !isFetching ? (
                                <tr>
                                    <td
                                        colSpan={5}
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
                            disabled={isFetching}
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
                            disabled={safePage === 1 || isFetching}
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        >
                            ‹
                        </button>
                        {visiblePages.map((pageItem, index) => (
                            <button
                                className={pageItem === safePage ? tableStyles.pageActive : undefined}
                                type='button'
                                disabled={pageItem === '...' || isFetching}
                                onClick={() => typeof pageItem === 'number' && setPage(pageItem)}
                                key={`${pageItem}-${index}`}
                            >
                                {pageItem}
                            </button>
                        ))}
                        <button
                            type='button'
                            disabled={safePage === totalPages || isFetching}
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
                            disabled={isFetching}
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
        </div>
    )
}

export default PurchaseHistoryModule
