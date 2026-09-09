import { Translations } from '@aldabil/react-scheduler/types'

export const translations: Translations = {
    navigation: {
        month: 'Месяц',
        week: 'Неделя',
        day: 'День',
        today: 'Сегодня',
        agenda: 'Повестка дня',
    },
    form: {
        addTitle: 'Добавить событие',
        editTitle: 'Изменить событие',
        confirm: 'Принять',
        delete: 'Удалить',
        cancel: 'Отменить',
    },
    event: {
        title: 'Заголовок',
        subtitle: 'Подзаголовк',
        start: 'Начать',
        end: 'Закончить',
        allDay: 'Весь день',
    },
    validation: {
        required: 'Обязательно',
        invalidEmail: 'Некорректный Email',
        onlyNumbers: 'Разрешены только цифры',
        min: 'Минимум {{min}} букв',
        max: 'Максимум {{max}} букв',
    },
    moreEvents: 'Больше...',
    noDataToDisplay: 'Нет данных для отображения',
    loading: 'Загрузка...',
}
