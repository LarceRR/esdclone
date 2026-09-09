import { IStateSchema } from '@/shared/store/lib/types/stateSchema.ts'

export const getSelectEvent = (state: IStateSchema) => state.calendar.selectEvent
