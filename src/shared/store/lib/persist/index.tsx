import { persistReducer } from 'redux-persist'
import { persistConfig } from './config.ts'
import { reducers } from '../reducer'

const persistedReducer = persistReducer(persistConfig, reducers)

export { persistedReducer }
