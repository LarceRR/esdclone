import { memo, useEffect, useMemo, useState } from 'react'
import { EditInformationPageButton } from '@/features/information-pages/EditInformationPageButton'
import { RemoveInformationPage } from '@/features/information-pages/RemoveInformationPage'
import { EInformationPageAccess, IInformationPage } from '@/shared/api/types'
import { useGetInformationPagesListQuery } from '@/shared/api'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { useToast } from '@/shared/lib/hooks/toast'
import tableStyles from '@/widgets/SalesListModule/SalesListModule.module.css'
import categoryStyles from '@/widgets/CategoriesModule/CategoriesModule.module.css'
import styles from './InformationPagesTable.module.css'
import { columnsTable } from './model/columnsTable'

interface InformationPagesTableProps {
    pageTitle?: string
    searchTerm: string
}

const ROWS_PER_PAGE = 15

function accessLabel(access: EInformationPageAccess): string {
    return access === EInformationPageAccess.Authenticated ? 'Только авторизованным' : 'Всем'
}

function getColumnClass(columnId: string): string {
    if (columnId === 'url') return styles.colUrl
    if (columnId === 'access') return styles.colAccess
    return ''
}

export const InformationPagesTable = memo(({ pageTitle, searchTerm }: InformationPagesTableProps) => {
    useSetPageTitle(pageTitle)
    const { data, isLoading, isError } = useGetInformationPagesListQuery()
    const { TOAST_ERROR } = useToast()
    const [page, setPage] = useState(0)

    const filteredData = useMemo(() => {
        const rows = data?.data?.items || []
        const term = searchTerm.trim().toLowerCase()
        if (!term) return rows

        return rows.filter((row) => {
            return [row.title, row.url, accessLabel(row.access)].some((value) => value.toLowerCase().includes(term))
        })
    }, [data?.data?.items, searchTerm])

    useEffect(() => {
        setPage(0)
    }, [searchTerm, data?.data?.items])

    const totalPages = Math.max(1, Math.ceil(filteredData.length / ROWS_PER_PAGE))
    const safePage = Math.min(page, totalPages - 1)
    const paginatedData = filteredData.slice(safePage * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE + ROWS_PER_PAGE)

    useEffect(() => {
        if (isError) {
            TOAST_ERROR('Не удалось загрузить страницы')
        }
    }, [isError, TOAST_ERROR])

    if (isLoading) {
        return <div className={categoryStyles.loadingState}>Загрузка страниц…</div>
    }

    if (isError) {
        return <div className={categoryStyles.errorState}>Не удалось загрузить страницы</div>
    }

    const renderCell = (row: IInformationPage, columnId: string) => {
        if (columnId === 'url') {
            return (
                <a
                    className={styles.urlLink}
                    href={row.url}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    {row.url}
                </a>
            )
        }

        if (columnId === 'access') {
            return <span className={styles.accessBadge}>{accessLabel(row.access)}</span>
        }

        return row.title
    }

    return (
        <section className={tableStyles.tablePanel}>
            <div className={tableStyles.tableWrap}>
                <table className={`${tableStyles.ordersTable} ${styles.pagesTable}`}>
                    <thead>
                        <tr>
                            {columnsTable.map((col) => (
                                <th
                                    key={col.id}
                                    className={getColumnClass(col.id)}
                                >
                                    {col.label}
                                </th>
                            ))}
                            <th className={styles.colActions}>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row) => (
                            <tr key={row.id}>
                                {columnsTable.map((col) => (
                                    <td
                                        key={col.id}
                                        className={getColumnClass(col.id)}
                                    >
                                        {renderCell(row, col.id)}
                                    </td>
                                ))}
                                <td className={styles.colActions}>
                                    <div className={styles.actionsCell}>
                                        <EditInformationPageButton id={row.id} />
                                        <RemoveInformationPage
                                            id={row.id}
                                            title={row.title}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!paginatedData.length ? (
                            <tr>
                                <td
                                    colSpan={columnsTable.length + 1}
                                    className={tableStyles.emptyCell}
                                >
                                    {searchTerm.trim() ? 'Ничего не найдено' : 'Страницы пока не созданы'}
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>

            {filteredData.length > ROWS_PER_PAGE ? (
                <div className={categoryStyles.pagination}>
                    <span className={categoryStyles.paginationInfo}>
                        {safePage * ROWS_PER_PAGE + 1}–
                        {Math.min((safePage + 1) * ROWS_PER_PAGE, filteredData.length)} из {filteredData.length}
                    </span>
                    <div className={categoryStyles.paginationControls}>
                        <button
                            type='button'
                            className={categoryStyles.pageButton}
                            disabled={safePage === 0}
                            onClick={() => setPage((current) => Math.max(0, current - 1))}
                        >
                            ←
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                type='button'
                                className={
                                    index === safePage ? categoryStyles.pageButtonActive : categoryStyles.pageButton
                                }
                                onClick={() => setPage(index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            type='button'
                            className={categoryStyles.pageButton}
                            disabled={safePage >= totalPages - 1}
                            onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
                        >
                            →
                        </button>
                    </div>
                </div>
            ) : null}
        </section>
    )
})
