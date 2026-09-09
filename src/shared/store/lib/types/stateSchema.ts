import { IUserData } from '@/shared/types/auth'
import { DateSelectArg, EventChangeArg, EventClickArg } from '@fullcalendar/core'

export interface IAuthSlice {
    userToken: string | null
    data: IUserData | null
    role: string | null
}

export interface IEventCalendar {
    id: number
    title: string
    url?: string
    start: Date | string
    end: Date | string
}

export interface ICalendarSlice {
    toggleModalSelect: boolean
    toggleModalClick: boolean
    selectEvent: null | DateSelectArg
    changeEvent: null | EventChangeArg
    clickEvent: null | EventClickArg
}

export interface INavbarSlice {
    toggle: boolean
    /** Выезжающий сайдбар на экранах ≤768px */
    mobileDrawerOpen: boolean
}

export interface IShopContextSlice {
    selectedSellerId: number | null
}

export interface IStateSchema {
    auth: IAuthSlice
    calendar: ICalendarSlice
    navbar: INavbarSlice
    shopContext: IShopContextSlice
    // TODO: types
    authApi: any
    // TODO: types
    workOrdersApi: any
    // TODO: types
    boxApi: any
    // TODO: types
    usersApi: any
    // TODO: types
    groupsApi: any
    // TODO: types
    salesApi: any
    // TODO: types
    customerOrdersApi: any
    // TODO: types
    carApi: any
    // TODO: types
    discountApi: any
    // TODO: types
    smsApi: any
    categoriesApi: any
    goodsApi: any
    informationPagesApi: any
    shopOrdersApi: any
    refundRequestApi: any
    warehouseApi: any
    fundRecordApi: any
    walletApi: any
    financialReportApi: any
    tariffApi: any
    purchaseHistoryApi: any
    dashboardApi: any
    businessLeagueApi: any
    shopApi: any
    shopSettingsApi: any
    sellerLevelApi: any
}
