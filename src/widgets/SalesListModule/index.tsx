import styles from './SalesListModule.module.css'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ModalSample } from '@/shared/ui/ModalSample'
import { FilterAltOutlineIcon } from '@/shared/ui/icons/FilterAltOutlineIcon'
import {
    useBulkPurchaseShopOrdersMutation,
    useDeleteShopOrderMutation,
    useGetShopOrderMutation,
    useGetShopOrdersListQuery,
} from '@/shared/api'
import type { IBulkPurchaseFilter, IShopOrderListItem, IShopOrderShowResponse } from '@/shared/api/list/shopOrdersApi/types.ts'
import { PageLoader } from '@/shared/ui/PageLoader'
import { useToast } from '@/shared/lib/hooks/toast'
import { ShopOrderFormModal } from './ui/ShopOrderFormModal'

const paymentStatuses = ['Оплачен', 'Не оплачен', 'Ожидает оплаты', 'Частично оплачен', 'Возврат']
const logisticsStatuses = [
    'Ожидает оплаты покупателем',
    'Покупатель оплатил',
    'Поставщики получили заказы',
    'Транспортируется',
    'Подписано покупателем',
    'Заказ завершён',
]

const tabs = ['Все заказы', 'Ожидают', 'Куплены'] as const
const modalWidth = { width: 'min(60rem, calc(100vw - 1.5rem))' }

const tabToParam = (tab: (typeof tabs)[number]): 'all' | 'pending' | 'purchased' => {
    if (tab === 'Ожидают') return 'pending'
    if (tab === 'Куплены') return 'purchased'
    return 'all'
}

const formatMoney = (value: number | string | null | undefined) => {
    const amount = Number(value ?? 0)
    return `$${amount.toFixed(2)}`
}

const formatDateTime = (value: string | null | undefined) => {
    if (!value) return '—'
    return value.replace('T', ' ').slice(0, 19)
}

const getErrorMessage = (err: unknown, fallback: string) => {
    if (typeof err === 'object' && err !== null && 'data' in err) {
        const data = (err as { data?: { message?: string } }).data
        if (data?.message) return data.message
    }

    return fallback
}

const SalesListModule = () => {
    useSetPageTitle('Магазин заказ')
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const [openedOrderMenu, setOpenedOrderMenu] = useState<number | null>(null)
    const [selectedOrders, setSelectedOrders] = useState<number[]>([])
    const [viewedOrderId, setViewedOrderId] = useState<number | null>(null)
    const [logisticsOrderId, setLogisticsOrderId] = useState<number | null>(null)
    const [orderDetail, setOrderDetail] = useState<IShopOrderShowResponse['data'] | null>(null)
    const [logisticsDetail, setLogisticsDetail] = useState<IShopOrderShowResponse['data'] | null>(null)
    const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0])
    const [orderNoFilter, setOrderNoFilter] = useState('')
    const [paymentFilter, setPaymentFilter] = useState('all')
    const [logisticsFilter, setLogisticsFilter] = useState('all')
    const [dateFromFilter, setDateFromFilter] = useState('')
    const [dateToFilter, setDateToFilter] = useState('')
    const [appliedFilters, setAppliedFilters] = useState({
        orderNo: '',
        payment: 'all',
        logistics: 'all',
        dateFrom: '',
        dateTo: '',
    })
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null)
    const [bulkByFilter, setBulkByFilter] = useState(false)
    const tablePanelRef = useRef<HTMLElement | null>(null)

    const listFilter = useMemo(
        (): IBulkPurchaseFilter => ({
            order_no: appliedFilters.orderNo || undefined,
            payment_status: appliedFilters.payment !== 'all' ? appliedFilters.payment : undefined,
            logistics_status: appliedFilters.logistics !== 'all' ? appliedFilters.logistics : undefined,
            tab: tabToParam(activeTab),
            date_from: appliedFilters.dateFrom || undefined,
            date_to: appliedFilters.dateTo || undefined,
        }),
        [appliedFilters, activeTab],
    )

    const { data: listResponse, isFetching, isError } = useGetShopOrdersListQuery({
        ...listFilter,
        page,
        per_page: rowsPerPage,
    })

    const [getShopOrder] = useGetShopOrderMutation()
    const [bulkPurchase, { isLoading: isBulkLoading }] = useBulkPurchaseShopOrdersMutation()
    const [deleteShopOrder, { isLoading: isDeleteLoading }] = useDeleteShopOrderMutation()
    const [isViewOrderLoading, setIsViewOrderLoading] = useState(false)
    const [isLogisticsLoading, setIsLogisticsLoading] = useState(false)

    const isListLoading = isFetching || isBulkLoading || isDeleteLoading

    const rows: IShopOrderListItem[] = listResponse?.data ?? []
    const total = listResponse?.total ?? 0
    const eligibleTotal = listResponse?.eligible_total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / rowsPerPage))
    const safePage = Math.min(page, totalPages)
    const isAnyOrderSelected = selectedOrders.length > 0
    const isAllOrdersSelected = rows.length > 0 && rows.every((row) => selectedOrders.includes(row.id))
    const canSelectAllByFilter = total > rows.length && isAllOrdersSelected && !bulkByFilter

    const visiblePages = useMemo(() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)
        if (safePage <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
        if (safePage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        return [1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages]
    }, [safePage, totalPages])

    useEffect(() => {
        if (isError) {
            TOAST_ERROR('Не удалось загрузить список заказов')
        }
    }, [isError, TOAST_ERROR])

    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            if (!tablePanelRef.current?.contains(event.target as Node)) {
                setOpenedOrderMenu(null)
            }
        }

        document.addEventListener('click', handleDocumentClick)
        return () => document.removeEventListener('click', handleDocumentClick)
    }, [])

    useEffect(() => {
        if (viewedOrderId == null) {
            setOrderDetail(null)
            setIsViewOrderLoading(false)
            return
        }

        setOrderDetail(null)
        setIsViewOrderLoading(true)

        getShopOrder(viewedOrderId)
            .unwrap()
            .then((response) => setOrderDetail(response.data))
            .catch((err) => {
                setOrderDetail(null)
                TOAST_ERROR(getErrorMessage(err, 'Не удалось загрузить заказ'))
            })
            .finally(() => setIsViewOrderLoading(false))
    }, [viewedOrderId, getShopOrder, TOAST_ERROR])

    useEffect(() => {
        if (logisticsOrderId == null) {
            setLogisticsDetail(null)
            setIsLogisticsLoading(false)
            return
        }

        setLogisticsDetail(null)
        setIsLogisticsLoading(true)

        getShopOrder(logisticsOrderId)
            .unwrap()
            .then((response) => setLogisticsDetail(response.data))
            .catch((err) => {
                setLogisticsDetail(null)
                TOAST_ERROR(getErrorMessage(err, 'Не удалось загрузить логистику'))
            })
            .finally(() => setIsLogisticsLoading(false))
    }, [logisticsOrderId, getShopOrder, TOAST_ERROR])

    const toggleAllOrders = () => {
        if (bulkByFilter) return

        const filteredIds = rows.map((row) => row.id)
        setSelectedOrders((prev) => {
            if (isAllOrdersSelected) return prev.filter((id) => !filteredIds.includes(id))
            return Array.from(new Set([...prev, ...filteredIds]))
        })
    }

    const toggleOrder = (orderId: number) => {
        if (bulkByFilter) {
            setBulkByFilter(false)
        }
        setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
    }

    const enableBulkByFilter = () => {
        setBulkByFilter(true)
        setSelectedOrders([])
    }

    const disableBulkByFilter = () => {
        setBulkByFilter(false)
        setSelectedOrders([])
    }

    const openOrderView = (row: IShopOrderListItem) => {
        setViewedOrderId(row.id)
        setOpenedOrderMenu(null)
    }

    const openLogisticsView = (row: IShopOrderListItem) => {
        setLogisticsOrderId(row.id)
        setOpenedOrderMenu(null)
    }

    const openOrderEdit = (row: IShopOrderListItem) => {
        setEditingOrderId(row.id)
        setIsFormOpen(true)
        setOpenedOrderMenu(null)
    }

    const handleDeleteOrder = async (row: IShopOrderListItem) => {
        if (!window.confirm(`Удалить заказ ${row.order_no}?`)) return

        try {
            const response = await deleteShopOrder(row.id).unwrap()
            TOAST_SUCCESS(response.message || 'Заказ удалён')
            setSelectedOrders((prev) => prev.filter((id) => id !== row.id))
            setOpenedOrderMenu(null)
        } catch (err) {
            TOAST_ERROR(getErrorMessage(err, 'Не удалось удалить заказ'))
        }
    }

    const applyFilters = () => {
        setAppliedFilters({
            orderNo: orderNoFilter.trim(),
            payment: paymentFilter,
            logistics: logisticsFilter,
            dateFrom: dateFromFilter,
            dateTo: dateToFilter,
        })
        setPage(1)
        setBulkByFilter(false)
    }

    const resetFilters = () => {
        setOrderNoFilter('')
        setPaymentFilter('all')
        setLogisticsFilter('all')
        setDateFromFilter('')
        setDateToFilter('')
        setAppliedFilters({ orderNo: '', payment: 'all', logistics: 'all', dateFrom: '', dateTo: '' })
        setActiveTab(tabs[0])
        setPage(1)
        setBulkByFilter(false)
    }

    const handleBulkPurchase = async () => {
        if (!bulkByFilter && !selectedOrders.length) return

        try {
            const response = bulkByFilter
                ? await bulkPurchase({ filter: listFilter }).unwrap()
                : await bulkPurchase({ ids: selectedOrders }).unwrap()

            TOAST_SUCCESS(response.message || `Обновлено заказов: ${response.data.updated}`)
            setSelectedOrders([])
            setBulkByFilter(false)
        } catch (err) {
            TOAST_ERROR(getErrorMessage(err, 'Не удалось выполнить массовую покупку'))
        }
    }

    const openCreateForm = () => {
        setEditingOrderId(null)
        setIsFormOpen(true)
    }

    const closeForm = () => {
        setIsFormOpen(false)
        setEditingOrderId(null)
    }

    const order = orderDetail?.order
    const products = orderDetail?.products ?? []
    const product = products[0]

    return (
        <div className={styles.SalesListModule}>
            <PageLoader active={isListLoading} />

            <div className={styles.mobileFilterBar}>
                <button
                    className={isMobileFiltersOpen ? styles.mobileFilterButtonActive : styles.mobileFilterButton}
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

            <div className={styles.tabsPanel}>
                {tabs.map((tab) => (
                    <button
                        className={activeTab === tab ? styles.tabActive : styles.tab}
                        type='button'
                        onClick={() => {
                            setActiveTab(tab)
                            setPage(1)
                        }}
                        key={tab}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <section className={`${styles.filtersPanel} ${isMobileFiltersOpen ? styles.filtersPanelOpen : ''}`}>
                <div className={styles.mobileTabsInFilters}>
                    {tabs.map((tab) => (
                        <button
                            className={activeTab === tab ? styles.tabActive : styles.tab}
                            type='button'
                            onClick={() => {
                                setActiveTab(tab)
                                setPage(1)
                            }}
                            key={tab}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className={styles.filtersGrid}>
                    <label className={styles.filterField}>
                        <span>Номер заказа</span>
                        <input
                            type='text'
                            value={orderNoFilter}
                            onChange={(event) => setOrderNoFilter(event.target.value)}
                        />
                    </label>
                    <label className={styles.filterField}>
                        <span>Статус оплаты</span>
                        <select
                            value={paymentFilter}
                            onChange={(event) => setPaymentFilter(event.target.value)}
                        >
                            <option value='all'>Все</option>
                            {paymentStatuses.map((status) => (
                                <option
                                    value={status}
                                    key={status}
                                >
                                    {status}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.filterField}>
                        <span>Статус логистики</span>
                        <select
                            value={logisticsFilter}
                            onChange={(event) => setLogisticsFilter(event.target.value)}
                        >
                            <option value='all'>Все</option>
                            {logisticsStatuses.map((status) => (
                                <option
                                    value={status}
                                    key={status}
                                >
                                    {status}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className={styles.dateRange}>
                        <span>Время заказа</span>
                        <input
                            type='date'
                            value={dateFromFilter}
                            onChange={(event) => setDateFromFilter(event.target.value)}
                        />
                        <b>до</b>
                        <input
                            type='date'
                            value={dateToFilter}
                            onChange={(event) => setDateToFilter(event.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.filterActions}>
                    <button
                        className={styles.primaryButton}
                        type='button'
                        onClick={applyFilters}
                    >
                        Найти
                    </button>
                    <button
                        className={styles.secondaryButton}
                        type='button'
                        onClick={resetFilters}
                    >
                        Сбросить
                    </button>
                </div>
            </section>

            <section
                className={styles.tablePanel}
                ref={tablePanelRef}
            >
                <div className={styles.tableToolbar}>
                    <div className={styles.tableToolbarActions}>
                        <button
                            className={styles.createButton}
                            type='button'
                            onClick={openCreateForm}
                        >
                            Создать заказ
                        </button>
                        <button
                            className={styles.bulkButton}
                            type='button'
                            disabled={(!bulkByFilter && !selectedOrders.length) || isBulkLoading || (bulkByFilter && eligibleTotal === 0)}
                            onClick={handleBulkPurchase}
                        >
                            Массовая покупка
                        </button>
                    </div>
                </div>

                {bulkByFilter ? (
                    <div className={styles.bulkStatusBar}>
                        <span className={styles.selectByFilterBadge}>По фильтру: вкл</span>
                        <span className={styles.bulkHint}>
                            Будут обработаны все заказы, подходящие под текущий фильтр ({eligibleTotal})
                        </span>
                        <button
                            className={styles.selectByFilterLink}
                            type='button'
                            onClick={disableBulkByFilter}
                        >
                            Отменить
                        </button>
                    </div>
                ) : canSelectAllByFilter ? (
                    <div className={styles.bulkStatusBar}>
                        <span className={styles.bulkHint}>
                            Выбраны все заказы на странице ({rows.length}).
                        </span>
                        <button
                            className={styles.selectByFilterLink}
                            type='button'
                            onClick={enableBulkByFilter}
                        >
                            Выбрать все {eligibleTotal} по фильтру
                        </button>
                    </div>
                ) : isAnyOrderSelected ? (
                    <div className={styles.bulkStatusBar}>
                        <span className={styles.bulkHint}>Выбрано заказов: {selectedOrders.length}</span>
                        <button
                            className={styles.selectByFilterLink}
                            type='button'
                            onClick={enableBulkByFilter}
                        >
                            Переключить на выбор по фильтру ({eligibleTotal})
                        </button>
                    </div>
                ) : null}

                <div className={styles.tableWrap}>
                    <table className={styles.ordersTable}>
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type='checkbox'
                                        checked={bulkByFilter ? rows.length > 0 : isAllOrdersSelected}
                                        disabled={bulkByFilter || !rows.length}
                                        onChange={toggleAllOrders}
                                    />
                                </th>
                                <th>Номер заказа</th>
                                <th>Получатель</th>
                                <th>Сумма товаров</th>
                                <th>Прибыль</th>
                                <th>Статус оплаты</th>
                                <th>Статус покупки</th>
                                <th>Статус логистики</th>
                                <th>Время заказа</th>
                                <th>Операции</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr key={row.id}>
                                    <td>
                                        <input
                                            type='checkbox'
                                            checked={bulkByFilter || selectedOrders.includes(row.id)}
                                            disabled={bulkByFilter}
                                            onChange={() => toggleOrder(row.id)}
                                        />
                                    </td>
                                    <td>{row.order_no}</td>
                                    <td>{row.consignee}</td>
                                    <td>{formatMoney(row.sales_amount)}</td>
                                    <td>{formatMoney(row.profit)}</td>
                                    <td>{row.payment_status}</td>
                                    <td>
                                        <span className={styles.statusBadge}>{row.purchase_status}</span>
                                    </td>
                                    <td>{row.logistics_status}</td>
                                    <td>{formatDateTime(row.order_time)}</td>
                                    <td className={styles.operationCell}>
                                        <button
                                            className={styles.operationButton}
                                            type='button'
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                setOpenedOrderMenu(openedOrderMenu === row.id ? null : row.id)
                                            }}
                                        >
                                            Операции
                                            <span className={styles.operationArrow} />
                                        </button>
                                        {openedOrderMenu === row.id ? (
                                            <div
                                                className={styles.operationMenu}
                                                onClick={(event) => event.stopPropagation()}
                                            >
                                                <button
                                                    type='button'
                                                    onClick={() => openOrderView(row)}
                                                >
                                                    Просмотр заказа
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => openLogisticsView(row)}
                                                >
                                                    Логистическая информация
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => openOrderEdit(row)}
                                                >
                                                    Редактировать
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => handleDeleteOrder(row)}
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                            {!rows.length && !isListLoading ? (
                                <tr>
                                    <td
                                        colSpan={10}
                                        className={styles.emptyCell}
                                    >
                                        Заказы не найдены
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                <div className={styles.pagination}>
                    <div className={styles.paginationMeta}>
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

                    <div className={styles.paginationPages}>
                        <button
                            type='button'
                            disabled={safePage === 1}
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        >
                            ‹
                        </button>
                        {visiblePages.map((pageItem, index) => (
                            <button
                                className={pageItem === safePage ? styles.pageActive : undefined}
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

                    <div className={styles.paginationJump}>
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

            <ModalSample
                title={order ? `Номер заказа: ${order.order_no}` : 'Просмотр заказа'}
                toggleModal={Boolean(viewedOrderId)}
                onCloseModal={() => setViewedOrderId(null)}
                style={modalWidth}
            >
                <div className={styles.modalBody}>
                    <PageLoader active={isViewOrderLoading} />
                    {order ? (
                        <div className={styles.orderModal}>
                        <section className={styles.modalBlock}>
                            <h3>Сводка заказа</h3>
                            <div className={styles.summaryGrid}>
                                <OrderInfo label='Номер заказа' value={order.order_no} />
                                <OrderInfo label='Время заказа' value={formatDateTime(order.order_time)} />
                                <OrderInfo label='Метод оплаты' value={order.payment_method ?? '—'} />
                                <OrderInfo label='Статус оплаты' value={order.payment_status} />
                                <OrderInfo label='Статус покупки' value={order.purchase_status} badge />
                                <OrderInfo label='Статус логистики' value={order.logistics_status} />
                                <OrderInfo label='Сумма покупки' value={formatMoney(order.purchase_amount)} />
                                <OrderInfo label='Сумма продаж' value={formatMoney(order.sales_amount)} />
                                <OrderInfo label='Время покупки' value={formatDateTime(order.purchase_time)} />
                                <OrderInfo label='Прибыль' value={formatMoney(order.profit)} />
                            </div>
                            <div className={styles.customerGrid}>
                                <OrderInfo label='Имя' value={order.consignee_name} />
                                <OrderInfo label='Email' value={order.consignee_email ?? '—'} />
                                <OrderInfo label='Адрес' value={order.consignee_address ?? '—'} />
                                <OrderInfo label='Телефон' value={order.consignee_phone ?? '—'} />
                                <OrderInfo label='Страна' value={order.consignee_country ?? '—'} />
                                <OrderInfo label='Провинция и район' value={order.consignee_province ?? '—'} />
                                <OrderInfo label='Город' value={order.consignee_city ?? '—'} />
                                <OrderInfo label='Почтовый индекс' value={order.consignee_postal_code ?? '—'} />
                            </div>
                        </section>

                        <div className={styles.modalBottomGrid}>
                            <section className={styles.modalBlock}>
                                <h3>Детали заказа</h3>
                                {product ? (
                                    <div className={styles.productCard}>
                                        <img
                                            src={product.image ?? 'https://picsum.photos/seed/order-printer/120/120'}
                                            alt='Товар заказа'
                                        />
                                        <div className={styles.productInfo}>
                                            <span>Номер товара</span>
                                            <b>{product.product_number ?? '—'}</b>
                                        </div>
                                        <div className={styles.productInfo}>
                                            <span>Название товара</span>
                                            <b>{product.product_name}</b>
                                        </div>
                                        <div className={styles.productInfo}>
                                            <span>Спецификация</span>
                                            <b>{product.specification ?? '—'}</b>
                                        </div>
                                        <div className={styles.productInfo}>
                                            <span>Кол-во</span>
                                            <b>{product.quantity}</b>
                                        </div>
                                    </div>
                                ) : (
                                    <p>Товары не найдены</p>
                                )}
                            </section>

                            <section className={styles.modalBlock}>
                                <h3>Сумма заказа</h3>
                                <div className={styles.amountList}>
                                    <OrderAmount label='Подытог' value={formatMoney(order.subtotal)} />
                                    <OrderAmount label='Налог' value={formatMoney(order.tax)} />
                                    <OrderAmount label='Доставка' value={formatMoney(order.shipping)} />
                                    <OrderAmount label='Скидка' value={formatMoney(order.discount)} />
                                    <OrderAmount label='Итого' value={formatMoney(order.total)} />
                                </div>
                            </section>
                        </div>
                        </div>
                    ) : null}
                </div>
            </ModalSample>

            <ModalSample
                title='Логистическая информация'
                toggleModal={Boolean(logisticsOrderId)}
                onCloseModal={() => setLogisticsOrderId(null)}
                style={{ width: 'min(38rem, calc(100vw - 1.5rem))' }}
            >
                <div className={styles.modalBody}>
                    <PageLoader active={isLogisticsLoading} />
                    {logisticsDetail ? (
                        <div className={styles.logisticsModal}>
                            {logisticsDetail.logistics_events.map((event) => (
                                <LogisticsItem
                                    key={event.id}
                                    date={formatDateTime(event.event_time)}
                                    orderId={logisticsDetail.order.order_no}
                                    text={event.text}
                                />
                            ))}
                            {!logisticsDetail.logistics_events.length ? <p>События не найдены</p> : null}
                        </div>
                    ) : null}
                </div>
            </ModalSample>

            <ShopOrderFormModal
                open={isFormOpen}
                orderId={editingOrderId}
                onClose={closeForm}
                onSuccess={TOAST_SUCCESS}
                onError={TOAST_ERROR}
            />
        </div>
    )
}

interface OrderInfoProps {
    label: string
    value: string
    badge?: boolean
}

const OrderInfo = ({ label, value, badge }: OrderInfoProps) => (
    <div className={styles.orderInfo}>
        <span>{label}</span>
        {badge ? <b className={styles.modalStatusBadge}>{value}</b> : <b>{value}</b>}
    </div>
)

const OrderAmount = ({ label, value }: OrderInfoProps) => (
    <div className={styles.orderAmount}>
        <span>{label}</span>
        <b>{value}</b>
    </div>
)

interface LogisticsItemProps {
    date: string
    orderId: string
    text: string
}

const LogisticsItem = ({ date, orderId, text }: LogisticsItemProps) => (
    <div className={styles.logisticsItem}>
        <time>{date}</time>
        <p>
            Заказ <span>{orderId}</span> {text}
        </p>
    </div>
)

export default SalesListModule
