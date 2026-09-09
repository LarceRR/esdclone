import styles from './TransfersListModule.module.css'
import { MoneyTabs } from '@/features/money/MoneyTabs'
import { TransfersTable } from '@/entities/money/TransfersTable'

export const TransfersListModule = () => {
    return (
        <div className={styles.TransfersListModule}>
            <MoneyTabs />
            <div className={styles.header}>
                <h1>Перемещения</h1>
                <div className={styles.action}></div>
            </div>
            <TransfersTable />
        </div>
    )
}
