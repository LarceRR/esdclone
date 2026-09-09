import styles from './index.module.css'
import { StockTabs } from '@/features/stock/StockTabs'
import { ProviderTable } from '@/entities/stock/ProviderTable'

export const ProviderListModule = () => {
    return (
        <div className={styles.ProviderListModule}>
            <StockTabs />
            <div className={styles.header}>
                <h1>У поставщиков</h1>
                Поиск по номеру запчасти
            </div>
            <ProviderTable />
        </div>
    )
}
