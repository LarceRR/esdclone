import styles from './index.module.css'
import { StockTabs } from '@/features/stock/StockTabs'
import { ReceiptsTable } from '@/entities/stock/ReceiptsTable'

export const ReceiptsListModule = () => {
    return (
        <div className={styles.ReceiptsListModule}>
            <StockTabs />
            <div className={styles.header}>
                <h1>Поступления</h1>
                Добавить поступление
            </div>
            <ReceiptsTable />
        </div>
    )
}
