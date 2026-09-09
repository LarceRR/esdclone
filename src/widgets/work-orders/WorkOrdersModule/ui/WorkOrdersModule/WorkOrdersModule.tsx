import React, { useCallback, useState } from 'react'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { WorkOrdersTable } from '@/entities/work-orders/WorkOrdersTable'
import styles from './WorkOrdersModule.module.css'
import { CreatePlusTrigger } from '@/shared/ui/CreatePlusTrigger'
import CreateOrder from '@/features/work-orders/CreateOrder'
import WorkOrdersSettings from '@/widgets/work-orders/WorkOrdersSettings'

export const WorkOrdersModule: React.FC = () => {
    useSetPageTitle('Заказ-наряды')
    const [toggleCreateOrderModal, setToggleCreateOrderModal] = useState<boolean>(false)

    // create order
    const onCloseCreateOrderModal = useCallback(() => setToggleCreateOrderModal(false), [])
    const onOpenCreateOrderModal = useCallback(() => setToggleCreateOrderModal(true), [])

    return (
        <div className={styles.WorkOrdersModule}>
            <div className={styles.header}>
                <div className={styles.actions}>
                    <CreatePlusTrigger
                        label='Создать заказ-наряд'
                        onClick={onOpenCreateOrderModal}
                    />
                    <WorkOrdersSettings />
                </div>
                <CreateOrder
                    open={toggleCreateOrderModal}
                    onClose={onCloseCreateOrderModal}
                />
            </div>
            <WorkOrdersTable />
        </div>
    )
}
