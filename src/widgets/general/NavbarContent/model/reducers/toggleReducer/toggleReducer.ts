import { IStateSchema } from '@/shared/store/lib/types/stateSchema.ts'

export const toggleReducer = (state: IStateSchema) => state.navbar.toggle

export const mobileDrawerOpenReducer = (state: IStateSchema) => Boolean(state.navbar.mobileDrawerOpen)
