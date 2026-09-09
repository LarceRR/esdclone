import React, { memo } from 'react'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import styles from './BoxesListModule.module.css'
import { BoxesTable } from '@/entities/BoxesTable'
import CreateBox from '@/features/boxes-list/CreateBox'

export const BoxesListModule: React.FC = memo(() => {
    useSetPageTitle('Боксы')
    return (
        <div className={styles.BoxesListModule}>
            <div className={styles.header}>
                <CreateBox />
            </div>
            <BoxesTable />
        </div>
    )
})
