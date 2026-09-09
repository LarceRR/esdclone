import { memo, useEffect, useMemo, useState } from 'react'
import { useGetCategoriesListQuery } from '@/shared/api'
import type { ICategory } from '@/shared/api/types'
import { useToast } from '@/shared/lib/hooks/toast'
import { ChangeCategory } from '@/features/categories/ChangeCategory'
import { RemoveCategory } from '@/features/categories/RemoveCategory'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import {
    buildCategoryTree,
    flattenCategoryTree,
    getCategoryProductsCountTotal,
    type FlatCategoryRow,
} from './lib/categoryTree'
import tableStyles from '@/widgets/CategoriesModule/CategoriesModule.module.css'

const ROWS_PER_PAGE = 15

interface CategoriesTableProps {
    pageTitle?: string
    searchTerm: string
}

export const CategoriesTable = memo(({ pageTitle, searchTerm }: CategoriesTableProps) => {
    useSetPageTitle(pageTitle)
    const { data: categoriesData, isLoading, isError } = useGetCategoriesListQuery()
    const { TOAST_ERROR } = useToast()
    const [page, setPage] = useState(0)

    const categories = useMemo(() => categoriesData?.data ?? [], [categoriesData?.data])

    const flatRows = useMemo(() => {
        const tree = buildCategoryTree(categories)
        return flattenCategoryTree(tree)
    }, [categories])

    const filteredRows = useMemo(() => {
        if (!searchTerm.trim()) return flatRows
        const term = searchTerm.trim().toLowerCase()
        return flatRows.filter(
            (row) =>
                row.title.toLowerCase().includes(term) ||
                (row.parentTitle ?? '').toLowerCase().includes(term),
        )
    }, [flatRows, searchTerm])

    useEffect(() => {
        setPage(0)
    }, [searchTerm, categoriesData?.data])

    const totalPages = Math.max(1, Math.ceil(filteredRows.length / ROWS_PER_PAGE))
    const safePage = Math.min(page, totalPages - 1)
    const paginatedRows = filteredRows.slice(safePage * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE + ROWS_PER_PAGE)

    useEffect(() => {
        if (isError) {
            TOAST_ERROR('Ошибка получения категорий')
        }
    }, [isError, TOAST_ERROR])

    if (isLoading) {
        return <div className={tableStyles.loadingState}>Загрузка категорий…</div>
    }

    if (isError) {
        return <div className={tableStyles.errorState}>Не удалось загрузить категории</div>
    }

    return (
        <>
            <section className={tableStyles.tablePanel}>
                <div className={tableStyles.tableWrap}>
                    <table className={tableStyles.categoriesTable}>
                        <thead>
                            <tr>
                                <th className={tableStyles.colName}>Наименование</th>
                                <th className={tableStyles.colParent}>Родительская категория</th>
                                <th className={tableStyles.colProducts}>Количество товаров в категории</th>
                                <th className={tableStyles.colActions}>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRows.map((row: FlatCategoryRow) => (
                                <CategoryRow
                                    key={row.id}
                                    row={row}
                                    categories={categories}
                                />
                            ))}
                            {!paginatedRows.length ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className={tableStyles.emptyCell}
                                    >
                                        {searchTerm ? 'Ничего не найдено' : 'Категории отсутствуют'}
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                {filteredRows.length > ROWS_PER_PAGE ? (
                    <div className={tableStyles.pagination}>
                        <span className={tableStyles.paginationInfo}>
                            {safePage * ROWS_PER_PAGE + 1}–
                            {Math.min((safePage + 1) * ROWS_PER_PAGE, filteredRows.length)} из {filteredRows.length}
                        </span>
                        <div className={tableStyles.paginationControls}>
                            <button
                                type='button'
                                className={tableStyles.pageButton}
                                disabled={safePage === 0}
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                            >
                                ←
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    type='button'
                                    className={
                                        index === safePage
                                            ? tableStyles.pageButtonActive
                                            : tableStyles.pageButton
                                    }
                                    onClick={() => setPage(index)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                type='button'
                                className={tableStyles.pageButton}
                                disabled={safePage >= totalPages - 1}
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            >
                                →
                            </button>
                        </div>
                    </div>
                ) : null}
            </section>
        </>
    )
})

const CategoryRow = memo(({ row, categories }: { row: FlatCategoryRow; categories: ICategory[] }) => {
    const productsTotal = getCategoryProductsCountTotal(row.id, categories)

    return (
    <tr>
        <td className={tableStyles.nameCell}>
            <span
                className={tableStyles.nameInner}
                style={{ paddingLeft: `${row.depth * 1.25}rem` }}
            >
                <span className={tableStyles.nameText}>{row.title}</span>
            </span>
        </td>
        <td className={tableStyles.parentCell}>
            <span className={row.parentTitle ? tableStyles.parentValue : tableStyles.parentRoot}>
                {row.parentTitle ?? 'Корневая'}
            </span>
        </td>
        <td className={tableStyles.colProducts}>{productsTotal}</td>
        <td className={tableStyles.colActions}>
            <div className={tableStyles.actionsCell}>
                <ChangeCategory id={row.id} />
                <RemoveCategory id={row.id} />
            </div>
        </td>
    </tr>
    )
})
