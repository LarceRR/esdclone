import { IStateSchema } from '@/shared/store/lib/types/stateSchema.ts'

export const getToggleModalClick = (state: IStateSchema) => state.calendar.toggleModalClick
