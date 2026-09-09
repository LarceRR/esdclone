import React, { useEffect } from 'react'
import { useUpdateWorkOrderMutation } from '@/shared/api'
import { useAppDispatch, useAppSelector } from '@/shared/store'
import { getChangeEvent } from '@/widgets/CalendarModule/model/selectors'
import { IDataUpdateWorkOrderApi } from '@/shared/api/list/workOrdersApi/types/workOrders.ts'
import { calendarActions } from '@/entities/Calendar'
import { useToast } from '@/shared/lib/hooks/toast'

export const DragEvent: React.FC = () => {
    const dispatch = useAppDispatch()
    const [updateEvent] = useUpdateWorkOrderMutation()
    const changeEvent = useAppSelector(getChangeEvent)
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()

    console.log(changeEvent)

    useEffect(() => {
        if (changeEvent !== null) {
            const updatedDataEvent: IDataUpdateWorkOrderApi = {
                id: Number(changeEvent.event.id),
                date_start_work: changeEvent.event.start,
                date_end_work: changeEvent.event.end,
                // TODO: изменить
                // @ts-ignore
                box_id: changeEvent.event._def.resourceIds[0],
            }
            updateEvent(updatedDataEvent)
                .unwrap()
                .then((res) => {
                    if (res) {
                        TOAST_SUCCESS('Заказ-наряд успешно изменён')
                    }
                })
                .catch((err) => {
                    console.error(err)
                    TOAST_ERROR('Ошибка при изменении заказ-наряда')
                })
                .finally(() => {
                    dispatch(calendarActions.dragEvent(null))
                })
        }
    }, [])

    return <div />
}
