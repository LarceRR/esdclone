import { store } from '../../'
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux'
import { IStateSchema } from '@/shared/store/lib/types/stateSchema.ts'

// type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<IStateSchema> = useSelector
