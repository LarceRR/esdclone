import { useEffect, useRef, useState } from 'react'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import { Link, Navigate } from 'react-router-dom'
import LayoutContent from '@/widgets/general/LayoutContent'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import styles from './HelpPage.module.css'

const chapters = [
    { number: '1', title: 'Дэшборд', href: ELinks.DASHBOARD, id: 'dashboard' },
    { number: '2', title: 'Магазин заказ', href: ELinks.SALES_LIST, id: 'sales' },
    { number: '3', title: 'Финансовый отчёт', href: ELinks.FINANCIAL_REPORT, id: 'financial-report' },
    { number: '4', title: 'Мой бумажник', href: ELinks.MONEY_LIST, id: 'wallet' },
    { number: '5', title: 'Фонд записи', href: ELinks.RECORD_FUND, id: 'record-fund' },
    {
        number: '6',
        title: 'Управление продуктом',
        id: 'product-management',
        children: [
            { number: '6.1', title: 'Хранение продуктов', href: ELinks.PRODUCT_HOLD, id: 'product-hold' },
            { number: '6.2', title: 'Категории товаров', href: ELinks.CATEGORIES, id: 'categories' },
            { number: '6.3', title: 'Запросы на возврат', href: ELinks.PRODUCT_RETURN_REQUEST, id: 'returns' },
            { number: '6.4', title: 'Склад продуктов', href: ELinks.PRODUCT_WAREHOUSE, id: 'product-warehouse' },
            { number: '6.5', title: 'Импорт товаров', href: ELinks.PRODUCT_IMPORT, id: 'product-import' },
        ],
    },
    {
        number: '7',
        title: 'Другие',
        id: 'other',
        children: [
            { number: '7.1', title: 'Настройки магазина', href: ELinks.SETTINGS, id: 'settings' },
            { number: '7.2', title: 'Бизнес-лига', href: ELinks.BUSINESS_LEAGUE, id: 'business-league' },
        ],
    },
    {
        number: '8',
        title: 'Маркетинговые инструменты',
        id: 'marketing',
        children: [
            { number: '8.1', title: 'Магазин экспресс', href: ELinks.MARKETING_SHOP_EXPRESS, id: 'shop-express' },
            { number: '8.2', title: 'История покупок', href: ELinks.MARKETING_PURCHASE_HISTORY, id: 'purchase-history' },
            { number: '8.3', title: 'Уровень продавца', href: ELinks.MARKETING_SELLER_LEVEL, id: 'seller-level' },
        ],
    },
    {
        number: '9',
        title: 'Администрирование',
        id: 'administration',
        children: [
            { number: '9.1', title: 'Пользователи', href: ELinks.USERS_LIST, id: 'users' },
            { number: '9.2', title: 'Группы', href: ELinks.GROUPS_LIST, id: 'groups' },
            { number: '9.3', title: 'Страницы', href: ELinks.INFORMATION_PAGES, id: 'information-pages' },
        ],
    },
] as const

const screenshotFiles: Record<string, string> = {
    'скриншот страницы «Вход в систему»': 'login-page.png',
    'скриншот страницы «Восстановление пароля»': 'password-recovery.png',
    'скриншот страницы «Дэшборд»': 'dashboard-page.png',
    'скриншот страницы «Дэшборд» №2': 'dashboard-page-2.png',
    'скриншот блока «График объёма продаж»': 'dashboard-sales-chart.png',
    'скриншот блока «Карточка категории»': 'dashboard-category-filter.png',
    'скриншот страницы «Магазин заказ»': 'sales-page.png',
    'скриншот блока «Фильтры заказов»': 'sales-filters.png',
    'скриншот блока «Действия с заказом»': 'sales-order-actions.png',
    'скриншот блока «Просмотр заказа»': 'sales-order-view.png',
    'скриншот блока «Логистика заказа»': 'sales-order-logistics.png',
    'скриншот блока «Редактирование заказа»': 'sales-order-edit.png',
    'скриншот блока «Удаление заказа»': 'sales-order-delete.png',
    'скриншот блока «Массовая покупка заказов»': 'sales-orders-buy.png',
    'скриншот блока «Массовые действия с заказами»': 'sales-orders-bulk-actions.png',
    'скриншот блока «Создание заказа»': 'sales-order-create.png',
    'скриншот страницы «Финансовый отчёт»': 'financial-report-page.png',
    'скриншот страницы «Мой бумажник»': 'wallet-page.png',
    'скриншот блока «Баланс и операции»': 'wallet-balance-operations.png',
    'скриншот блока «Операция кошелька»': 'wallet-operation-view.png',
    'скриншот блока «Операция пополнить»': 'wallet-operation-plus.png',
    'скриншот блока «Операция вывести»': 'wallet-operation-minus.png',
    'скриншот блока «Подтверждение или отклонение операции»': 'wallet-operation-review.png',
    'скриншот страницы «Фонд записи»': 'record-fund-page.png',
    'скриншот блока «Создание операции фонда»': 'record-fund-create.png',
    'скриншот блока «Просмотр операции фонда»': 'record-fund-view.png',
    'скриншот блока «Сторно операции фонда»': 'record-fund-reversal.png',
    'скриншот страницы «Хранение продуктов»': 'product-hold-page.png',
    'скриншот блока «Фильтры товаров»': 'product-hold-filters.png',
    'скриншот блока «Редактирование товара»': 'product-hold-edit.png',
    'скриншот блока «Удаление товара»': 'product-hold-delete.png',
    'скриншот блока «Массовые действия с товарами»': 'product-hold-bulk-actions.png',
    'скриншот блока «Публикация, рекомендация и подписка»': 'product-hold-status-actions.png',
    'скриншот страницы «Категории товаров»': 'categories-page.png',
    'скриншот блока «Создание категории»': 'categories-create.png',
    'скриншот блока «Редактирование категории»': 'categories-edit.png',
    'скриншот блока «Удаление категории»': 'categories-delete.png',
    'скриншот страницы «Запросы на возврат»': 'product-returns-page.png',
    'скриншот блока «Создать возврат»': 'product-returns-create.png',
    'скриншот блока «Просмотр возврата»': 'product-returns-view.png',
    'скриншот блока «Обработка возврата»': 'product-returns-process.png',
    'скриншот блока «Массовая обработка возвратов»': 'product-returns-bulk-process.png',
    'скриншот страницы «Склад продуктов»': 'product-warehouse-page.png',
    'скриншот страницы «Импорт товаров»': 'product-import-page.png',
    'скриншот страницы «Импорт товаров» №2': 'product-import-page-2.png',
    'скриншот страницы «Настройки магазина»': 'store-settings-page.png',
    'скриншот блока «Изображения магазина»': 'store-settings-images.png',
    'скриншот блока «Изменение аватара»': 'store-settings-avatar.png',
    'скриншот блока «Просмотр имени»': 'store-settings-name.png',
    'скриншот блока «Настройка телефона»': 'store-settings-phone.png',
    'скриншот блока «Подтверждение электронной почты»': 'store-settings-email.png',
    'скриншот блока «Изменение пароля»': 'store-settings-password.png',
    'скриншот блока «Просмотр договора»': 'store-settings-contract.png',
    'скриншот страницы «Бизнес-лига»': 'business-league-page.png',
    'скриншот страницы «Магазин экспресс»': 'shop-express-page.png',
    'скриншот блока «Создание тарифа магазина экспресс»': 'shop-express-create.png',
    'скриншот блока «Редактирование тарифа магазина экспресс»': 'shop-express-edit.png',
    'скриншот блока «Удаление тарифа магазина экспресс»': 'shop-express-delete.png',
    'скриншот блока «Назначение тарифа магазина экспресс»': 'shop-express-assign.png',
    'скриншот страницы «История покупок»': 'purchase-history-page.png',
    'скриншот страницы «Уровень продавца»': 'seller-level-page.png',
    'скриншот страницы «Пользователи»': 'users-page.png',
    'скриншот блока «Добавление пользователя»': 'users-create.png',
    'скриншот блока «Редактирование пользователя»': 'users-edit.png',
    'скриншот блока «Удаление пользователя»': 'users-delete.png',
    'скриншот страницы «Группы»': 'groups-page.png',
    'скриншот блока «Создание группы»': 'groups-create.png',
    'скриншот блока «Редактирование группы»': 'groups-edit.png',
    'скриншот блока «Удаление группы»': 'groups-delete.png',
    'скриншот страницы «Страницы»': 'information-pages-page.png',
    'скриншот блока «Создание страницы»': 'information-pages-create.png',
    'скриншот блока «Создание страницы» №2': 'information-pages-create-2.png',
    'скриншот блока «Редактирование страницы»': 'information-pages-edit.png',
    'скриншот блока «Удаление страницы»': 'information-pages-delete.png',
    'скриншот блока «Публичная страница»': 'information-pages-public.png',
}

const Screenshot = ({ children }: { children: string }) => {
    const [loaded, setLoaded] = useState(false)
    const fileName = screenshotFiles[children]

    return (
        <div className={`${styles.screenshot} ${loaded ? styles.screenshotLoaded : ''}`}>
            {fileName ? (
                <img
                    src={`/images/help/${fileName}`}
                    alt={children}
                    onLoad={() => setLoaded(true)}
                    onError={() => setLoaded(false)}
                />
            ) : null}
            {children && children}
        </div>
    )
}

const ChapterLink = ({ href, children }: { href: string; children: string }) => (
    <Link className={styles.pageLink} to={href}>
        {children}
    </Link>
)

const HelpPage = () => {
    const { userRole } = useAuth()
    const rootRef = useRef<HTMLElement | null>(null)
    const [showTopButton, setShowTopButton] = useState(false)

    useEffect(() => {
        const root = rootRef.current
        const scroller = root?.parentElement
        if (!scroller) return

        const handleScroll = () => setShowTopButton(scroller.scrollTop > 320)
        handleScroll()
        scroller.addEventListener('scroll', handleScroll, { passive: true })

        return () => scroller.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        rootRef.current?.parentElement?.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (userRole !== 'superadmin') {
        return <Navigate to={ELinks.DASHBOARD} replace />
    }

    return (
        <LayoutContent>
            <main ref={rootRef} className={styles.page}>
                <section className={styles.intro}>
                    <h1>Справка ESD CRM</h1>
                    <p>
                        Здесь собраны инструкции по разделам, которые доступны в основном меню CRM. Названия в справке совпадают с подписями в меню, чтобы нужный раздел было легко найти.
                    </p>
                    <p>
                        Если в инструкции указан переход на страницу, заголовок раздела можно нажать. В каждом месте, где нужен снимок интерфейса, оставлен отдельный блок для скриншота.
                    </p>
                </section>

                <nav className={styles.contents} aria-label='Содержание справки'>
                    <div className={styles.contentsTitle}>Содержание</div>
                    <div className={styles.contentsList}>
                        <a href='#login'>Вход в систему</a>
                        {chapters.map((chapter) => (
                            <div className={styles.contentsGroup} key={chapter.id}>
                                <a href={`#${chapter.id}`}>
                                    {chapter.number}. {chapter.title}
                                </a>
                                {'children' in chapter && chapter.children.length > 0 ? (
                                    <div className={styles.contentsChildren}>
                                        {chapter.children.map((child) => (
                                            <a href={`#${child.id}`} key={child.id}>
                                                {child.number} {child.title}
                                            </a>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </nav>

                <section id='login' className={styles.chapter}>
                    <h2>Вход в систему</h2>
                    <p>Откройте страницу входа и укажите данные учётной записи. После успешной авторизации CRM открывает рабочее пространство пользователя.</p>
                    <ol>
                        <li>Введите адрес электронной почты.</li>
                        <li>Введите пароль.</li>
                        <li>Нажмите кнопку входа.</li>
                    </ol>
                    <p>Если пароль забыт, используйте предусмотренный системой сценарий восстановления доступа.</p>
                    <Screenshot>скриншот страницы «Вход в систему»</Screenshot>
                    <Screenshot>скриншот страницы «Восстановление пароля»</Screenshot>
                </section>

                <section id='dashboard' className={styles.chapter}>
                    <h2><ChapterLink href={ELinks.DASHBOARD}>1. Дэшборд</ChapterLink></h2>
                    <p>Дэшборд показывает сводку по магазину и основные показатели за текущий период.</p>
                    <ul>
                        <li>общее количество продуктов, сумму продаж, количество заказов и прибыль;</li>
                        <li>обзор магазина, профиль потока и показатели за сегодня;</li>
                        <li>график объёма продаж с переключением периода: сегодня, 7 дней, 30 дней;</li>
                        <li>категории с товарами;</li>
                        <li>TOP-10 продавцов и статистику заказов.</li>
                    </ul>
                    <h3>1.1 Переключение периода графика</h3>
                    <p>Кнопки периода меняют данные графика объёма продаж. Переключение не открывает отдельное окно, график обновляется прямо на странице.</p>
                    <Screenshot>скриншот блока «График объёма продаж»</Screenshot>
                    <h3>1.2 Переход по категории</h3>
                    <p>Нажатие на карточку категории открывает список товаров уже с выбранной категорией в фильтре.</p>
                    <Screenshot>скриншот блока «Карточка категории»</Screenshot>
                    <Screenshot>скриншот страницы «Дэшборд»</Screenshot>
                    <Screenshot>скриншот страницы «Дэшборд» №2</Screenshot>
                </section>

                <section id='sales' className={styles.chapter}>
                    <h2><ChapterLink href={ELinks.SALES_LIST}>2. Магазин заказ</ChapterLink></h2>
                    <p>В этом разделе находится список заказов магазина. Список можно переключать между вкладками «Все заказы», «Ожидают» и «Куплены».</p>
                    <h3>2.1 Поиск и фильтры</h3>
                    <p>Для отбора заказов используются номер заказа, статус оплаты, статус логистики и диапазон дат. После изменения условий нажмите «Найти». «Сбросить» возвращает исходные значения.</p>
                    <Screenshot>скриншот блока «Фильтры заказов»</Screenshot>
                    <h3>2.2 Работа с заказом</h3>
                    <p>В строке заказа доступны просмотр подробностей, просмотр логистики, редактирование и удаление.</p>
                    <h4>Просмотр заказа</h4>
                    <p>Открывается окно с подробностями выбранного заказа. Здесь можно посмотреть данные заказа, не переходя обратно к списку.</p>
                    <Screenshot>скриншот блока «Просмотр заказа»</Screenshot>
                    <h4>Логистика</h4>
                    <p>Открывается окно с информацией о логистике заказа и его текущем состоянии.</p>
                    <Screenshot>скриншот блока «Логистика заказа»</Screenshot>
                    <h4>Редактирование</h4>
                    <p>Открывается форма редактирования заказа. После сохранения изменённые данные возвращаются в список.</p>
                    <Screenshot>скриншот блока «Редактирование заказа»</Screenshot>
                    <h4>Удаление</h4>
                    <p>Перед удалением открывается окно подтверждения. После подтверждения выбранный заказ удаляется из списка.</p>
                    <Screenshot>скриншот блока «Удаление заказа»</Screenshot>
                    <h3>2.3 Массовые действия</h3>
                    <p>Для нескольких выбранных заказов можно запустить массовую покупку. Также доступно действие над всеми заказами, которые попали под текущий фильтр.</p>
                    <Screenshot>скриншот блока «Массовая покупка заказов»</Screenshot>
                    <Screenshot>скриншот блока «Массовые действия с заказами»</Screenshot>
                    <h3>2.4 Создание заказа</h3>
                    <p>Кнопка создания открывает форму нового заказа. После заполнения полей нажмите "Создать", чтобы добавить запись в список.</p>
                    <Screenshot>скриншот блока «Создание заказа»</Screenshot>
                    <Screenshot>скриншот блока «Действия с заказом»</Screenshot>
                    <Screenshot>скриншот страницы «Магазин заказ»</Screenshot>
                </section>

                <section id='financial-report' className={styles.chapter}>
                    <h2><ChapterLink href={ELinks.FINANCIAL_REPORT}>3. Финансовый отчёт</ChapterLink></h2>
                    <p>Раздел предназначен для просмотра финансовых показателей и ежедневной статистики.</p>
                    <h3>3.1 Период</h3>
                    <p>В верхней части доступны периоды «Вчера», «Сегодня», «Эта неделя», «Этот месяц» и «Все». При смене периода сводные показатели и таблица обновляются прямо на странице.</p>
                    <h3>3.2 Сводные показатели</h3>
                    <p>На странице отображаются ожидающая сумма, общие продажи, общая прибыль, количество заказов, отменённые заказы и возвраты.</p>
                    <h3>3.3 Таблица отчёта</h3>
                    <p>В таблице показаны дата, количество заказов, прибыль, отмены и возвраты. Есть постраничная навигация и выбор количества строк на странице.</p>
                    <Screenshot>скриншот страницы «Финансовый отчёт»</Screenshot>
                </section>

                <section id='wallet' className={styles.chapter}>
                    <h2><ChapterLink href={ELinks.MONEY_LIST}>4. Мой бумажник</ChapterLink></h2>
                    <p>В кошельке отображаются баланс, накопленный доход и операции пополнения и вывода средств.</p>
                    <Screenshot>скриншот страницы «Мой бумажник»</Screenshot>
                    <h3>4.1 Операции</h3>
                    <p>Переключайтесь между вкладками «Пополнить» и «Вывести». В таблице доступны номер заказа, сумма, сеть, статус, чек, фактически полученная сумма, адрес, даты и примечания.</p>
                    <Screenshot>скриншот блока «Операция кошелька»</Screenshot>
                    <h3>4.2 Просмотр операции</h3>
                    <p>Нажатие на операцию открывает окно с её подробностями. Для заявки, которая ожидает решения, superadmin может подтвердить или отклонить операцию.</p>
                    <Screenshot>скриншот блока «Подтверждение или отклонение операции»</Screenshot>
                    <h3>4.3 Пополнение и вывод</h3>
                    <p>Кнопка «Пополнить» переводит на форму пополнения, а «Вывести» на форму вывода средств. Это отдельные страницы, а не модальные окна.</p>
                    <Screenshot>скриншот блока «Баланс и операции»</Screenshot>
                    <Screenshot>скриншот блока «Операция пополнить»</Screenshot>
                    <Screenshot>скриншот блока «Операция вывести»</Screenshot>
                </section>

                <section id='record-fund' className={styles.chapter}>
                    <h2><ChapterLink href={ELinks.RECORD_FUND}>5. Фонд записи</ChapterLink></h2>
                    <p>Раздел содержит записи об изменениях фонда. В таблице видны тип заказа, серийный номер, сумма изменения, баланс до и после операции и время изменения.</p>
                    <Screenshot>скриншот страницы «Фонд записи»</Screenshot>
                    <h3>5.1 Фильтры</h3>
                    <p>Можно отфильтровать записи по типу заказа и диапазону дат. Нажмите «Найти», чтобы применить условия, или «Сбросить», чтобы очистить их.</p>
                    <h3>5.2 Создание записи</h3>
                    <p>Кнопка «Создать операцию» открывает форму. Укажите тип заказа, ненулевую сумму изменения и, при необходимости, время операции. После сохранения запись появится в таблице.</p>
                    <Screenshot>скриншот блока «Создание операции фонда»</Screenshot>
                    <h3>5.3 Просмотр</h3>
                    <p>Действие просмотра открывает подробности выбранной операции.</p>
                    <Screenshot>скриншот блока «Просмотр операции фонда»</Screenshot>
                    <h3>5.4 Сторно</h3>
                    <p>Для операции, которую разрешено отменить, доступно сторно. Перед выполнением открывается подтверждение, после чего создаётся обратная операция.</p>
                    <Screenshot>скриншот блока «Сторно операции фонда»</Screenshot>
                </section>

                <section id='product-management' className={styles.chapter}>
                    <h2>6. Управление продуктом</h2>
                    <p>В этой группе находятся страницы для работы с товарами, категориями, возвратами, складом и импортом.</p>

                    <article id='product-hold' className={styles.subchapter}>
                        <h3><ChapterLink href={ELinks.PRODUCT_HOLD}>6.1 Хранение продуктов</ChapterLink></h3>
                        <p>Основной список товаров. Для поиска используются название, ID товара, категория и статус. После выбора условий нажмите «Найти».</p>
                        <Screenshot>скриншот страницы «Хранение продуктов»</Screenshot>
                        <Screenshot>скриншот блока «Фильтры товаров»</Screenshot>
                        <h4>Редактирование товара</h4>
                        <p>Действие редактирования открывает форму товара. После сохранения обновлённые данные возвращаются в список.</p>
                        <Screenshot>скриншот блока «Редактирование товара»</Screenshot>
                        <h4>Удаление товара</h4>
                        <p>Открывается подтверждение удаления. После подтверждения товар удаляется.</p>
                        <Screenshot>скриншот блока «Удаление товара»</Screenshot>
                        <h4>Массовые действия</h4>
                        <p>Для выбранных товаров доступны размещение на витрине, снятие с витрины и удаление. Для удаления и других действий, требующих подтверждения, сначала появляется окно подтверждения.</p>
                        <Screenshot>скриншот блока «Массовые действия с товарами»</Screenshot>
                        <h4>Публикация, рекомендация и подписка</h4>
                        <p>Переключатели в строке товара меняют соответствующий признак товара прямо из списка.</p>
                        <Screenshot>скриншот блока «Публикация, рекомендация и подписка»</Screenshot>
                    </article>

                    <article id='categories' className={styles.subchapter}>
                        <h3><ChapterLink href={ELinks.CATEGORIES}>6.2 Категории товаров</ChapterLink></h3>
                        <p>Категории используются для группировки товаров. В списке можно искать категорию по названию или родителю.</p>
                        <Screenshot>скриншот страницы «Категории товаров»</Screenshot>
                        <h4>Создание</h4>
                        <p>Кнопка создания открывает форму категории. После сохранения новая категория появляется в таблице.</p>
                        <Screenshot>скриншот блока «Создание категории»</Screenshot>
                        <h4>Редактирование</h4>
                        <p>Действие редактирования открывает форму выбранной категории. Можно изменить название и родительскую категорию.</p>
                        <Screenshot>скриншот блока «Редактирование категории»</Screenshot>
                        <h4>Удаление</h4>
                        <p>Перед удалением открывается подтверждение. После подтверждения категория удаляется, если для неё разрешено удаление.</p>
                        <Screenshot>скриншот блока «Удаление категории»</Screenshot>
                    </article>

                    <article id='returns' className={styles.subchapter}>
                        <h3><ChapterLink href={ELinks.PRODUCT_RETURN_REQUEST}>6.3 Запросы на возврат</ChapterLink></h3>
                        <p>Здесь находятся заявки на возврат. Фильтры позволяют выбрать статус и диапазон дат подачи заявки.</p>
                        <h4>Создание возврата</h4>
                        <p>Кнопка «Создать возврат» открывает форму с номером заказа, причиной, инструкциями и суммой товара.</p>
                        <Screenshot>скриншот блока «Создать возврат»</Screenshot>
                        <h4>Просмотр заявки</h4>
                        <p>Действие просмотра открывает подробности заявки.</p>
                        <Screenshot>скриншот блока «Просмотр возврата»</Screenshot>
                        <h4>Обработка возврата</h4>
                        <p>Действие обработки открывает окно, в котором можно выполнить предусмотренное для заявки решение. После подтверждения статус заявки обновляется.</p>
                        <Screenshot>скриншот блока «Обработка возврата»</Screenshot>
                        <h4>Массовая обработка</h4>
                        <p>Для выбранных заявок можно запустить массовую обработку. Перед применением открывается окно подтверждения или выбора действия.</p>
                        <Screenshot>скриншот блока «Массовая обработка возвратов»</Screenshot>
                        <Screenshot>скриншот страницы «Запросы на возврат»</Screenshot>
                    </article>

                    <article id='product-warehouse' className={styles.subchapter}>
                        <h3><ChapterLink href={ELinks.PRODUCT_WAREHOUSE}>6.4 Склад продуктов</ChapterLink></h3>
                        <p>Используйте этот раздел для работы со складом продуктов. Набор складских действий зависит от данных магазина, поэтому в справке не добавляются операции, которых может не быть на текущем экране.</p>
                        <Screenshot>скриншот страницы «Склад продуктов»</Screenshot>
                    </article>

                    <article id='product-import' className={styles.subchapter}>
                        <h3><ChapterLink href={ELinks.PRODUCT_IMPORT}>6.5 Импорт товаров</ChapterLink></h3>
                        <p>Раздел предназначен для загрузки товаров из подготовленного файла. После выбора файла система выполняет предусмотренную формой проверку и импорт.</p>
                        <Screenshot>скриншот страницы «Импорт товаров»</Screenshot>
                        <Screenshot>скриншот страницы «Импорт товаров» №2</Screenshot>
                    </article>
                </section>

                <section id='other' className={styles.chapter}>
                    <h2>7. Другие</h2>
                    <article id='settings' className={styles.subchapter}>
                        <h3><ChapterLink href={ELinks.SETTINGS}>7.1 Настройки магазина</ChapterLink></h3>
                        <p>Здесь находятся основные настройки магазина и профиля пользователя.</p>
                        <Screenshot>скриншот страницы «Настройки магазина»</Screenshot>
                        <ul>
                            <li>название магазина, контактное лицо, телефон и описание;</li>
                            <li>логотип и три баннера магазина;</li>
                            <li>ссылки на Facebook, Twitter, Google, YouTube и Instagram;</li>
                            <li>аватар пользователя;</li>
                            <li>номер телефона и подтверждение электронной почты;</li>
                            <li>договор, если он доступен для текущей учётной записи.</li>
                        </ul>
                        <h4>Изображения магазина</h4>
                        <p>Загрузка заменяет соответствующее изображение в настройках. Для загруженного логотипа, баннеров и других изображений доступно отдельное удаление.</p>
                        <Screenshot>скриншот блока «Изображения магазина»</Screenshot>
                        <h4>Аватар</h4>
                        <p>Кнопка изменения аватара открывает выбор изображения. После загрузки новый аватар отображается в профиле.</p>
                        <Screenshot>скриншот блока «Изменение аватара»</Screenshot>
                        <h4>Имя</h4>
                        <p>Действие просмотра имени открывает окно с текущим значением.</p>
                        <Screenshot>скриншот блока «Просмотр имени»</Screenshot>
                        <h4>Телефон</h4>
                        <p>Настройка телефона открывает форму для ввода или изменения номера и дальнейшего подтверждения.</p>
                        <Screenshot>скриншот блока «Настройка телефона»</Screenshot>
                        <h4>Электронная почта</h4>
                        <p>Действие подтверждения открывает предусмотренный системой сценарий верификации адреса.</p>
                        <Screenshot>скриншот блока «Подтверждение электронной почты»</Screenshot>
                        <h4>Пароль</h4>
                        <p>Изменение пароля открывает форму смены пароля. После успешной смены используется новый пароль при следующем входе.</p>
                        <Screenshot>скриншот блока «Изменение пароля»</Screenshot>
                        <h4>Договор</h4>
                        <p>Если договор доступен, действие открывает его просмотр.</p>
                        <Screenshot>скриншот блока «Просмотр договора»</Screenshot>
                        <p>После изменения данных магазина используйте сохранение настроек.</p>
                    </article>

                    <article id='business-league' className={styles.subchapter}>
                        <h3><ChapterLink href={ELinks.BUSINESS_LEAGUE}>7.2 Бизнес-лига</ChapterLink></h3>
                        <p>Страница бизнес-лиги доступна из группы «Другие». На ней размещены функции и показатели, относящиеся к участию магазина в бизнес-лиге.</p>
                        <Screenshot>скриншот страницы «Бизнес-лига»</Screenshot>
                    </article>
                </section>

                <section id='marketing' className={styles.chapter}>
                    <h2>8. Маркетинговые инструменты</h2>
                    <article id='shop-express' className={styles.subchapter}>
                        <h3><ChapterLink href={ELinks.MARKETING_SHOP_EXPRESS}>8.1 Магазин экспресс</ChapterLink></h3>
                        <p>Раздел предназначен для работы с функциями магазина экспресс.</p>
                        <h4>Создание</h4>
                        <p>Кнопка создания открывает форму нового тарифа или записи. После сохранения она появляется в списке.</p>
                        <Screenshot>скриншот блока «Создание тарифа магазина экспресс»</Screenshot>
                        <h4>Редактирование</h4>
                        <p>Действие редактирования открывает форму существующей записи. После сохранения изменения применяются к выбранной записи.</p>
                        <Screenshot>скриншот блока «Редактирование тарифа магазина экспресс»</Screenshot>
                        <h4>Удаление</h4>
                        <p>Перед удалением открывается подтверждение. После подтверждения запись удаляется.</p>
                        <Screenshot>скриншот блока «Удаление тарифа магазина экспресс»</Screenshot>
                        <h4>Назначение</h4>
                        <p>Действие назначения открывает форму выбора объекта, для которого применяется выбранный тариф.</p>
                        <Screenshot>скриншот блока «Назначение тарифа магазина экспресс»</Screenshot>
                        <Screenshot>скриншот страницы «Магазин экспресс»</Screenshot>
                    </article>

                    <article id='purchase-history' className={styles.subchapter}>
                        <h3><ChapterLink href={ELinks.MARKETING_PURCHASE_HISTORY}>8.2 История покупок</ChapterLink></h3>
                        <p>Раздел показывает историю покупок и связанные с ней данные. Отдельных модальных действий в текущем экране не добавляем, чтобы не описывать то, чего нет в интерфейсе.</p>
                        <Screenshot>скриншот страницы «История покупок»</Screenshot>
                    </article>

                    <article id='seller-level' className={styles.subchapter}>
                        <h3><ChapterLink href={ELinks.MARKETING_SELLER_LEVEL}>8.3 Уровень продавца</ChapterLink></h3>
                        <p>На странице отображается текущий уровень продавца и связанные с ним показатели.</p>
                        <Screenshot>скриншот страницы «Уровень продавца»</Screenshot>
                    </article>
                </section>

                <section id='administration' className={styles.chapter}>
                    <h2>9. Администрирование</h2>
                    <p>В группе «Администрирование» находятся Пользователи, Группы и Страницы.</p>

                    <article id='users' className={styles.subchapter}>
                        <h3><ChapterLink href={ELinks.USERS_LIST}>9.1 Пользователи</ChapterLink></h3>
                        <p>В списке пользователей доступны поиск, просмотр таблицы и действия над отдельными учётными записями.</p>
                        <h4>9.1.1 Добавление пользователя</h4>
                        <p>Нажмите кнопку создания пользователя, заполните форму и сохраните запись. После успешного сохранения новый пользователь появится в таблице.</p>
                        <Screenshot>скриншот блока «Добавление пользователя»</Screenshot>
                        <h4>9.1.2 Редактирование</h4>
                        <p>Действие редактирования открывает форму существующего пользователя. После сохранения таблица обновится.</p>
                        <Screenshot>скриншот блока «Редактирование пользователя»</Screenshot>
                        <h4>9.1.3 Удаление</h4>
                        <p>Перед удалением открывается окно подтверждения. После подтверждения учётная запись удаляется.</p>
                        <Screenshot>скриншот блока «Удаление пользователя»</Screenshot>
                        <Screenshot>скриншот страницы «Пользователи»</Screenshot>
                    </article>

                    <article id='groups' className={styles.subchapter}>
                        <h3><ChapterLink href={ELinks.GROUPS_LIST}>9.2 Группы</ChapterLink></h3>
                        <p>Раздел предназначен для управления группами пользователей и их правами.</p>
                        <h4>Создание</h4>
                        <p>Кнопка создания открывает форму группы. После сохранения новая группа появляется в списке.</p>
                        <Screenshot>скриншот блока «Создание группы»</Screenshot>
                        <h4>Редактирование</h4>
                        <p>Действие редактирования открывает форму выбранной группы, где можно изменить её данные и права.</p>
                        <Screenshot>скриншот блока «Редактирование группы»</Screenshot>
                        <h4>Удаление</h4>
                        <p>Перед удалением открывается подтверждение. После подтверждения группа удаляется.</p>
                        <Screenshot>скриншот блока «Удаление группы»</Screenshot>
                        <Screenshot>скриншот страницы «Группы»</Screenshot>
                    </article>

                    <article id='information-pages' className={styles.subchapter}>
                        <h3><ChapterLink href={ELinks.INFORMATION_PAGES}>9.3 Страницы</ChapterLink></h3>
                        <p>В разделе «Страницы» можно искать информационные страницы по заголовку, URL или доступу и создавать новые записи.</p>
                        <Screenshot>скриншот страницы «Страницы»</Screenshot>
                        <h4>9.3.1 Создание страницы</h4>
                        <p>Нажмите кнопку создания, заполните данные страницы и сохраните её. После создания запись появится в общем списке.</p>
                        <Screenshot>скриншот блока «Создание страницы»</Screenshot>
                        <Screenshot>скриншот блока «Создание страницы» №2</Screenshot>
                        <h4>9.3.2 Редактирование</h4>
                        <p>Действие редактирования открывает форму страницы. После сохранения изменения применяются к выбранной записи.</p>
                        <Screenshot>скриншот блока «Редактирование страницы»</Screenshot>
                        <h4>9.3.3 Удаление</h4>
                        <p>Перед удалением открывается подтверждение. После подтверждения запись удаляется.</p>
                        <Screenshot>скриншот блока «Удаление страницы»</Screenshot>
                        <h4>9.3.4 Публичная страница</h4>
                        <p>Действие просмотра публичной страницы открывает опубликованную версию по адресу, сформированному системой.</p>
                        <Screenshot>скриншот блока «Публичная страница»</Screenshot>
                    </article>
                </section>

                <button
                    className={`${styles.toTop} ${showTopButton ? styles.toTopVisible : ''}`}
                    type='button'
                    aria-label='Вернуться к началу'
                    onClick={scrollToTop}
                >
                    <ArrowUpwardRoundedIcon />
                    <span className={styles.toTopSpan}>Наверх</span>
                </button>
            </main>
        </LayoutContent>
    )
}

export default HelpPage
