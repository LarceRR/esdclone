import styles from './ProductWarehouseModule.module.css'
import tableStyles from '../SalesListModule/SalesListModule.module.css'
import { formatPrice, type ProductWarehouseRow } from './mockData'
import { AddProductsModal } from './ui/AddProductsModal'
import { BulkActionsMenu } from '@/shared/ui/BulkActionsMenu'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { FilterAltOutlineIcon } from '@/shared/ui/icons/FilterAltOutlineIcon'
import { useEffect, useMemo, useState } from 'react'
import { useBulkDeleteWarehouseProductsMutation, useGetCategoriesListQuery, useGetWarehouseListQuery } from '@/shared/api'
import { PageLoader } from '@/shared/ui/PageLoader'
import { useToast } from '@/shared/lib/hooks/toast'

const getErrorMessage = (err: unknown, fallback: string) => {
    if (typeof err === 'object' && err !== null && 'data' in err) {
        const data = (err as { data?: { message?: string } }).data
        if (data?.message) return data.message
    }
    return fallback
}

const ProductWarehouseModule = () => {
    useSetPageTitle('Склад продуктов')
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const [nameFilter, setNameFilter] = useState('')
    const [idFilter, setIdFilter] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<'all' | number>('all')
    const [appliedFilters, setAppliedFilters] = useState({
        name: '',
        id: '',
        categoryId: undefined as number | undefined,
    })
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [addModalTargetIds, setAddModalTargetIds] = useState<number[] | null>(null)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const { data: categoriesResponse } = useGetCategoriesListQuery()
    const categoryOptions = useMemo(() => {
        return (categoriesResponse?.data ?? []).filter((category) => category.parent_id === null)
    }, [categoriesResponse])

    const { data: listResponse, isFetching, isError, refetch } = useGetWarehouseListQuery({
        name: appliedFilters.name || undefined,
        product_id: appliedFilters.id || undefined,
        category_id: appliedFilters.categoryId,
        page,
        per_page: rowsPerPage,
    })
    const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteWarehouseProductsMutation()

    const rows: ProductWarehouseRow[] = listResponse?.data ?? []
    const total = listResponse?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / rowsPerPage))
    const safePage = Math.min(page, totalPages)
    const isListLoading = isFetching || isBulkDeleting
    const isAnyRowSelected = selectedRows.length > 0
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
        setAppliedFilters({
            name: nameFilter.trim(),
            id: idFilter.trim(),
            categoryId: categoryFilter === 'all' ? undefined : categoryFilter,
        })
        setPage(1)
        setSelectedRows([])
    }

    const resetFilters = () => {
        setNameFilter('')
        setIdFilter('')
        setCategoryFilter('all')
        setAppliedFilters({ name: '', id: '', categoryId: undefined })
        setPage(1)
        setSelectedRows([])
    }

    const toggleAllRows = () => {
        const pageIds = rows.map((row) => row.id)
        setSelectedRows((prev) => {
            if (isAllRowsSelected) return prev.filter((id) => !pageIds.includes(id))
            return Array.from(new Set([...prev, ...pageIds]))
        })
    }

    const toggleRow = (rowId: number) => {
        setSelectedRows((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]))
    }

    const openAddModal = (ids: number[]) => {
        setAddModalTargetIds(ids)
    }

    const closeAddModal = () => {
        setAddModalTargetIds(null)
    }

    const handleBulkAdd = () => {
        if (!selectedRows.length) return
        openAddModal(selectedRows)
    }

    const handleBulkDelete = async () => {
        if (!selectedRows.length) return
        if (!window.confirm(`Удалить выбранные товары со склада (${selectedRows.length})? Это действие нельзя отменить.`)) {
            return
        }

        try {
            const response = await bulkDelete({ ids: selectedRows }).unwrap()
            TOAST_SUCCESS(response.message)

            if (response.data.skipped.length) {
                TOAST_ERROR(`Пропущено: ${response.data.skipped.length}`)
            }

            setSelectedRows([])
            refetch()
        } catch (error) {
            TOAST_ERROR(getErrorMessage(error, 'Не удалось удалить товары'))
        }
    }

    const handleBulkAction = (actionId: string) => {
        if (!selectedRows.length) return

        if (actionId === 'publish') {
            handleBulkAdd()
            return
        }

        if (actionId === 'delete') {
            void handleBulkDelete()
        }
    }

    const warehouseBulkItems = [
        { id: 'publish', label: 'Опубликовать в магазин' },
        { id: 'delete', label: 'Удалить со склада', danger: true },
    ]

    const handlePublished = () => {
        setSelectedRows([])
    }

    return (
        <div className={styles.ProductWarehouseModule}>
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
                className={`${tableStyles.filtersPanel} ${styles.warehouseFiltersPanel} ${isMobileFiltersOpen ? `${tableStyles.filtersPanelOpen} ${styles.warehouseFiltersPanelOpen}` : ''}`}
            >
                <div className={styles.warehouseFiltersGrid}>
                    <label className={tableStyles.filterField}>
                        <span>Название товара</span>
                        <input
                            type='text'
                            placeholder='Введите название товара'
                            value={nameFilter}
                            onChange={(event) => setNameFilter(event.target.value)}
                            onKeyDown={(event) => event.key === 'Enter' && applyFilters()}
                        />
                    </label>
                    <label className={tableStyles.filterField}>
                        <span>ID товара</span>
                        <input
                            type='text'
                            placeholder='Введите ID товара'
                            value={idFilter}
                            onChange={(event) => setIdFilter(event.target.value)}
                            onKeyDown={(event) => event.key === 'Enter' && applyFilters()}
                        />
                    </label>
                    <label className={tableStyles.filterField}>
                        <span>Категория</span>
                        <select
                            value={categoryFilter === 'all' ? 'all' : String(categoryFilter)}
                            onChange={(event) => {
                                const value = event.target.value
                                setCategoryFilter(value === 'all' ? 'all' : Number(value))
                            }}
                        >
                            <option value='all'>Все</option>
                            {categoryOptions.map((category) => (
                                <option
                                    value={category.id}
                                    key={category.id}
                                >
                                    {category.title}
                                </option>
                            ))}
                        </select>
                    </label>
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

            <section
                className={tableStyles.tablePanel}
                style={{ position: 'relative' }}
            >
                {isListLoading ? <PageLoader active={isListLoading} /> : null}

                <BulkActionsMenu
                    triggerClassName={styles.addBulkButton}
                    wrapperClassName={styles.bulkMenuWrap}
                    disabled={!isAnyRowSelected || isListLoading}
                    items={warehouseBulkItems}
                    onSelect={handleBulkAction}
                />

                {isAnyRowSelected ? (
                    <div className={tableStyles.bulkStatusBar}>
                        <span className={tableStyles.bulkHint}>Выбрано товаров: {selectedRows.length}</span>
                    </div>
                ) : null}

                <div className={`${tableStyles.tableWrap} ${styles.warehouseTableWrap}`}>
                    <table className={`${tableStyles.ordersTable} ${styles.warehouseTable}`}>
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type='checkbox'
                                        checked={isAnyRowSelected && isAllRowsSelected}
                                        onChange={toggleAllRows}
                                    />
                                </th>
                                <th>ID товара</th>
                                <th>Обложка</th>
                                <th className={styles.productNameCell}>Название</th>
                                <th>Категория</th>
                                <th>Подкатегория</th>
                                <th>Закупочная цена</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <ProductWarehouseTableRow
                                    key={row.id}
                                    row={row}
                                    selected={selectedRows.includes(row.id)}
                                    onToggleRow={() => toggleRow(row.id)}
                                    onAdd={() => openAddModal([row.id])}
                                />
                            ))}
                            {!rows.length && !isFetching ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className={tableStyles.emptyCell}
                                    >
                                        {isError ? 'Не удалось загрузить товары' : 'Нет данных'}
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
                                setSelectedRows([])
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

            <AddProductsModal
                open={Boolean(addModalTargetIds)}
                targetIds={addModalTargetIds ?? []}
                onClose={closeAddModal}
                onPublished={handlePublished}
            />
        </div>
    )
}

interface ProductWarehouseTableRowProps {
    row: ProductWarehouseRow
    selected: boolean
    onToggleRow: () => void
    onAdd: () => void
}

const ProductWarehouseTableRow = ({ row, selected, onToggleRow, onAdd }: ProductWarehouseTableRowProps) => (
    <tr>
        <td>
            <input
                type='checkbox'
                checked={selected}
                onChange={onToggleRow}
            />
        </td>
        <td className={styles.productId}>{row.productId}</td>
        <td>
            {row.imageUrl ? (
                <img
                    className={styles.coverImage}
                    src={row.imageUrl}
                    alt={row.name}
                />
            ) : (
                <span className={styles.coverPlaceholder}>—</span>
            )}
        </td>
        <td className={styles.productNameCell}>{row.name}</td>
        <td>{row.category}</td>
        <td>{row.subCategory}</td>
        <td className={styles.moneyCell}>{formatPrice(row.purchasePrice)}</td>
        <td>
            <button
                className={styles.rowAddButton}
                type='button'
                onClick={onAdd}
            >
                Добавить
            </button>
        </td>
    </tr>
)

export default ProductWarehouseModule
