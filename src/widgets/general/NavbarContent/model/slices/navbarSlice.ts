import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { INavbarSlice } from '@/shared/store/lib/types/stateSchema.ts'

const initialState: INavbarSlice = {
    toggle: true,
    mobileDrawerOpen: false,
}

const navbarSlice = createSlice({
    name: 'navbar-slice',
    initialState,
    reducers: {
        toggleNavbar: (state) => {
            state.toggle = !state.toggle
        },
        setSidebarWide: (state) => {
            state.toggle = true
        },
        setMobileDrawerOpen: (state, action: PayloadAction<boolean>) => {
            state.mobileDrawerOpen = action.payload
            if (action.payload) {
                state.toggle = true
            }
        },
    },
})
export const { actions: navbarActions, reducer: navbarReducer } = navbarSlice
