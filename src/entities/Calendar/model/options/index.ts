import { ButtonTextCompoundInput, PluginDef } from '@fullcalendar/core'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import ruLocale from '@fullcalendar/core/locales/ru'

export const pluginsCalendar: PluginDef[] = [timeGridPlugin, dayGridPlugin, interactionPlugin, resourceTimeGridPlugin]
export const locales = [ruLocale]
export const buttonTextCalendar: ButtonTextCompoundInput = {
    prev: 'Предыдущий день',
    next: 'Следующий день',
    prevYear: 'Следующий год',
    nextYear: 'Предыдущий год',
    today: 'Сегодня',
    month: 'Месяц',
    week: 'Неделя',
    day: 'День',
}
