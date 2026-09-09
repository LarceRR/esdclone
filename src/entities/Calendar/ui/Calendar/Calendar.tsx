import React from 'react'
import FullCalendar from '@fullcalendar/react'
import {
    // buttonTextCalendar,
    locales,
    pluginsCalendar,
} from '../../model/options'
import { DateSelectArg, EventChangeArg, EventClickArg, EventInput } from '@fullcalendar/core'
import './Calendar.css'
import { ResourceInput } from '@fullcalendar/resource'

interface ICalendar {
    onSelectRange: (event: DateSelectArg) => void
    onClickEvent: (event: EventClickArg) => void
    onChangeDragEvent: (event: EventChangeArg) => void
    events: EventInput[]
    resources: ResourceInput[]
}

export const Calendar: React.FC<ICalendar> = (props) => {
    const { onChangeDragEvent, onClickEvent, onSelectRange, events, resources } = props

    return (
        <FullCalendar
            schedulerLicenseKey={'CC-Attribution-NonCommercial-NoDerivatives'}
            height={'calc(100vh - 2rem)'}
            // buttonText={buttonTextCalendar}
            initialView={'resourceTimeGrid'}
            locale={'ru'}
            locales={locales}
            plugins={pluginsCalendar}
            // initialView={'timeGrid'}
            // resources={}
            headerToolbar={{
                left: 'title',
                right: 'today prev,next', // user can switch between the two
            }}
            // params
            selectable={true}
            editable={true}
            droppable={true}
            nowIndicator={true}
            // events
            resources={resources}
            events={events}
            select={onSelectRange}
            eventClick={onClickEvent}
            eventChange={onChangeDragEvent}
        />
    )
}
