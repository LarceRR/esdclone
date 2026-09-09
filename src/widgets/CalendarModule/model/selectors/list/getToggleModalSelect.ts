import { IStateSchema } from '@/shared/store/lib/types/stateSchema.ts'

export const getToggleModalSelect = (state: IStateSchema) => state.calendar.toggleModalSelect
