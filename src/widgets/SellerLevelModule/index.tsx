import styles from './SellerLevelModule.module.css'
import { formatOperatingFunds, sellerLevelIconSrc, sellerLevelRows } from './mockData'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { PageLoader } from '@/shared/ui/PageLoader'
import { useGetSellerLevelSummaryQuery } from '@/shared/api/list/sellerLevelApi'
import type { SellerLevelId } from '@/shared/api/list/sellerLevelApi/types.ts'

const SELLER_LEVEL_BANNER_URL =
    'https://rk.emagseller.com/ww/static/img/seller-level-image.8224dbeb.png'

const MAX_HEADER_LINES = 2

const tableColumns: { className: string; lines: string[] }[] = [
    { className: styles.colLevel, lines: ['Уровень', 'продавца'] },
    { className: styles.colFunds, lines: ['Операционные', 'средства'] },
    { className: styles.colBranches, lines: ['Кол-во', 'филиалов'] },
    { className: styles.colProfit, lines: ['Прибыль', 'от продаж'] },
    { className: styles.colTraffic, lines: ['Трафик платформы', 'в день'] },
    { className: styles.colDelivery, lines: ['Доставка', '(дни)'] },
    { className: styles.colDiscount, lines: ['Скидка на', 'покупку'] },
    { className: styles.colBonus, lines: ['Бонус за', 'повышение'] },
    { className: styles.colService, lines: ['Эксклюзивный', 'сервис'] },
    { className: styles.colHome, lines: ['На главной'] },
]

const SellerLevelModule = () => {
    useSetPageTitle('Уровень продавца')

    const { data: summaryResponse, isLoading, isFetching } = useGetSellerLevelSummaryQuery()
    const summary = summaryResponse?.data

    const currentLevelId: SellerLevelId = summary?.current.level_id ?? 'C'
    const branchesCount = summary?.current.branches_count ?? 0
    const teamSize = summary?.current.team_size ?? 0
    const tableRows =
        summary?.tiers.map((tier) => ({
            id: tier.id,
            label: tier.label,
            operatingFunds: tier.operating_funds,
            branches: tier.branches,
            profitRatio: tier.profit_ratio,
            trafficSupport: tier.traffic_support,
            globalDeliveryDays: tier.global_delivery_days,
            purchaseDiscount: tier.purchase_discount,
            upgradeBonus: tier.upgrade_bonus,
            exclusiveService: tier.exclusive_service,
            homePageRecommendation: tier.home_page_recommendation,
        })) ?? sellerLevelRows

    return (
        <div className={styles.SellerLevelModule}>
            <PageLoader active={isLoading || isFetching} />
            <section className={`${styles.card} ${styles.introCard}`}>
                <div className={styles.bannerColumn}>
                    <img
                        className={styles.banner}
                        src={SELLER_LEVEL_BANNER_URL}
                        alt='Рост продаж и финансовая поддержка'
                        loading='lazy'
                    />
                    <div className={styles.bannerOverlay}>
                        <h2 className={styles.currentLevelTitle}>Уровень</h2>
                        <LevelIconWithLetter id={currentLevelId} />
                    </div>
                </div>

                <div className={styles.introContent}>
                    <p className={styles.heroEyebrow}>Поддержка роста продаж</p>
                    <h2 className={styles.heroTitle}>Лёгкий ежемесячный доход свыше 10&nbsp;000</h2>

                    <div className={styles.statsRow}>
                        <p className={styles.statItem}>
                            Текущее количество филиалов: <span>{branchesCount}</span>
                        </p>
                        <p className={styles.statItem}>
                            Текущий размер команды: <span>{teamSize}</span>
                        </p>
                    </div>

                    <div className={styles.sections}>
                        <div className={styles.sectionBlock}>
                            <h3 className={styles.sectionTitle}>1. Введение в уровни продавца</h3>
                            <p className={styles.sectionText}>
                                Повышение уровня продавца открывает больше деловых возможностей и повышает шансы на
                                успех в продажах. Платформа поощряет продавцов развивать свой уровень, предлагая щедрые
                                вознаграждения и более высокие коэффициенты распределения прибыли.
                            </p>
                        </div>

                        <div className={styles.sectionBlock}>
                            <h3 className={styles.sectionTitle}>2. Инструкции по повышению уровня участника</h3>
                            <ul className={styles.bulletList}>
                                <li>
                                    <strong>Повышение членства:</strong> определяется количеством напрямую
                                    рекомендованных филиалов или выполнением требований к операционным средствам.
                                    Повышение происходит автоматически.
                                </li>
                                <li>
                                    <strong>Количество филиалов:</strong> прямые подчинённые с накопленной суммой
                                    пополнения свыше $100.00.
                                </li>
                                <li>
                                    <strong>Размер команды:</strong> все подчинённые с накопленной суммой пополнения
                                    свыше $100.00.
                                </li>
                                <li>
                                    <strong>Коэффициент прибыли от продаж:</strong> чем выше уровень, тем выше прибыль
                                    от продаж.
                                </li>
                                <li>
                                    <strong>Поддержка трафика платформы:</strong> система в приоритетном порядке
                                    выделяет трафик продавцам с более высоким уровнем.
                                </li>
                                <li>
                                    <strong>Бонус за повышение:</strong> при каждом успешном повышении уровня
                                    автоматически начисляется бонус.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.sectionBlock}>
                            <h3 className={styles.sectionTitle}>3. Правила роста</h3>
                            <p className={styles.sectionText}>
                                Уровень членства рассчитывается с момента повышения и действует пожизненно.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`${styles.card} ${styles.tableCard}`}>
                <div className={styles.levelsTableWrap}>
                    <table className={styles.levelsTable}>
                        <thead>
                            <tr>
                                {tableColumns.map((column) => (
                                    <th
                                        key={column.className}
                                        className={column.className}
                                    >
                                        <span className={styles.thLabel}>
                                            {column.lines.slice(0, MAX_HEADER_LINES).map((line, index) => (
                                                <span key={`${column.className}-${index}`}>
                                                    {index > 0 ? <br /> : null}
                                                    {line}
                                                </span>
                                            ))}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.map((row) => (
                                <tr key={row.id}>
                                    <td
                                        className={styles.colLevel}
                                        title={row.label}
                                    >
                                        <span className={styles.levelCell}>
                                            <span
                                                className={styles.levelIconSlot}
                                                aria-hidden
                                            >
                                                <img
                                                    className={styles.levelIcon}
                                                    src={sellerLevelIconSrc(row.id)}
                                                    alt=''
                                                    width={20}
                                                    height={20}
                                                />
                                            </span>
                                            <span className={styles.levelName}>{row.label}</span>
                                        </span>
                                    </td>
                                    <td className={`${styles.colFunds} ${styles.numericCell}`}>
                                        {formatOperatingFunds(row.operatingFunds)}
                                    </td>
                                    <td className={`${styles.colBranches} ${styles.numericCell}`}>{row.branches}</td>
                                    <td className={styles.colProfit}>{row.profitRatio}</td>
                                    <td className={styles.colTraffic}>{row.trafficSupport}</td>
                                    <td className={`${styles.colDelivery} ${styles.numericCell}`}>
                                        {row.globalDeliveryDays}
                                    </td>
                                    <td className={styles.colDiscount}>{row.purchaseDiscount}</td>
                                    <td className={`${styles.colBonus} ${styles.bonusCell}`}>{row.upgradeBonus}</td>
                                    <td className={styles.colService}>
                                        <StatusIcon value={row.exclusiveService} />
                                    </td>
                                    <td className={styles.colHome}>
                                        <StatusIcon value={row.homePageRecommendation} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

const LevelIconWithLetter = ({ id }: { id: SellerLevelId }) => (
    <span className={styles.currentLevelBadge}>
        <img
            className={styles.currentLevelIcon}
            src={sellerLevelIconSrc(id)}
            alt={`Уровень ${id}`}
            width={104}
            height={104}
        />
        <span
            className={styles.currentLevelLetter}
            data-level={id}
        >
            {id}
        </span>
    </span>
)

const StatusIcon = ({ value }: { value: boolean }) =>
    value ? (
        <span
            className={styles.statusYes}
            aria-label='Да'
            title='Да'
        >
            ✓
        </span>
    ) : (
        <span
            className={styles.statusNo}
            aria-label='Нет'
            title='Нет'
        >
            ✕
        </span>
    )

export default SellerLevelModule
