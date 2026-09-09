import styles from './MoneyListModule.module.css'
import { MoneyTable } from '@/entities/money/MoneyTable'
import { MoneyTabs } from '@/features/money/MoneyTabs'
import { MoneySettings } from '@/widgets/money/MoneySettings'

export const MoneyListModule = () => {
    return (
        <div className={styles.MoneyListModule}>
            <MoneyTabs />
            <div className={styles.header}>
                <h1>Деньги</h1>
                <div className={styles.action}>
                    <MoneySettings />
                </div>
            </div>
            <MoneyTable />
        </div>
    )
}
