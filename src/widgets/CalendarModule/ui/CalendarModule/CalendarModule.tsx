import React, { useCallback } from 'react'
import styles from './CalendarModule.module.css'
import { useAppDispatch, useAppSelector } from '@/shared/store'
import { getChangeEvent, getClickEvent, getSelectEvent, getToggleModalClick, getToggleModalSelect } from '../../model/selectors'
import { DateSelectArg, EventChangeArg, EventClickArg } from '@fullcalendar/core'
import Calendar, { calendarActions } from '@/entities/Calendar'
import DragEvent from '@/features/calendar/DragEvent'
import { useGetAllBoxesQuery, useGetListWorkOrdersQuery } from '@/shared/api'
import { LoaderCalendarModule } from '@/widgets/CalendarModule/ui/LoaderCalendarModule/LoaderCalendarModule.tsx'
import { useToast } from '@/shared/lib/hooks/toast'
import { EventInput } from '@fullcalendar/core'
import { Draft } from '@reduxjs/toolkit'
import { ResourceInput } from '@fullcalendar/resource'
import CreateOrder from '@/features/work-orders/CreateOrder'
import ChangeOrder from '@/features/work-orders/ChangeOrder'

export const CalendarModule: React.FC = () => {
    const dispatch = useAppDispatch()
    const { TOAST_ERROR } = useToast()

    // selectors
    const selectedRangeEvent = useAppSelector(getSelectEvent)
    const draftEvent = useAppSelector(getChangeEvent)
    const clickEvent = useAppSelector(getClickEvent)
    const toggleSelectRangeEvent = useAppSelector(getToggleModalSelect)
    const toggleClickEvent = useAppSelector(getToggleModalClick)

    // queries
    const { data: boxList, isLoading: loadingBoxes, isError: errorBoxList } = useGetAllBoxesQuery()
    const { data: dataEvents, isLoading: loadingEvents, isError: errorEvents } = useGetListWorkOrdersQuery()

    // changedQueries
    const boxes: ResourceInput[] | undefined =
        boxList &&
        boxList.data.map(
            (box): ResourceInput => ({
                id: String(box.id),
                title: box.name,
            }),
        )
    const events: EventInput[] | undefined =
        dataEvents &&
        // @ts-ignore
        dataEvents.data.map(
            // @ts-ignore
            (event): EventInput => ({
                id: String(event.id),
                title: event.counterparty,
                start: event.date_start_work,
                end: event.date_end_work,
                color: '#2E1D49',
                // @ts-ignore
                resourceId: event.box_id ? String(event.box_id) : '1',
            }),
        )

    // select (create) event
    const onSelectRangeEvent = (event: Draft<DateSelectArg>) => {
        dispatch(calendarActions.selectEvent(event))
        dispatch(calendarActions.toggleModalSelect(true))
    }
    const onCloseModalSelectEvent = useCallback(() => {
        dispatch(calendarActions.toggleModalSelect(false))
        dispatch(calendarActions.selectEvent(null))
    }, [])

    // drag event
    const onChangeDragEvent = (event: Draft<EventChangeArg>) => {
        dispatch(calendarActions.dragEvent(event))
    }

    // click event
    const onClickEvent = (event: Draft<EventClickArg>) => {
        dispatch(calendarActions.toggleModalClick(true))
        dispatch(calendarActions.clickEvent(event))
    }
    const onCloseClickEvent = useCallback(() => {
        dispatch(calendarActions.toggleModalClick(false))
        dispatch(calendarActions.clickEvent(null))
    }, [])

    if (loadingEvents || loadingBoxes) return <LoaderCalendarModule />

    if (errorEvents || errorBoxList) {
        setTimeout(() => TOAST_ERROR('Не удалось загрузить календарь. Перезагрузите страницу'), 3000)
        return <LoaderCalendarModule />
    }

    return (
        boxes &&
        events && (
            <div className={styles.CalendarModule}>
                <Calendar
                    resources={boxes}
                    events={events}
                    // TODO: Изменить тип
                    // @ts-ignore
                    onSelectRange={onSelectRangeEvent}
                    // TODO: Изменить тип
                    // @ts-ignore
                    onChangeDragEvent={onChangeDragEvent}
                    // TODO: Изменить тип
                    // @ts-ignore
                    onClickEvent={onClickEvent}
                />
                {selectedRangeEvent && (
                    <CreateOrder
                        onClose={onCloseModalSelectEvent}
                        open={toggleSelectRangeEvent}
                    />
                )}
                {draftEvent && <DragEvent />}
                {clickEvent && (
                    <ChangeOrder
                        open={toggleClickEvent}
                        onClose={onCloseClickEvent}
                        module={'calendar'}
                    />
                )}
            </div>
        )
    )
}
