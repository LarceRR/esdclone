import { SettingsModal } from '@/shared/ui/SettingsModal'
import { useState } from 'react'
import styles from './WorkOrdersSettings.module.css'
import { Button } from '@mui/material'
import AddCar from '@/features/work-orders/settings/car/AddCar'
import AddDiscount from '@/features/work-orders/settings/discount/AddDiscount'
import { CarTable } from '@/entities/work-orders/settings/CarTable'
import { DiscountTable } from '@/entities/work-orders/settings/DiscountTable'
import { AdTable } from '@/entities/work-orders/settings/AdTable'
import AddAd from '@/features/work-orders/settings/AddAd'
import { HardWorkTable } from '@/entities/work-orders/settings/HardWorkTable'
import AddHardWork from '@/features/work-orders/settings/AddHardWork'
import { StatusWorkOrdersTable } from '@/entities/work-orders/settings/StatusWorkOrdersTable'
import AddStatusWorkOrders from '@/features/work-orders/settings/AddStatusWorkOrders'
import { SmsWorkOrders } from '@/widgets/work-orders/SmsWorkOrders'
import { RequiredFields } from '@/features/work-orders/settings/RequiredFields'
import CreateBox from '@/features/boxes-list/CreateBox'
import { BoxesTable } from '@/entities/BoxesTable'

const tabSections: string[] = [
    'Автомобили',
    'Дисконтные карты',
    'Обязательные поля',
    'Посты',
    'Реклама',
    'Сложность работ',
    'Статусы заказ-нарядов',
    'SMS',
]

const Tabs = ({ enabledSection, setSection }: { enabledSection: string; setSection: (section: string) => void }) => {
    return (
        <div className={styles.tabs}>
            {tabSections.map((section) => (
                <Button
                    key={section}
                    size={'medium'}
                    variant={'outlined'}
                    disabled={enabledSection === section}
                    onClick={() => setSection(section)}
                >
                    {section}
                </Button>
            ))}
        </div>
    )
}

const WorkOrdersSettings = () => {
    const [enabledSection, setEnabledSection] = useState<string>(tabSections[0])
    const onSelectSection = (section: string) => setEnabledSection(section)

    return (
        <SettingsModal>
            <Tabs
                enabledSection={enabledSection}
                setSection={onSelectSection}
            />
            {enabledSection === tabSections[0] && (
                <div className={styles.section}>
                    <AddCar />
                    <CarTable />
                </div>
            )}
            {enabledSection === tabSections[1] && (
                <div className={styles.section}>
                    <AddDiscount />
                    <DiscountTable />
                </div>
            )}
            {enabledSection === tabSections[2] && (
                <div className={styles.section}>
                    <RequiredFields />
                </div>
            )}
            {enabledSection === tabSections[3] && (
                <div className={styles.section}>
                    <CreateBox stylesButton={{ width: '15%' }} />
                    <BoxesTable styles={{ maxHeight: '424px' }} />
                </div>
            )}
            {enabledSection === tabSections[4] && (
                <div className={styles.section}>
                    <AddAd />
                    <AdTable />
                </div>
            )}
            {enabledSection === tabSections[5] && (
                <div className={styles.section}>
                    <AddHardWork />
                    <HardWorkTable />
                </div>
            )}
            {enabledSection === tabSections[6] && (
                <div className={styles.section}>
                    <AddStatusWorkOrders />
                    <StatusWorkOrdersTable />
                </div>
            )}
            {enabledSection === tabSections[7] && (
                <div className={styles.section}>
                    <SmsWorkOrders />
                </div>
            )}
        </SettingsModal>
    )
}
export default WorkOrdersSettings
