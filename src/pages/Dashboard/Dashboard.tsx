import LayoutContent from '@/widgets/general/LayoutContent'
import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js'
import { Line } from 'react-chartjs-2'
import styles from './Dashboard.module.css'
import { PageLoader } from '@/shared/ui/PageLoader'
import { DashboardTitle } from '@/pages/Dashboard/ui/DashboardTitle.tsx'
import {
    useGetDashboardCategoriesQuery,
    useGetDashboardChartQuery,
    useGetDashboardSummaryQuery,
    useGetDashboardTopSellersQuery,
} from '@/shared/api/list/dashboardApi'
import type { DashboardChartPeriod } from '@/shared/api/list/dashboardApi/types.ts'
import { useAppSelector } from '@/shared/store'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const chartPeriodLabels: Record<DashboardChartPeriod, string> = {
    today: 'Сегодня',
    week: '7 дней',
    month: '30 дней',
}

type HoveredChartDataset = 'sales' | 'visits' | null

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            enabled: true,
            mode: 'index' as const,
            intersect: false,
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(50, 50, 50, 0.06)',
            },
        },
    },
}

const formatMoney = (value: number) =>
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const formatNumber = (value: number) => value.toLocaleString('en-US')

const categoryPlaceholder = (id: number) => `https://picsum.photos/seed/category-${id}/420/260`

const Dashboard = () => {
    const [activePeriod, setActivePeriod] = useState<DashboardChartPeriod>('today')
    const [hoveredDataset, setHoveredDataset] = useState<HoveredChartDataset>(null)
    const role = useAppSelector((state) => state.auth.role)
    const selectedSellerId = useAppSelector((state) => state.shopContext.selectedSellerId)
    const isAdmin = role === 'admin' || role === 'superadmin'
    const skipSellerScoped = isAdmin && selectedSellerId === null
    const queryOptions = { skip: skipSellerScoped }

    const { data: summaryResponse, isLoading: isSummaryLoading, isFetching: isSummaryFetching } =
        useGetDashboardSummaryQuery(undefined, queryOptions)
    const { data: chartResponse, isLoading: isChartLoading, isFetching: isChartFetching } =
        useGetDashboardChartQuery(activePeriod, queryOptions)
    const { data: categoriesResponse, isLoading: isCategoriesLoading, isFetching: isCategoriesFetching } =
        useGetDashboardCategoriesQuery(undefined, queryOptions)
    const { data: topSellersResponse, isLoading: isTopLoading, isFetching: isTopFetching } = useGetDashboardTopSellersQuery()

    const summary = summaryResponse?.data
    const chart = chartResponse?.data
    const categories = categoriesResponse?.data ?? []
    const topSellers = topSellersResponse?.data ?? []

    const isLoading = isSummaryLoading || isChartLoading || isCategoriesLoading || isTopLoading
    const isFetching = isSummaryFetching || isChartFetching || isCategoriesFetching || isTopFetching

    const metrics = summary
        ? [
              { title: 'Общее количество продуктов', value: formatNumber(summary.metrics.products_count), tone: 'pink' },
              { title: 'Общая сумма продаж', value: formatMoney(summary.metrics.total_sales), tone: 'blue' },
              { title: 'Общий заказ', value: formatNumber(summary.metrics.total_orders), tone: 'violet' },
              { title: 'Общая прибыль', value: formatMoney(summary.metrics.total_profit), tone: 'green' },
          ]
        : []

    const shopOverview = summary
        ? [
              { label: 'Общий рейтинг', value: String(summary.shop_overview.rating) },
              { label: 'Кредит продавца', value: String(summary.shop_overview.seller_credit) },
              { label: 'Подписчики магазина', value: formatNumber(summary.shop_overview.subscribers_count) },
          ]
        : []

    const streamProfile = summary
        ? [
              { label: 'Посетители сегодня', value: formatNumber(summary.traffic.today) },
              { label: 'За 7 дней', value: formatNumber(summary.traffic.last_7_days) },
              { label: 'За 30 дней', value: formatNumber(summary.traffic.last_30_days) },
          ]
        : []

    const todayOverview = summary
        ? [
              { label: 'Заказы сегодня', value: formatNumber(summary.today.orders_today) },
              { label: 'Продажи сегодня', value: formatMoney(summary.today.sales_today) },
              { label: 'Ожидаемая прибыль', value: formatMoney(summary.today.profit_today) },
          ]
        : []

    const orderStats = summary
        ? [
              { label: 'Всего заказов', value: formatNumber(summary.order_stats.total) },
              { label: 'В процессе', value: formatNumber(summary.order_stats.in_progress) },
              { label: 'Завершено', value: formatNumber(summary.order_stats.completed) },
              { label: 'Отменено', value: formatNumber(summary.order_stats.cancelled) },
          ]
        : []

    const chartData = useMemo(() => {
        const salesDimmed = hoveredDataset === 'visits'
        const visitsDimmed = hoveredDataset === 'sales'
        const labels = chart?.labels ?? []
        const sales = chart?.sales ?? []
        const visits = chart?.visits ?? []

        return {
            labels,
            datasets: [
                {
                    label: `Объем продаж: ${chartPeriodLabels[activePeriod]}`,
                    data: sales,
                    borderColor: salesDimmed ? 'rgba(244, 113, 57, 0.25)' : '#f47139',
                    backgroundColor: salesDimmed ? 'rgba(244, 113, 57, 0.03)' : 'rgba(244, 113, 57, 0.1)',
                    pointBackgroundColor: salesDimmed ? 'rgba(244, 113, 57, 0.25)' : '#f47139',
                    pointBorderWidth: 0,
                    pointRadius: salesDimmed ? 1.5 : 2.5,
                    borderWidth: salesDimmed ? 1.5 : 2.5,
                    fill: true,
                    tension: 0.36,
                },
                {
                    label: `Посещения: ${chartPeriodLabels[activePeriod]}`,
                    data: visits,
                    borderColor: visitsDimmed ? 'rgba(79, 140, 255, 0.25)' : '#4f8cff',
                    backgroundColor: visitsDimmed ? 'rgba(79, 140, 255, 0.03)' : 'rgba(79, 140, 255, 0.1)',
                    pointBackgroundColor: visitsDimmed ? 'rgba(79, 140, 255, 0.25)' : '#4f8cff',
                    pointBorderWidth: 0,
                    pointRadius: visitsDimmed ? 1.5 : 2.5,
                    borderWidth: visitsDimmed ? 1.5 : 2.5,
                    fill: true,
                    tension: 0.36,
                },
            ],
        }
    }, [activePeriod, chart, hoveredDataset])

    return (
        <LayoutContent>
            <PageLoader active={isLoading || isFetching} />
            <DashboardTitle shopName={summary?.shop?.name} />
            <div className={styles.dashboard}>
                <section className={styles.metricsGrid}>
                    {metrics.map((item, index) => (
                        <article
                            className={`${styles.metricCard} ${styles[item.tone]}`}
                            style={{ animationDelay: `${index * 35}ms` }}
                            key={item.title}
                        >
                            <strong>{item.value}</strong>
                            <span>{item.title}</span>
                        </article>
                    ))}
                </section>

                <section className={styles.overviewGrid}>
                    <OverviewCard
                        title='Обзор магазина'
                        items={shopOverview}
                        delay={140}
                    />
                    <OverviewCard
                        title='Профиль потока'
                        items={streamProfile}
                        delay={175}
                    />
                    <OverviewCard
                        title='Сегодняшний обзор'
                        items={todayOverview}
                        delay={210}
                    />
                </section>

                <section
                    className={`${styles.panel} ${styles.chartPanel}`}
                    style={{ animationDelay: '245ms' }}
                >
                    <div className={styles.panelHeader}>
                        <h2>График объема продаж</h2>
                        <div className={styles.periodTabs}>
                            {(Object.keys(chartPeriodLabels) as DashboardChartPeriod[]).map((periodKey) => (
                                <button
                                    className={activePeriod === periodKey ? styles.periodTabActive : undefined}
                                    type='button'
                                    onClick={() => setActivePeriod(periodKey)}
                                    key={periodKey}
                                >
                                    {chartPeriodLabels[periodKey]}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={styles.chartWrap}>
                        <div className={styles.chartLegend}>
                            <span
                                onMouseEnter={() => setHoveredDataset('sales')}
                                onMouseLeave={() => setHoveredDataset(null)}
                            >
                                <i className={styles.salesLegendMark} />
                                Объем продаж
                            </span>
                            <span
                                onMouseEnter={() => setHoveredDataset('visits')}
                                onMouseLeave={() => setHoveredDataset(null)}
                            >
                                <i className={styles.visitsLegendMark} />
                                Посещения
                            </span>
                        </div>
                        <Line
                            data={chartData}
                            options={chartOptions}
                        />
                    </div>
                </section>

                <section
                    className={`${styles.panel} ${styles.categoriesPanel}`}
                    style={{ animationDelay: '280ms' }}
                >
                    <h2>Ваши категории</h2>
                    {categories.length === 0 ? (
                        <p className={styles.emptyHint}>Нет категорий с товарами</p>
                    ) : (
                        <div className={styles.categoriesStrip}>
                            {categories.map((category) => (
                                <Link
                                    to={`${ELinks.PRODUCT_HOLD}?category_id=${category.id}`}
                                    className={styles.categoryTile}
                                    style={{
                                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.38), rgba(0, 0, 0, 0.52)), url(${category.image ?? categoryPlaceholder(category.id)})`,
                                    }}
                                    key={category.id}
                                >
                                    <strong>{category.title}</strong>
                                    <span>{category.count}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section className={styles.bottomGrid}>
                    <article
                        className={`${styles.panel} ${styles.sellersPanel}`}
                        style={{ animationDelay: '315ms' }}
                    >
                        <h2>Лучшие продавцы TOP-10</h2>
                        <div className={styles.tableWrap}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Продавец</th>
                                        <th>Продажи</th>
                                        <th>Заказы</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topSellers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4}>Нет данных</td>
                                        </tr>
                                    ) : (
                                        topSellers.map((seller) => (
                                            <tr key={seller.seller_id}>
                                                <td>{seller.rank}</td>
                                                <td>{seller.shop_name}</td>
                                                <td>{formatMoney(seller.total_sales)}</td>
                                                <td>{formatNumber(seller.orders_count)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </article>

                    <article
                        className={`${styles.panel} ${styles.orderPanel}`}
                        style={{ animationDelay: '350ms' }}
                    >
                        <h2>Статистика заказа</h2>
                        <div className={styles.orderStats}>
                            {orderStats.map((item) => (
                                <div
                                    className={styles.orderStat}
                                    key={item.label}
                                >
                                    <strong>{item.value}</strong>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </article>
                </section>
            </div>
        </LayoutContent>
    )
}

interface OverviewCardProps {
    title: string
    items: {
        label: string
        value: string
    }[]
    delay: number
}

const OverviewCard = ({ title, items, delay }: OverviewCardProps) => {
    return (
        <article
            className={styles.panel}
            style={{ animationDelay: `${delay}ms` }}
        >
            <h2>{title}</h2>
            <div className={styles.overviewItems}>
                {items.map((item) => (
                    <div
                        className={styles.overviewItem}
                        key={item.label}
                    >
                        <strong>{item.value}</strong>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </article>
    )
}

export default Dashboard
