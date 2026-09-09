import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IAuthSlice } from '../lib/types/stateSchema.ts'

const initialState: IAuthSlice = {
    userToken: null,
    data: null,
    role: null,
}

export const authSlice = createSlice({
    name: 'auth-slice',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any | null>) => {
            state.data = action.payload
            state.role = action.payload?.role ?? null
        },
        setToken: (state, action: PayloadAction<string | null>) => {
            state.userToken = action.payload
        },
    },
})
export const { actions: authActions } = authSlice
export const { reducer: authReducer } = authSlice
