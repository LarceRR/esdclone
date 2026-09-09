import { useState } from 'react'
import styles from './SmsWorkOrders.module.css'
import { Button } from '@mui/material'
import { Reminder } from '@/features/work-orders/settings/sms/Reminder'
import { Reviews } from '@/features/work-orders/settings/sms/Reviews'
import { Notifications } from '@/features/work-orders/settings/sms/Notifications'
import { Recommendations } from '@/features/work-orders/settings/sms/Recommendations'
import { Balance } from '@/features/work-orders/settings/sms/Balance'
import { useGetSMSListQuery } from '@/shared/api'

const smsTabs: string[] = ['Напоминания', 'Сбор отзывов', 'Уведомления', 'Рекомендации', 'Баланс']

const Tabs = ({ enabledSection, setSection }: { enabledSection: string; setSection: (section: string) => void }) => {
    return (
        <div className={styles.tabs}>
            {smsTabs.map((section) => (
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

export const SmsWorkOrders = () => {
    const [enabledSection, setEnabledSection] = useState<string>(smsTabs[0])
    const { data: smsList } = useGetSMSListQuery()
    console.log(smsList)

    return (
        smsList && (
            <div className={styles.wrapper}>
                <Tabs
                    enabledSection={enabledSection}
                    setSection={setEnabledSection}
                />
                {enabledSection === smsTabs[0] && <Reminder options={smsList[0]} />}
                {enabledSection === smsTabs[1] && <Reviews options={smsList[1]} />}
                {enabledSection === smsTabs[2] && <Notifications options={smsList[2]} />}
                {enabledSection === smsTabs[3] && <Recommendations options={smsList[3]} />}
                {enabledSection === smsTabs[4] && <Balance options={smsList[4]} />}
            </div>
        )
    )
}
