import { IStateSchema } from '@/shared/store/lib/types/stateSchema.ts'

export const getClickEvent = (state: IStateSchema) => state.calendar.clickEvent
