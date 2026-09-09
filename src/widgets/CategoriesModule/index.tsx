import React, { memo, useState } from 'react'
import styles from './CategoriesModule.module.css'
import { CreateCategory } from '@/features/categories/CreateCategory'
import { CategoriesTable } from '@/entities/Categories'

export const CategoriesModule: React.FC = memo(() => {
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div className={styles.CategoriesModule}>
            <div className={styles.toolbar}>
                <label className={styles.searchField}>
                    <input
                        className={styles.searchInput}
                        type='search'
                        aria-label='Поиск по категориям'
                        placeholder='Поиск по названию или родителю'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </label>
                <div className={styles.toolbarCreate}>
                    <CreateCategory />
                </div>
            </div>

            <CategoriesTable
                pageTitle='Категории товаров'
                searchTerm={searchTerm}
            />
        </div>
    )
})
