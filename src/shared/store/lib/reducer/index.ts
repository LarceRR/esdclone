import { combineReducers, ReducersMapObject } from '@reduxjs/toolkit'
import { authReducer } from '@/shared/store/slices/authSlice.ts'
import { calendarReducer } from '@/entities/Calendar'
import { IStateSchema } from '../types/stateSchema.ts'
import { authApi } from '@/shared/api/list/authApi'
import { workOrdersApi } from '@/shared/api/list/workOrdersApi'
import { navbarReducer } from '@/widgets/general/NavbarContent/model/slices/navbarSlice.ts'
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
import { shopContextReducer } from '@/shared/store/slices/shopContextSlice.ts'

export const reducers = combineReducers<ReducersMapObject<IStateSchema>>({
    auth: authReducer,
    calendar: calendarReducer,
    navbar: navbarReducer,
    shopContext: shopContextReducer,
    [authApi.reducerPath]: authApi.reducer,
    [workOrdersApi.reducerPath]: workOrdersApi.reducer,
    [boxApi.reducerPath]: boxApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [groupsApi.reducerPath]: groupsApi.reducer,
    [salesApi.reducerPath]: salesApi.reducer,
    [customerOrdersApi.reducerPath]: customerOrdersApi.reducer,
    [carApi.reducerPath]: carApi.reducer,
    [discountApi.reducerPath]: discountApi.reducer,
    [smsApi.reducerPath]: smsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [goodsApi.reducerPath]: goodsApi.reducer,
    [informationPagesApi.reducerPath]: informationPagesApi.reducer,
    [shopOrdersApi.reducerPath]: shopOrdersApi.reducer,
    [refundRequestApi.reducerPath]: refundRequestApi.reducer,
    [warehouseApi.reducerPath]: warehouseApi.reducer,
    [fundRecordApi.reducerPath]: fundRecordApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
    [financialReportApi.reducerPath]: financialReportApi.reducer,
    [tariffApi.reducerPath]: tariffApi.reducer,
    [purchaseHistoryApi.reducerPath]: purchaseHistoryApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [businessLeagueApi.reducerPath]: businessLeagueApi.reducer,
    [shopApi.reducerPath]: shopApi.reducer,
    [shopSettingsApi.reducerPath]: shopSettingsApi.reducer,
    [sellerLevelApi.reducerPath]: sellerLevelApi.reducer,
})
