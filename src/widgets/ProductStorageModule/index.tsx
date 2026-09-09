import styles from './ProductStorageModule.module.css'
import tableStyles from '../SalesListModule/SalesListModule.module.css'
import { formatPrice, productStatuses, type ProductStorageRow } from './mockData'
import { CreateGood } from '@/features/goods/CreateGood'
import { ChangeGoods } from '@/features/goods/ChangeGood'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { FilterAltOutlineIcon } from '@/shared/ui/icons/FilterAltOutlineIcon'
import { IconButton, useMediaQuery } from '@mui/material'
import CartIcon from '@public/icons/cart-icon.svg'
import removeButtonStyles from '@/shared/ui/RemoveButtonTable/removeButton.module.css'
import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import {
    useBulkDeleteProductsMutation,
    useBulkUpdateProductStatusMutation,
    useDeleteGoodsMutation,
    useGetCategoriesListQuery,
    useGetListGoodsQuery,
    useUpdateGoodsMutation,
} from '@/shared/api'
import { PageLoader } from '@/shared/ui/PageLoader'
import { useToast } from '@/shared/lib/hooks/toast'
import { BulkActionsMenu } from '@/shared/ui/BulkActionsMenu'

const getErrorMessage = (err: unknown, fallback: string) => {
    if (typeof err === 'object' && err !== null && 'data' in err) {
        const data = (err as { data?: { message?: string } }).data
        if (data?.message) return data.message
    }
    return fallback
}

const ProductStorageModule = () => {
    useSetPageTitle('Хранение продуктов')
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const isMobileLayout = useMediaQuery('(max-width:768px)')
    const [nameFilter, setNameFilter] = useState('')
    const [idFilter, setIdFilter] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<'all' | number>('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [appliedFilters, setAppliedFilters] = useState({
        name: '',
        id: '',
        categoryId: undefined as number | undefined,
        status: 'all',
    })
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const { data: categoriesResponse } = useGetCategoriesListQuery()
    const categoryOptions = useMemo(
        () => (categoriesResponse?.data ?? []).filter((c) => c.parent_id === null),
        [categoriesResponse],
    )

    const { data: listResponse, isFetching, isError, refetch } = useGetListGoodsQuery({
        name: appliedFilters.name || undefined,
        product_id: appliedFilters.id || undefined,
        category_id: appliedFilters.categoryId,
        shop_status: appliedFilters.status !== 'all' ? appliedFilters.status : undefined,
        page,
        per_page: rowsPerPage,
    })

    const [updateGoods] = useUpdateGoodsMutation()
    const [deleteGoods, { isLoading: isDeleting }] = useDeleteGoodsMutation()
    const [bulkStatus, { isLoading: isBulkStatusLoading }] = useBulkUpdateProductStatusMutation()
    const [bulkDelete, { isLoading: isBulkDeleteLoading }] = useBulkDeleteProductsMutation()

    const rows: ProductStorageRow[] = listResponse?.data ?? []
    const total = listResponse?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / rowsPerPage))
    const safePage = Math.min(page, totalPages)
    const isFiltersPanelOpen = !isMobileLayout || isMobileFiltersOpen
    const isAnyRowSelected = selectedRows.length > 0
    const isAllRowsSelected = rows.length > 0 && rows.every((row) => selectedRows.includes(row.id))
    const isListLoading = isFetching || isDeleting || isBulkStatusLoading || isBulkDeleteLoading

    const visiblePages = useMemo(() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)
        if (safePage <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
        if (safePage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        return [1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages]
    }, [safePage, totalPages])

    useEffect(() => {
        if (page > totalPages) setPage(totalPages)
    }, [page, totalPages])

    const applyFilters = () => {
        setAppliedFilters({
            name: nameFilter.trim(),
            id: idFilter.trim(),
            categoryId: categoryFilter === 'all' ? undefined : categoryFilter,
            status: statusFilter,
        })
        setPage(1)
        setSelectedRows([])
        setIsMobileFiltersOpen(false)
    }

    const resetFilters = () => {
        setNameFilter('')
        setIdFilter('')
        setCategoryFilter('all')
        setStatusFilter('all')
        setAppliedFilters({ name: '', id: '', categoryId: undefined, status: 'all' })
        setPage(1)
        setSelectedRows([])
        setIsMobileFiltersOpen(false)
    }

    const handleFiltersKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') applyFilters()
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

    const toggleRowField = async (row: ProductStorageRow, field: 'listProducts' | 'recommendation' | 'subscription') => {
        const map = {
            listProducts: 'list_products',
            recommendation: 'is_recommended',
            subscription: 'is_subscription',
        } as const

        const apiField = map[field]
        const nextValue = !row[field]

        try {
            await updateGoods({
                id: row.id,
                [apiField]: nextValue,
            }).unwrap()
            refetch()
        } catch (error) {
            TOAST_ERROR(getErrorMessage(error, 'Не удалось обновить товар'))
        }
    }

    const handleBulkStatus = async (shopStatus: 'on_shelf' | 'off_shelf') => {
        if (!selectedRows.length) return
        try {
            const res = await bulkStatus({ ids: selectedRows, shop_status: shopStatus }).unwrap()
            TOAST_SUCCESS(res.message)
            setSelectedRows([])
            refetch()
        } catch (error) {
            TOAST_ERROR(getErrorMessage(error, 'Не удалось обновить статусы'))
        }
    }

    const handleBulkDelete = async () => {
        if (!selectedRows.length) return
        if (!window.confirm(`Удалить выбранные товары (${selectedRows.length})? Это действие нельзя отменить.`)) return
        try {
            const res = await bulkDelete({ ids: selectedRows }).unwrap()
            TOAST_SUCCESS(res.message)
            setSelectedRows([])
            refetch()
        } catch (error) {
            TOAST_ERROR(getErrorMessage(error, 'Не удалось удалить товары'))
        }
    }

    const handleDeleteRow = async (id: number) => {
        if (!window.confirm('Удалить этот товар?')) return
        try {
            await deleteGoods(id).unwrap()
            TOAST_SUCCESS('Товар удалён')
            refetch()
        } catch (error) {
            TOAST_ERROR(getErrorMessage(error, 'Не удалось удалить товар'))
        }
    }

    const storageBulkItems = [
        { id: 'on_shelf', label: 'Разместить на витрине' },
        { id: 'off_shelf', label: 'Снять с витрины' },
        { id: 'delete', label: 'Удалить', danger: true },
    ]

    const handleBulkAction = (actionId: string) => {
        if (!selectedRows.length) return

        if (actionId === 'on_shelf') {
            void handleBulkStatus('on_shelf')
            return
        }

        if (actionId === 'off_shelf') {
            void handleBulkStatus('off_shelf')
            return
        }

        if (actionId === 'delete') {
            void handleBulkDelete()
        }
    }

    return (
        <div className={styles.ProductStorageModule}>
            <div className={tableStyles.mobileFilterBar}>
                <button
                    className={isMobileFiltersOpen ? tableStyles.mobileFilterButtonActive : tableStyles.mobileFilterButton}
                    type='button'
                    onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
                >
                    <FilterAltOutlineIcon size={15} strokeWidth={0.5} />
                    Фильтры
                </button>
            </div>

            {isMobileLayout ? (
                <div className={styles.mobileCreateWrap}>
                    <CreateGood iconOnlyMaxWidth={500} fullWidth />
                </div>
            ) : null}

            <section
                className={`${tableStyles.filtersPanel} ${styles.storageFiltersPanel} ${isFiltersPanelOpen ? `${tableStyles.filtersPanelOpen} ${styles.storageFiltersPanelOpen}` : ''}`}
            >
                <div className={styles.storageFiltersGrid} onKeyDown={handleFiltersKeyDown}>
                    <label className={tableStyles.filterField}>
                        <span>Название товара</span>
                        <input type='text' placeholder='Введите название товара' value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
                    </label>
                    <label className={tableStyles.filterField}>
                        <span>ID товара</span>
                        <input type='text' placeholder='Введите ID товара' value={idFilter} onChange={(e) => setIdFilter(e.target.value)} />
                    </label>
                    <label className={tableStyles.filterField}>
                        <span>Категория</span>
                        <select
                            value={categoryFilter === 'all' ? 'all' : String(categoryFilter)}
                            onChange={(e) => setCategoryFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                        >
                            <option value='all'>Все</option>
                            {categoryOptions.map((category) => (
                                <option key={category.id} value={category.id}>{category.title}</option>
                            ))}
                        </select>
                    </label>
                    <label className={tableStyles.filterField}>
                        <span>Статус товара</span>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value='all'>Все</option>
                            {productStatuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className={`${tableStyles.filterActions} ${styles.storageFilterActions}`}>
                    <button className={tableStyles.primaryButton} type='button' onClick={applyFilters}>Найти</button>
                    <button className={tableStyles.secondaryButton} type='button' onClick={resetFilters}>Сбросить</button>
                </div>

                {isMobileLayout ? (
                    <div className={`${styles.bulkActions} ${styles.bulkActionsInFilters}`}>
                        <BulkActionsMenu
                            triggerClassName={styles.bulkPrimary}
                            wrapperClassName={styles.bulkMenuWrap}
                            disabled={!isAnyRowSelected || isListLoading}
                            items={storageBulkItems}
                            onSelect={handleBulkAction}
                        />
                    </div>
                ) : (
                    <div className={styles.toolbarRow}>
                        <div className={styles.bulkActions}>
                            <BulkActionsMenu
                                triggerClassName={styles.bulkPrimary}
                                wrapperClassName={styles.bulkMenuWrap}
                                disabled={!isAnyRowSelected || isListLoading}
                                items={storageBulkItems}
                                onSelect={handleBulkAction}
                            />
                        </div>
                        <CreateGood iconOnlyMaxWidth={500} />
                    </div>
                )}
            </section>

            <section className={tableStyles.tablePanel} style={{ position: 'relative' }}>
                {isListLoading ? <PageLoader active={isListLoading} /> : null}

                <div className={`${tableStyles.tableWrap} ${styles.productTableWrap}`}>
                    <table className={`${tableStyles.ordersTable} ${styles.productTable}`}>
                        <thead>
                            <tr>
                                <th><input type='checkbox' checked={isAnyRowSelected && isAllRowsSelected} onChange={toggleAllRows} /></th>
                                <th>ID товара</th>
                                <th>Обложка</th>
                                <th className={styles.productNameCell}>Название</th>
                                <th>Категория</th>
                                <th>Подкатегория</th>
                                <th>Закупочная цена</th>
                                <th className={styles.tagsColumn}>Теги</th>
                                <th>Цена продажи</th>
                                <th>Цена со скидкой</th>
                                <th>Прибыль</th>
                                <th>Продажи</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <ProductStorageTableRow
                                    key={row.id}
                                    row={row}
                                    selected={selectedRows.includes(row.id)}
                                    onToggleRow={() => toggleRow(row.id)}
                                    onToggleField={(field) => toggleRowField(row, field)}
                                    onDelete={() => handleDeleteRow(row.id)}
                                />
                            ))}
                            {!rows.length && !isFetching ? (
                                <tr>
                                    <td colSpan={13} className={tableStyles.emptyCell}>
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
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value))
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
                        <button type='button' disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>‹</button>
                        {visiblePages.map((pageItem, index) => (
                            <button
                                key={`${pageItem}-${index}`}
                                className={pageItem === safePage ? tableStyles.pageActive : undefined}
                                type='button'
                                disabled={pageItem === '...'}
                                onClick={() => typeof pageItem === 'number' && setPage(pageItem)}
                            >
                                {pageItem}
                            </button>
                        ))}
                        <button type='button' disabled={safePage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>›</button>
                    </div>
                    <div className={tableStyles.paginationJump}>
                        <span>Перейти к</span>
                        <input
                            type='text'
                            value={safePage}
                            onChange={(e) => {
                                const next = Number(e.target.value)
                                if (!Number.isNaN(next)) setPage(Math.min(totalPages, Math.max(1, next)))
                            }}
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}

interface ProductStorageTableRowProps {
    row: ProductStorageRow
    selected: boolean
    onToggleRow: () => void
    onToggleField: (field: 'listProducts' | 'recommendation' | 'subscription') => void
    onDelete: () => void
}

const ProductStorageTableRow = ({ row, selected, onToggleRow, onToggleField, onDelete }: ProductStorageTableRowProps) => (
    <tr>
        <td><input type='checkbox' checked={selected} onChange={onToggleRow} /></td>
        <td className={styles.productId}>{row.productId}</td>
        <td>
            {row.imageUrl ? (
                <img className={styles.coverImage} src={row.imageUrl} alt={row.name} />
            ) : (
                <span className={styles.coverPlaceholder}>—</span>
            )}
        </td>
        <td className={styles.productNameCell}>{row.name}</td>
        <td>{row.category}</td>
        <td>{row.subCategory}</td>
        <td className={styles.moneyCell}>{formatPrice(row.purchasePrice)}</td>
        <td className={styles.tagsColumn}>
            <div className={styles.tagsCell}>
                <TagToggle label='Выкладка' checked={row.listProducts} onToggle={() => onToggleField('listProducts')} />
                <TagToggle label='Рекомендация' checked={row.recommendation} onToggle={() => onToggleField('recommendation')} />
                <TagToggle label='Подписка' checked={row.subscription} onToggle={() => onToggleField('subscription')} />
            </div>
        </td>
        <td className={styles.moneyCell}>{formatPrice(row.sellingPrice)}</td>
        <td className={row.discountedPrice ? styles.moneyCell : `${styles.moneyCell} ${styles.moneyCellEmpty}`}>
            {row.discountedPrice ? formatPrice(row.discountedPrice) : '—'}
        </td>
        <td className={styles.moneyCell}>{formatPrice(row.profit)}</td>
        <td>{row.accumulatedSales}</td>
        <td>
            <div className={styles.operationCell}>
                <ChangeGoods id={row.id} />
                <IconButton className={removeButtonStyles.iconButton} size='large' type='button' aria-label='Удалить' onClick={onDelete}>
                    <CartIcon />
                </IconButton>
            </div>
        </td>
    </tr>
)

const TagToggle = ({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) => (
    <div className={styles.tagRow}>
        <button
            className={checked ? `${styles.toggle} ${styles.toggleOn}` : `${styles.toggle} ${styles.toggleOff}`}
            type='button'
            aria-pressed={checked}
            onClick={onToggle}
        />
        <span>{label}</span>
    </div>
)

export default ProductStorageModule
