import React, { memo, useState } from 'react'
import { InformationPagesTable } from '@/entities/InformationPagesTable'
import { CreateInformationPage } from '@/features/information-pages/CreateInformationPage'
import categoryStyles from '@/widgets/CategoriesModule/CategoriesModule.module.css'
import styles from './styles.module.css'

export const InformationPagesModule: React.FC = memo(() => {
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div className={styles.InformationPagesModule}>
            <div className={categoryStyles.toolbar}>
                <label className={categoryStyles.searchField}>
                    <input
                        className={categoryStyles.searchInput}
                        type='search'
                        aria-label='Поиск по страницам'
                        placeholder='Поиск по заголовку, URL или доступу'
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </label>
                <div className={categoryStyles.toolbarCreate}>
                    <CreateInformationPage />
                </div>
            </div>

            <InformationPagesTable
                pageTitle='Страницы'
                searchTerm={searchTerm}
            />
        </div>
    )
})
