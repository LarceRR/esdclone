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
            { number: '6.4', title: 'Обзор продукта', href: ELinks.PRODUCT_OVERVIEW, id: 'product-overview' },
            { number: '6.5', title: 'Склад продуктов', href: ELinks.PRODUCT_WAREHOUSE, id: 'product-warehouse' },
            { number: '6.6', title: 'Импорт товаров', href: ELinks.PRODUCT_IMPORT, id: 'product-import' },
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

const Screenshot = ({ children }: { children: string }) => <div className={styles.screenshot}>{children}</div>

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
            <main
                ref={rootRef}
                className={styles.page}
            >
                <section className={styles.intro}>
                    <h1>Справка ESD CRM</h1>
                    <p>
                        Здесь собраны инструкции по разделам, которые доступны в основном меню CRM. Названия в справке совпадают с подписями в меню, чтобы нужный раздел было легко найти.
                    </p>
                    <p>
                        Если в инструкции указан переход на страницу, заголовок раздела можно нажать. В каждом месте, где нужен снимок интерфейса, оставлен отдельный блок для скриншота.
                    </p>
                </section>

                <nav
                    className={styles.contents}
                    aria-label='Содержание справки'
                >
                    <div className={styles.contentsTitle}>Содержание</div>
                    <div className={styles.contentsList}>
                        <a href='#login'>Вход в систему</a>
                        {chapters.map((chapter) => (
                            <div
                                className={styles.contentsGroup}
                                key={chapter.id}
                            >
                                <a href={`#${chapter.id}`}>
                                    {chapter.number}. {chapter.title}
                                </a>
                                {'children' in chapter && chapter.children.length > 0 ? (
                                    <div className={styles.contentsChildren}>
                                        {chapter.children.map((child) => (
                                            <a
                                                href={`#${child.id}`}
                                                key={child.id}
                                            >
                                                {child.number} {child.title}
                                            </a>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </nav>

                <section
                    id='login'
                    className={styles.chapter}
                >
                    <h2>Вход в систему</h2>
                    <p>Откройте страницу входа и укажите данные учётной записи. После успешной авторизации CRM открывает рабочее пространство пользователя.</p>
                    <ol>
                        <li>Введите адрес электронной почты.</li>
                        <li>Введите пароль.</li>
                        <li>Нажмите кнопку входа.</li>
                    </ol>
                    <p>Если пароль забыт, используйте предусмотренный системой сценарий восстановления доступа.</p>
                    <Screenshot>[скриншот страницы «Вход в систему»]</Screenshot>
                </section>

                <section
                    id='dashboard'
                    className={styles.chapter}
                >
                    <h2><ChapterLink href={ELinks.DASHBOARD}>1. Дэшборд</ChapterLink></h2>
                    <p>Дэшборд показывает сводку по магазину и основные показатели за текущий период.</p>
                    <ul>
                        <li>общее количество продуктов, сумму продаж, количество заказов и прибыль;</li>
                        <li>обзор магазина, профиль потока и показатели за сегодня;</li>
                        <li>график объёма продаж с переключением периода: сегодня, 7 дней, 30 дней;</li>
                        <li>категории с товарами;</li>
                        <li>TOP-10 продавцов и статистику заказов.</li>
                    </ul>
                    <p>Карточки категорий на дэшборде открывают список товаров с выбранной категорией.</p>
                    <Screenshot>[скриншот страницы «Дэшборд»]</Screenshot>
                    <Screenshot>[скриншот блока «График объёма продаж»]</Screenshot>
                </section>

                <section
                    id='sales'
                    className={styles.chapter}
                >
                    <h2><ChapterLink href={ELinks.SALES_LIST}>2. Магазин заказ</ChapterLink></h2>
                    <p>В этом разделе находится список заказов магазина. Список можно переключать между вкладками «Все заказы», «Ожидают» и «Куплены».</p>
                    <h3>2.1 Поиск и фильтры</h3>
                    <p>Для отбора заказов используются номер заказа, статус оплаты, статус логистики и диапазон дат. После изменения условий нажмите «Найти». «Сбросить» возвращает исходные значения.</p>
                    <h3>2.2 Работа с заказом</h3>
                    <p>Для заказа можно открыть подробности, посмотреть логистику, отредактировать или удалить его. Для нескольких заказов предусмотрена массовая покупка. При необходимости можно применить действие ко всем заказам, подходящим под текущий фильтр.</p>
                    <h3>2.3 Создание заказа</h3>
                    <p>Кнопка создания открывает форму заказа. После заполнения полей сохраните заказ. Если запись уже существует, её можно открыть из списка и перейти к редактированию.</p>
                    <Screenshot>[скриншот страницы «Магазин заказ»]</Screenshot>
                    <Screenshot>[скриншот блока «Фильтры заказов»]</Screenshot>
                    <Screenshot>[скриншот блока «Действия с заказом»]</Screenshot>
                </section>

                <section
                    id='financial-report'
                    className={styles.chapter}
                >
                    <h2><ChapterLink href={ELinks.FINANCIAL_REPORT}>3. Финансовый отчёт</ChapterLink></h2>
                    <p>Раздел предназначен для просмотра финансовых показателей и ежедневной статистики.</p>
                    <h3>3.1 Период</h3>
                    <p>В верхней части доступны периоды «Вчера», «Сегодня», «Эта неделя», «Этот месяц» и «Все». При смене периода сводные показатели и таблица обновляются.</p>
                    <h3>3.2 Сводные показатели</h3>
                    <p>На странице отображаются ожидающая сумма, общие продажи, общая прибыль, количество заказов, отменённые заказы и возвраты.</p>
                    <h3>3.3 Таблица отчёта</h3>
                    <p>В таблице показаны дата, количество заказов, прибыль, отмены и возвраты. Есть постраничная навигация и выбор количества строк на странице.</p>
                    <Screenshot>[скриншот страницы «Финансовый отчёт»]</Screenshot>
                    <Screenshot>[скриншот блока «Сводные показатели»]</Screenshot>
                </section>

                <section
                    id='wallet'
                    className={styles.chapter}
                >
                    <h2><ChapterLink href={ELinks.MONEY_LIST}>4. Мой бумажник</ChapterLink></h2>
                    <p>В кошельке отображаются баланс, накопленный доход и операции пополнения и вывода средств.</p>
                    <h3>4.1 Операции</h3>
                    <p>Переключайтесь между вкладками «Пополнить» и «Вывести». В таблице доступны номер заказа, сумма, сеть, статус, чек, фактически полученная сумма, адрес, даты и примечания.</p>
                    <h3>4.2 Просмотр операции</h3>
                    <p>Операцию можно открыть для просмотра подробностей. Для superadmin доступны подтверждение или отклонение заявки.</p>
                    <h3>4.3 Пополнение и вывод</h3>
                    <p>Для перехода к соответствующей форме используйте кнопки «Пополнить» и «Вывести» в верхнем блоке страницы.</p>
                    <Screenshot>[скриншот страницы «Мой бумажник»]</Screenshot>
                    <Screenshot>[скриншот блока «Баланс и операции»]</Screenshot>
                </section>

                <section
                    id='record-fund'
                    className={styles.chapter}
                >
                    <h2><ChapterLink href={ELinks.RECORD_FUND}>5. Фонд записи</ChapterLink></h2>
                    <p>Раздел содержит записи об изменениях фонда. В таблице видны тип заказа, серийный номер, сумма изменения, баланс до и после операции и время изменения.</p>
                    <h3>5.1 Фильтры</h3>
                    <p>Можно отфильтровать записи по типу заказа и диапазону дат. Нажмите «Найти», чтобы применить условия, или «Сбросить», чтобы очистить их.</p>
                    <h3>5.2 Создание записи</h3>
                    <p>Кнопка «Создать операцию» открывает форму. Укажите тип заказа, ненулевую сумму изменения и, при необходимости, время операции.</p>
                    <h3>5.3 Просмотр и сторно</h3>
                    <p>Из строки можно открыть подробности. Для операции доступно сторно, если это предусмотрено её состоянием.</p>
                    <Screenshot>[скриншот страницы «Фонд записи»]</Screenshot>
                </section>

                <section
                    id='product-management'
                    className={styles.chapter}
                >
                    <h2>6. Управление продуктом</h2>
                    <p>В этой группе находятся страницы для работы с товарами, категориями, возвратами, складом и импортом.</p>

                    <article
                        id='product-hold'
                        className={styles.subchapter}
                    >
                        <h3><ChapterLink href={ELinks.PRODUCT_HOLD}>6.1 Хранение продуктов</ChapterLink></h3>
                        <p>Основной список товаров. Для поиска используются название, ID товара, категория и статус. После выбора условий нажмите «Найти».</p>
                        <p>Для выбранных товаров доступны массовые действия: разместить на витрине, снять с витрины или удалить. В строке товара можно менять параметры публикации, рекомендации и подписки, а также открыть редактирование или удалить товар.</p>
                        <p>Внизу таблицы находятся общее количество записей, выбор количества строк на странице и переход по страницам.</p>
                        <Screenshot>[скриншот страницы «Хранение продуктов»]</Screenshot>
                        <Screenshot>[скриншот блока «Фильтры товаров»]</Screenshot>
                    </article>

                    <article
                        id='categories'
                        className={styles.subchapter}
                    >
                        <h3><ChapterLink href={ELinks.CATEGORIES}>6.2 Категории товаров</ChapterLink></h3>
                        <p>Категории используются для группировки товаров. В списке можно искать категорию по названию или родителю.</p>
                        <p>Для создания категории используйте кнопку создания. При редактировании задаётся название и родительская категория. При выборе категории для изменения родительской категории система учитывает вложенные элементы, чтобы не создать циклическую структуру.</p>
                        <p>В таблице также отображается количество товаров в категории и действия над записью.</p>
                        <Screenshot>[скриншот страницы «Категории товаров»]</Screenshot>
                        <Screenshot>[скриншот блока «Создание категории»]</Screenshot>
                    </article>

                    <article
                        id='returns'
                        className={styles.subchapter}
                    >
                        <h3><ChapterLink href={ELinks.PRODUCT_RETURN_REQUEST}>6.3 Запросы на возврат</ChapterLink></h3>
                        <p>Здесь находятся заявки на возврат. Фильтры позволяют выбрать статус и диапазон дат подачи заявки.</p>
                        <p>Кнопка «Создать возврат» открывает форму с номером заказа, причиной, инструкциями и суммой товара. Из строки можно посмотреть заявку или открыть обработку. Для нескольких выбранных заявок предусмотрена массовая обработка.</p>
                        <Screenshot>[скриншот страницы «Запросы на возврат»]</Screenshot>
                        <Screenshot>[скриншот блока «Создать возврат»]</Screenshot>
                    </article>

                    <article
                        id='product-overview'
                        className={styles.subchapter}
                    >
                        <h3><ChapterLink href={ELinks.PRODUCT_OVERVIEW}>6.4 Обзор продукта</ChapterLink></h3>
                        <p>Страница предусмотрена в основном меню и открывает текущий экран обзора продукта.</p>
                        <Screenshot>[скриншот страницы «Обзор продукта»]</Screenshot>
                    </article>

                    <article
                        id='product-warehouse'
                        className={styles.subchapter}
                    >
                        <h3><ChapterLink href={ELinks.PRODUCT_WAREHOUSE}>6.5 Склад продуктов</ChapterLink></h3>
                        <p>Используйте этот раздел для работы со складом продуктов. Точное назначение полей и операций следует проверять по текущему экрану, так как набор складских действий может зависеть от данных магазина.</p>
                        <Screenshot>[скриншот страницы «Склад продуктов»]</Screenshot>
                    </article>

                    <article
                        id='product-import'
                        className={styles.subchapter}
                    >
                        <h3><ChapterLink href={ELinks.PRODUCT_IMPORT}>6.6 Импорт товаров</ChapterLink></h3>
                        <p>Раздел предназначен для загрузки товаров из подготовленного файла. Перед импортом проверьте формат файла и соответствие колонок данным, которые ожидает форма.</p>
                        <Screenshot>[скриншот страницы «Импорт товаров»]</Screenshot>
                    </article>
                </section>

                <section
                    id='other'
                    className={styles.chapter}
                >
                    <h2>7. Другие</h2>

                    <article
                        id='settings'
                        className={styles.subchapter}
                    >
                        <h3><ChapterLink href={ELinks.SETTINGS}>7.1 Настройки магазина</ChapterLink></h3>
                        <p>Здесь находятся основные настройки магазина и профиля пользователя.</p>
                        <ul>
                            <li>название магазина, контактное лицо, телефон и описание;</li>
                            <li>логотип и три баннера магазина;</li>
                            <li>ссылки на Facebook, Twitter, Google, YouTube и Instagram;</li>
                            <li>аватар пользователя;</li>
                            <li>номер телефона и подтверждение электронной почты;</li>
                            <li>договор, если он доступен для текущей учётной записи.</li>
                        </ul>
                        <p>После изменения данных магазина используйте сохранение настроек. Для изображений доступны отдельные загрузка и удаление.</p>
                        <Screenshot>[скриншот страницы «Настройки магазина»]</Screenshot>
                        <Screenshot>[скриншот блока «Общая информация»]</Screenshot>
                    </article>

                    <article
                        id='business-league'
                        className={styles.subchapter}
                    >
                        <h3><ChapterLink href={ELinks.BUSINESS_LEAGUE}>7.2 Бизнес-лига</ChapterLink></h3>
                        <p>Страница бизнес-лиги доступна из группы «Другие». На ней размещены функции и показатели, относящиеся к участию магазина в бизнес-лиге.</p>
                        <Screenshot>[скриншот страницы «Бизнес-лига»]</Screenshot>
                    </article>
                </section>

                <section
                    id='marketing'
                    className={styles.chapter}
                >
                    <h2>8. Маркетинговые инструменты</h2>

                    <article
                        id='shop-express'
                        className={styles.subchapter}
                    >
                        <h3><ChapterLink href={ELinks.MARKETING_SHOP_EXPRESS}>8.1 Магазин экспресс</ChapterLink></h3>
                        <p>Раздел предназначен для работы с функциями магазина экспресс. Открывайте его из группы «Маркетинговые инструменты».</p>
                        <Screenshot>[скриншот страницы «Магазин экспресс»]</Screenshot>
                    </article>

                    <article
                        id='purchase-history'
                        className={styles.subchapter}
                    >
                        <h3><ChapterLink href={ELinks.MARKETING_PURCHASE_HISTORY}>8.2 История покупок</ChapterLink></h3>
                        <p>Раздел показывает историю покупок и связанные с ней данные.</p>
                        <Screenshot>[скриншот страницы «История покупок»]</Screenshot>
                    </article>

                    <article
                        id='seller-level'
                        className={styles.subchapter}
                    >
                        <h3><ChapterLink href={ELinks.MARKETING_SELLER_LEVEL}>8.3 Уровень продавца</ChapterLink></h3>
                        <p>На странице отображается текущий уровень продавца и связанные с ним показатели.</p>
                        <Screenshot>[скриншот страницы «Уровень продавца»]</Screenshot>
                    </article>
                </section>

                <section
                    id='administration'
                    className={styles.chapter}
                >
                    <h2>9. Администрирование</h2>
                    <p>В группе «Администрирование» находятся Пользователи, Группы и Страницы. Видимость административных разделов зависит от прав пользователя.</p>

                    <article
                        id='users'
                        className={styles.subchapter}
                    >
                        <h3><ChapterLink href={ELinks.USERS_LIST}>9.1 Пользователи</ChapterLink></h3>
                        <p>В списке пользователей доступны поиск, просмотр таблицы и действия над отдельными учётными записями.</p>
                        <h4>9.1.1 Добавление пользователя</h4>
                        <p>Нажмите кнопку создания пользователя, заполните форму и сохраните запись. После успешного сохранения новый пользователь появится в таблице.</p>
                        <h4>9.1.2 Редактирование</h4>
                        <p>Для изменения существующей записи используйте действие редактирования в строке. После сохранения таблица обновится.</p>
                        <h4>9.1.3 Удаление</h4>
                        <p>Удаление выполняется действием удаления в строке пользователя. Перед удалением проверьте, что выбрана нужная запись.</p>
                        <Screenshot>[скриншот страницы «Пользователи»]</Screenshot>
                        <Screenshot>[скриншот блока «Добавление пользователя»]</Screenshot>
                    </article>

                    <article
                        id='groups'
                        className={styles.subchapter}
                    >
                        <h3><ChapterLink href={ELinks.GROUPS_LIST}>9.2 Группы</ChapterLink></h3>
                        <p>Раздел предназначен для управления группами пользователей и их правами. Состав доступных действий определяется текущей учётной записью.</p>
                        <Screenshot>[скриншот страницы «Группы»]</Screenshot>
                    </article>

                    <article
                        id='information-pages'
                        className={styles.subchapter}
                    >
                        <h3><ChapterLink href={ELinks.INFORMATION_PAGES}>9.3 Страницы</ChapterLink></h3>
                        <p>В разделе «Страницы» можно искать информационные страницы по заголовку, URL или доступу и создавать новые записи.</p>
                        <h4>9.3.1 Создание страницы</h4>
                        <p>Нажмите кнопку создания, заполните данные страницы и сохраните её. После создания запись появится в общем списке.</p>
                        <h4>9.3.2 Редактирование</h4>
                        <p>Откройте нужную запись из списка и внесите изменения. Сохраните страницу после проверки данных.</p>
                        <h4>9.3.3 Публичная страница</h4>
                        <p>Для опубликованных страниц используется отдельный публичный адрес. Сам адрес формируется системой на основе магазина и URL страницы.</p>
                        <Screenshot>[скриншот страницы «Страницы»]</Screenshot>
                        <Screenshot>[скриншот блока «Создание страницы»]</Screenshot>
                    </article>
                </section>

                <div className={styles.endNote}>
                    <p>Справка построена по текущему основному меню CRM. Скрытые маршруты, технические страницы и экраны, которых нет в меню, в содержание не включены.</p>
                </div>

                <button
                    className={`${styles.toTop} ${showTopButton ? styles.toTopVisible : ''}`}
                    type='button'
                    aria-label='Вернуться к началу'
                    onClick={scrollToTop}
                >
                    <ArrowUpwardRoundedIcon />
                    <span>Наверх</span>
                </button>
            </main>
        </LayoutContent>
    )
}

export default HelpPage
