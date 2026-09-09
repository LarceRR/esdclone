import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'
import { ICalendarSlice } from '@/shared/store/lib/types/stateSchema.ts'
import { DateSelectArg, EventChangeArg, EventClickArg } from '@fullcalendar/core'

const initialState: ICalendarSlice = {
    toggleModalSelect: false,
    toggleModalClick: false,
    selectEvent: null,
    changeEvent: null,
    clickEvent: null,
}

const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        toggleModalSelect: (state, action: PayloadAction<boolean>) => {
            state.toggleModalSelect = action.payload
        },
        toggleModalClick: (state, action: PayloadAction<boolean>) => {
            state.toggleModalClick = action.payload
        },
        selectEvent: (state, action: PayloadAction<Draft<DateSelectArg> | null>) => {
            state.selectEvent = action.payload
        },
        dragEvent: (state, action: PayloadAction<Draft<EventChangeArg> | null>) => {
            state.changeEvent = action.payload
        },
        clickEvent: (state, action: PayloadAction<Draft<EventClickArg> | null>) => {
            state.clickEvent = action.payload
        },
    },
})
export const { reducer: calendarReducer, actions: calendarActions, reducerPath: calendarPath } = calendarSlice
