import storage from 'redux-persist/lib/storage'
import { workOrdersApi } from '@/shared/api/list/workOrdersApi'
import { calendarPath } from '@/entities/Calendar'
import { boxApi } from '@/shared/api/list/boxApi'
import { authApi } from '@/shared/api/list/authApi'
import { usersApi } from '@/shared/api/list/usersApi'
import { groupsApi } from '@/shared/api/list/groupsApi'
import { salesApi } from '@/shared/api/list/salesApi'
import { customerOrdersApi } from '@/shared/api/list/customerOrdersApi'
import { carApi } from '@/shared/api/list/carApi'
import { discountApi } from '@/shared/api/list/discountApi'
import { smsApi } from '@/shared/api/list/smsApi'
import { categoriesApi } from '@/shared/api/list/categoriesApi'
import { goodsApi } from '@/shared/api/list/goodsApi'
import { warehouseApi } from '@/shared/api/list/warehouseApi'
import { informationPagesApi } from '@/shared/api/list/informationPagesApi'
import { shopOrdersApi } from '@/shared/api/list/shopOrdersApi'
import { refundRequestApi } from '@/shared/api/list/refundRequestApi'
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

export const persistConfig = {
    key: 'root',
    storage,
    blacklist: [
        workOrdersApi.reducerPath,
        boxApi.reducerPath,
        authApi.reducerPath,
        calendarPath,
        usersApi.reducerPath,
        groupsApi.reducerPath,
        salesApi.reducerPath,
        customerOrdersApi.reducerPath,
        carApi.reducerPath,
        discountApi.reducerPath,
        smsApi.reducerPath,
        categoriesApi.reducerPath,
        goodsApi.reducerPath,
        warehouseApi.reducerPath,
        informationPagesApi.reducerPath,
        shopOrdersApi.reducerPath,
        refundRequestApi.reducerPath,
        fundRecordApi.reducerPath,
        walletApi.reducerPath,
        financialReportApi.reducerPath,
        tariffApi.reducerPath,
        purchaseHistoryApi.reducerPath,
        dashboardApi.reducerPath,
        businessLeagueApi.reducerPath,
        shopApi.reducerPath,
        shopSettingsApi.reducerPath,
        sellerLevelApi.reducerPath,
    ],
}
