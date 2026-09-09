import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IShopContextSlice } from '../lib/types/stateSchema.ts'

const initialState: IShopContextSlice = {
    selectedSellerId: null,
}

export const shopContextSlice = createSlice({
    name: 'shop-context',
    initialState,
    reducers: {
        setSelectedSellerId: (state, action: PayloadAction<number | null>) => {
            state.selectedSellerId = action.payload
        },
    },
})

export const { actions: shopContextActions } = shopContextSlice
export const { reducer: shopContextReducer } = shopContextSlice
