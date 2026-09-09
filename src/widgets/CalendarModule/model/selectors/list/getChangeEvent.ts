import { IStateSchema } from '@/shared/store/lib/types/stateSchema.ts'
export const getChangeEvent = (state: IStateSchema) => state.calendar.changeEvent
