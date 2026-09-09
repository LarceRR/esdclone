import styles from './SalesOrderListModule.module.css'
import { OrdersTable } from '@/entities/sales/OrdersTable'

export const SalesOrderListModule = () => {
    return (
        <div className={styles.SalesOrderListModule}>
            <OrdersTable />
        </div>
    )
}
