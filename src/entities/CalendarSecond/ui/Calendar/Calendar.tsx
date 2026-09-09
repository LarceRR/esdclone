import React from 'react'
import { Scheduler } from '@aldabil/react-scheduler'
import { translations } from '../../model/locale/translations.ts'

export const Calendar: React.FC = () => {
    return (
        <Scheduler
            view={'day'}
            agenda={false}
            month={null}
            week={null}
            height={620}
            resourceViewMode={'tabs'}
            translations={translations}
            timeZone={'Europe/Moscow'}
            draggable={true}
            navigationPickerProps={{ timezone: 'Europe/Moscow' }}
            //     { id: 1, title: 'Бригада 1', group: 'Бригады' },
            hourFormat={'24'}
        />
    )
}
