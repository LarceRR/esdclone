import { configureStore } from '@reduxjs/toolkit'
import { useAppSelector, useAppDispatch } from './lib/hooks'
import { authApi } from '@/shared/api/list/authApi'
import { workOrdersApi } from '@/shared/api/list/workOrdersApi'
import { persistStore } from 'redux-persist'
import { persistedReducer } from './lib/persist'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants'
import { boxApi } from '@/shared/api/list/boxApi'
import { usersApi } from '@/shared/api/list/usersApi'
import { groupsApi } from '@/shared/api/list/groupsApi'
import { salesApi } from '@/shared/api/list/salesApi'
import { customerOrdersApi } from '@/shared/api/list/customerOrdersApi'
import { carApi } from '@/shared/api/list/carApi'
import { discountApi } from '@/shared/api/list/discountApi'
import { smsApi } from '@/shared/api/list/smsApi'
import { categoriesApi } from '@/shared/api/list/categoriesApi'
import { goodsApi } from '@/shared/api/list/goodsApi'
import { informationPagesApi } from '@/shared/api/list/informationPagesApi'
import { shopOrdersApi } from '@/shared/api/list/shopOrdersApi'
import { refundRequestApi } from '@/shared/api/list/refundRequestApi'
import { warehouseApi } from '@/shared/api/list/warehouseApi'
import { fundRecordApi } from '@/shared/api/list/fundRecordApi'
import { walletApi } from '@/shared/api/list/walletApi'
import { financialReportApi } from '@/shared/api/list/financialReportApi'
import { tariffApi } from '@/shared/api/list/tariffApi'
import { purchaseHistoryApi } from '@/shared/api/list/purchaseHistoryApi'
import { dashboardApi } from '@/shared/api/list/dashboardApi'
import { businessLeagueApi } from '@/shared/api/list/businessLeagueApi'
import { shopApi } from '@/shared/api/list/shopApi'
import { shopSettingsApi } from '@/shared/api/list/shopSettingsApi'
import { sellerLevelApi } from '@/shared/api/list/sellerLevelApi'

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        }).concat(
            authApi.middleware,
            workOrdersApi.middleware,
            boxApi.middleware,
            authApi.middleware,
            usersApi.middleware,
            groupsApi.middleware,
            salesApi.middleware,
            customerOrdersApi.middleware,
            carApi.middleware,
            discountApi.middleware,
            smsApi.middleware,
            categoriesApi.middleware,
            goodsApi.middleware,
            informationPagesApi.middleware,
            shopOrdersApi.middleware,
            refundRequestApi.middleware,
            warehouseApi.middleware,
            fundRecordApi.middleware,
            walletApi.middleware,
            financialReportApi.middleware,
            tariffApi.middleware,
            purchaseHistoryApi.middleware,
            dashboardApi.middleware,
            businessLeagueApi.middleware,
            shopApi.middleware,
            shopSettingsApi.middleware,
            sellerLevelApi.middleware,
        ),
})
const persistor = persistStore(store)

export { store, useAppSelector, useAppDispatch, persistor }
