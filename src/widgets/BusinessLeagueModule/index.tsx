import styles from './BusinessLeagueModule.module.css'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { ListAltRoundedIcon } from '@/shared/ui/icons/ListAltRoundedIcon'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { PageLoader } from '@/shared/ui/PageLoader'
import {
    useGetBusinessLeagueFriendsQuery,
    useGetBusinessLeagueSummaryQuery,
} from '@/shared/api/list/businessLeagueApi'
import type { BusinessLeagueFriendLevel } from '@/shared/api/list/businessLeagueApi/types.ts'

type FriendLevelTab = 'first' | 'second' | 'third'

const friendTabs: { id: FriendLevelTab; label: string; level: BusinessLeagueFriendLevel }[] = [
    { id: 'first', label: 'Друзья 1-го уровня', level: 1 },
    { id: 'second', label: 'Друзья 2-го уровня', level: 2 },
    { id: 'third', label: 'Друзья 3-го уровня', level: 3 },
]

const formatMoney = (value: number) =>
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const BusinessLeagueModule = () => {
    useSetPageTitle('Бизнес-лига')
    const [activeTab, setActiveTab] = useState<FriendLevelTab>('first')
    const activeLevel = friendTabs.find((tab) => tab.id === activeTab)?.level ?? 1

    const { data: summaryResponse, isLoading: isSummaryLoading, isFetching: isSummaryFetching } =
        useGetBusinessLeagueSummaryQuery()
    const { data: friendsResponse, isLoading: isFriendsLoading, isFetching: isFriendsFetching } =
        useGetBusinessLeagueFriendsQuery(activeLevel)

    const referralCode = summaryResponse?.data?.referral_code ?? ''
    const friends = friendsResponse?.data ?? []
    const isLoading = isSummaryLoading || isFriendsLoading
    const isFetching = isSummaryFetching || isFriendsFetching

    const invitationLink = useMemo(() => {
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        if (!referralCode) {
            return `${origin}/sign-up`
        }
        return `${origin}/sign-up?invite=${encodeURIComponent(referralCode)}`
    }, [referralCode])

    const copyToClipboard = async (value: string, successMessage: string) => {
        try {
            await navigator.clipboard.writeText(value)
            toast.success(successMessage)
        } catch {
            toast.error('Не удалось скопировать')
        }
    }

    return (
        <div className={styles.BusinessLeagueModule}>
            <PageLoader active={isLoading || isFetching} />
            <section className={`${styles.card} ${styles.inviteCard}`}>
                <div className={styles.inviteRow}>
                    <span className={styles.inviteLabel}>Ссылка для приглашения</span>
                    <div className={styles.inviteControl}>
                        <input
                            className={styles.inviteInput}
                            type='text'
                            value={invitationLink}
                            readOnly
                            aria-label='Ссылка для приглашения'
                        />
                        <button
                            className={styles.copyButton}
                            type='button'
                            onClick={() => copyToClipboard(invitationLink, 'Ссылка скопирована')}
                        >
                            Копировать
                        </button>
                    </div>
                </div>

                <div className={styles.inviteRow}>
                    <span className={styles.inviteLabel}>Код приглашения</span>
                    <div className={styles.inviteControl}>
                        <input
                            className={styles.inviteInput}
                            type='text'
                            value={referralCode}
                            readOnly
                            aria-label='Код приглашения'
                        />
                        <button
                            className={styles.copyButton}
                            type='button'
                            disabled={!referralCode}
                            onClick={() => copyToClipboard(referralCode, 'Код скопирован')}
                        >
                            Копировать
                        </button>
                    </div>
                </div>
            </section>

            <section className={`${styles.card} ${styles.rulesCard}`}>
                <h2 className={styles.rulesTitle}>Правила программы</h2>

                <p className={styles.rulesIntro}>
                    Став членом торгового альянса, вы можете пригласить друзей зарегистрироваться через свой код
                    приглашения. Когда ваш друг заполнит заказ на нашей платформе, вы можете получить соответствующую
                    комиссию. Другая доля обмена. Продуктная прибыль от первого уровня друзей даст вам подразделение{' '}
                    <strong>10%</strong>, продажа прибыли второго уровня друзей даст вам подразделение <strong>5%</strong>,
                    полученная прибыль третьего друга даст вам подразделение <strong>3%</strong>.
                </p>

                <div className={styles.formulasBlock}>
                    <h3 className={styles.formulasHeading}>Ниже приведено разделение формул расчёта:</h3>
                    <ul className={styles.formulaList}>
                        <li className={styles.formulaItem}>
                            <span className={styles.formulaLevel}>Друзья 1-го уровня</span>
                            <p className={styles.formulaExpression}>
                                First-Level Friends делятся на формулу расчёта:{' '}
                                <code>Commercial = Commodity Sales Profit × 10%</code>
                            </p>
                        </li>
                        <li className={styles.formulaItem}>
                            <span className={styles.formulaLevel}>Друзья 2-го уровня</span>
                            <p className={styles.formulaExpression}>
                                Друзья второго уровня делятся на формулу расчёта:{' '}
                                <code>Commercial = Commodity Sales Profit × 5%</code>
                            </p>
                        </li>
                        <li className={styles.formulaItem}>
                            <span className={styles.formulaLevel}>Друзья 3-го уровня</span>
                            <p className={styles.formulaExpression}>
                                Три-уровень друзей разделены на формулу расчёта:{' '}
                                <code>Комиссия = Количественная прибыль продаж × 3%</code>
                            </p>
                        </li>
                    </ul>
                </div>

                <p className={styles.rulesOutro}>
                    Мы предоставляем подробное разделение вычислительных формул, чтобы вы могли четко понимать метод
                    расчёта комиссии. Мы рекомендуем вам понять правила приглашения платформы, чтобы лучше управлять и
                    планировать ваш комиссион. Мы благодарим вас за участие и с нетерпением ждём впередразвиваться с вами.
                </p>
            </section>

            <section className={`${styles.card} ${styles.friendsCard}`}>
                <div
                    className={styles.tabsBar}
                    role='tablist'
                    aria-label='Уровни друзей'
                >
                    {friendTabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={activeTab === tab.id ? styles.tabActive : styles.tab}
                            type='button'
                            role='tab'
                            aria-selected={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div
                    className={styles.tabContent}
                    role='tabpanel'
                >
                    {friends.length === 0 ? (
                        <div className={styles.emptyState}>
                            <span
                                className={styles.emptyIcon}
                                aria-hidden
                            >
                                <ListAltRoundedIcon size={28} />
                            </span>
                            <p>Нет записей</p>
                        </div>
                    ) : (
                        <div className={styles.tableWrap}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Магазин</th>
                                        <th>Пользователь</th>
                                        <th>Регистрация</th>
                                        <th>Заказы</th>
                                        <th>Прибыль</th>
                                        <th>Комиссия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {friends.map((friend) => (
                                        <tr key={friend.user_id}>
                                            <td>{friend.shop_name ?? '—'}</td>
                                            <td>{friend.user_name ?? '—'}</td>
                                            <td>{friend.registered_at ?? '—'}</td>
                                            <td>{friend.orders_count}</td>
                                            <td>{formatMoney(friend.total_profit)}</td>
                                            <td>{formatMoney(friend.commission_earned)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default BusinessLeagueModule
