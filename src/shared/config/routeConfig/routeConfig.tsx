import { RouteProps } from 'react-router-dom'
import { ELinks } from '@/shared/constants/appLinks.ts'
import HomePage from '@/pages/Home'
import SignInPage from '@/pages/SignIn'
import SignUpPage from '@/pages/SignUp'
import CalendarPage from '@/pages/Calendar'
import WorkOrdersPage from '@/pages/WorkOrders'
import UsersListPage from '@/pages/UsersList'
import GroupsPage from '@/pages/Groups'
import BoxesPage from '@/pages/Boxes'
import SettingsPage from '@/pages/Settings'
import NotFoundPage from '@/pages/NotFound'
import DashboardPage from '@/pages/Dashboard'
import SalesPage from '@/pages/Sales'
import MoneyPage from '@/pages/Money'
import TransfersPage from '@/pages/Transfers'
import ProviderPage from '@/pages/Provider'
import ReceiptsPage from '@/pages/Receipts'
import AdjustmentPage from '@/pages/Adjustment'
import CategoriesPage from '@/pages/Categories/index.ts'
import Order from '@/pages/Order'
import { OrderCreate } from '@/pages/OrderCreate'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import FinancialReportPage from '@/pages/FinancialReport'
import WalletDepositPage from '@/pages/WalletDeposit'
import WalletWithdrawPage from '@/pages/WalletWithdraw'
import RecordFundPage from '@/pages/RecordFund'
import ProductStoragePage from '@/pages/ProductStorage'
import RefundRequestPage from '@/pages/RefundRequest'
import ProductWarehousePage from '@/pages/ProductWarehouse'
import ProductImportPage from '@/pages/ProductImport'
import InformationPagesPage from '@/pages/InformationPages'
import InformationPageCreatePage from '@/pages/InformationPageCreate'
import InformationPageEditPage from '@/pages/InformationPageEdit'
import BusinessLeaguePage from '@/pages/BusinessLeague'
import PurchaseHistoryPage from '@/pages/PurchaseHistory'
import SellerLevelPage from '@/pages/SellerLevel'
import ShopExpressPage from '@/pages/ShopExpress'
import ResetPasswordPage from '@/pages/ResetPassword'
import ContentPagePublicPage from '@/pages/ContentPagePublic'

export enum AppRouter {
    HOME = 'home',
    DASHBOARD = 'dashboard',
    SETTINGS = 'settings',
    SIGN_IN = 'sign-in',
    SIGN_UP = 'sign-up',
    RECOVERY = 'recovery',
    RESET_PASSWORD = 'reset-password',
    CALENDAR = 'calendar',
    CATEGORIES = 'categories',
    WORK_ORDERS = 'work-orders',
    ORDER_CREATE = 'order-create',
    USERS_LIST = 'users-list',
    GROUPS_LIST = 'groups-list',
    BOXES_LIST = 'boxes-list',
    INFORMATION_PAGES = 'information-pages',
    INFORMATION_PAGE_CREATE = 'information-page-create',
    INFORMATION_PAGE_EDIT = 'information-page-edit',
    CONTENT_PAGE_PUBLIC = 'content-page-public',
    SALES_LIST = 'sales',
    SALES_ORDER_LIST = 'sales-order-list',
    MONEY_LIST = 'money',
    MONEY_DEPOSIT = 'money-deposit',
    MONEY_WITHDRAW = 'money-withdraw',
    MONEY_TRANSFERS_LIST = 'money-transfers',
    PROVIDER_LIST = 'provider-list',
    RECEIPTS_LIST = 'receipts-list',
    ADJUSTMENT_LIST = 'adjustment-list',
    FINANCIAL_REPORT = 'financial-report',
    RECORD_FUND = 'record-fund',
    PRODUCT_HOLD = 'product-hold',
    PRODUCT_RETURN_REQUEST = 'product-return-request',
    PRODUCT_OVERVIEW = 'product-overview',
    PRODUCT_WAREHOUSE = 'product-warehouse',
    PRODUCT_IMPORT = 'product-import',
    BUSINESS_LEAGUE = 'business-league',
    MARKETING_SHOP_EXPRESS = 'marketing-shop-express',
    MARKETING_PURCHASE_HISTORY = 'marketing-purchase-history',
    MARKETING_SELLER_LEVEL = 'marketing-seller-level',
    NOT_FOUND = 'not-found',
}
export const RoutePath: Record<AppRouter, ELinks> = {
    [AppRouter.HOME]: ELinks.HOME,
    [AppRouter.DASHBOARD]: ELinks.DASHBOARD,
    [AppRouter.SETTINGS]: ELinks.SETTINGS,
    [AppRouter.SIGN_IN]: ELinks.SIGN_IN,
    [AppRouter.SIGN_UP]: ELinks.SIGN_UP,
    [AppRouter.RECOVERY]: ELinks.RECOVERY,
    [AppRouter.RESET_PASSWORD]: ELinks.RESET_PASSWORD,
    [AppRouter.CALENDAR]: ELinks.CALENDAR,
    [AppRouter.CATEGORIES]: ELinks.CATEGORIES,
    [AppRouter.WORK_ORDERS]: ELinks.WORK_ORDERS,
    [AppRouter.ORDER_CREATE]: ELinks.SALES_ORDER_CREATE,
    [AppRouter.USERS_LIST]: ELinks.USERS_LIST,
    [AppRouter.GROUPS_LIST]: ELinks.GROUPS_LIST,
    [AppRouter.BOXES_LIST]: ELinks.BOXES_LIST,
    [AppRouter.INFORMATION_PAGES]: ELinks.INFORMATION_PAGES,
    [AppRouter.INFORMATION_PAGE_CREATE]: ELinks.INFORMATION_PAGE_CREATE,
    [AppRouter.INFORMATION_PAGE_EDIT]: ELinks.INFORMATION_PAGE_EDIT,
    [AppRouter.CONTENT_PAGE_PUBLIC]: ELinks.CONTENT_PAGE_PUBLIC,
    [AppRouter.SALES_LIST]: ELinks.SALES_LIST,
    [AppRouter.SALES_ORDER_LIST]: ELinks.SALES_ORDER_LIST,
    [AppRouter.MONEY_LIST]: ELinks.MONEY_LIST,
    [AppRouter.MONEY_DEPOSIT]: ELinks.MONEY_DEPOSIT,
    [AppRouter.MONEY_WITHDRAW]: ELinks.MONEY_WITHDRAW,
    [AppRouter.MONEY_TRANSFERS_LIST]: ELinks.MONEY_TRANSFERS_LIST,
    [AppRouter.PROVIDER_LIST]: ELinks.STOCK_PROVIDER_LIST,
    [AppRouter.RECEIPTS_LIST]: ELinks.STOCK_RECEIPTS_LIST,
    [AppRouter.ADJUSTMENT_LIST]: ELinks.STOCK_ADJUSTMENT_LIST,
    [AppRouter.FINANCIAL_REPORT]: ELinks.FINANCIAL_REPORT,
    [AppRouter.RECORD_FUND]: ELinks.RECORD_FUND,
    [AppRouter.PRODUCT_HOLD]: ELinks.PRODUCT_HOLD,
    [AppRouter.PRODUCT_RETURN_REQUEST]: ELinks.PRODUCT_RETURN_REQUEST,
    [AppRouter.PRODUCT_OVERVIEW]: ELinks.PRODUCT_OVERVIEW,
    [AppRouter.PRODUCT_WAREHOUSE]: ELinks.PRODUCT_WAREHOUSE,
    [AppRouter.PRODUCT_IMPORT]: ELinks.PRODUCT_IMPORT,
    [AppRouter.BUSINESS_LEAGUE]: ELinks.BUSINESS_LEAGUE,
    [AppRouter.MARKETING_SHOP_EXPRESS]: ELinks.MARKETING_SHOP_EXPRESS,
    [AppRouter.MARKETING_PURCHASE_HISTORY]: ELinks.MARKETING_PURCHASE_HISTORY,
    [AppRouter.MARKETING_SELLER_LEVEL]: ELinks.MARKETING_SELLER_LEVEL,
    [AppRouter.NOT_FOUND]: ELinks.NOT_FOUND,
}
export const routeConfig: Record<AppRouter, RouteProps> = {
    [AppRouter.DASHBOARD]: {
        path: RoutePath[AppRouter.DASHBOARD],
        element: <DashboardPage />,
    },
    [AppRouter.SALES_LIST]: {
        path: RoutePath[AppRouter.SALES_LIST],
        element: <SalesPage />,
    },
    [AppRouter.HOME]: {
        path: RoutePath[AppRouter.HOME],
        element: <HomePage />,
    },
    [AppRouter.SETTINGS]: {
        path: RoutePath[AppRouter.SETTINGS],
        element: <SettingsPage />,
    },
    [AppRouter.SIGN_IN]: {
        path: RoutePath[AppRouter.SIGN_IN],
        element: <SignInPage />,
    },
    [AppRouter.SIGN_UP]: {
        path: RoutePath[AppRouter.SIGN_UP],
        element: <SignUpPage />,
    },
    [AppRouter.RECOVERY]: {
        path: RoutePath[AppRouter.RECOVERY],
        element: <SignInPage />,
    },
    [AppRouter.RESET_PASSWORD]: {
        path: RoutePath[AppRouter.RESET_PASSWORD],
        element: <ResetPasswordPage />,
    },
    [AppRouter.CALENDAR]: {
        path: RoutePath[AppRouter.CALENDAR],
        element: <CalendarPage />,
    },
    [AppRouter.CATEGORIES]: {
        path: RoutePath[AppRouter.CATEGORIES],
        element: <CategoriesPage />,
    },
    [AppRouter.ORDER_CREATE]: {
        path: RoutePath[AppRouter.ORDER_CREATE],
        element: <OrderCreate />,
    },
    [AppRouter.WORK_ORDERS]: {
        path: RoutePath[AppRouter.WORK_ORDERS],
        element: <WorkOrdersPage />,
    },
    [AppRouter.USERS_LIST]: {
        path: RoutePath[AppRouter.USERS_LIST],
        element: <UsersListPage />,
    },
    [AppRouter.GROUPS_LIST]: {
        path: RoutePath[AppRouter.GROUPS_LIST],
        element: <GroupsPage />,
    },
    [AppRouter.BOXES_LIST]: {
        path: RoutePath[AppRouter.BOXES_LIST],
        element: <BoxesPage />,
    },
    [AppRouter.INFORMATION_PAGES]: {
        path: RoutePath[AppRouter.INFORMATION_PAGES],
        element: <InformationPagesPage />,
    },
    [AppRouter.INFORMATION_PAGE_CREATE]: {
        path: RoutePath[AppRouter.INFORMATION_PAGE_CREATE],
        element: <InformationPageCreatePage />,
    },
    [AppRouter.INFORMATION_PAGE_EDIT]: {
        path: RoutePath[AppRouter.INFORMATION_PAGE_EDIT],
        element: <InformationPageEditPage />,
    },
    [AppRouter.CONTENT_PAGE_PUBLIC]: {
        path: RoutePath[AppRouter.CONTENT_PAGE_PUBLIC],
        element: <ContentPagePublicPage />,
    },
    [AppRouter.NOT_FOUND]: {
        path: RoutePath[AppRouter.NOT_FOUND],
        element: <NotFoundPage />,
    },
    [AppRouter.SALES_ORDER_LIST]: {
        path: RoutePath[AppRouter.SALES_ORDER_LIST],
        element: <Order />,
    },
    [AppRouter.MONEY_LIST]: {
        path: RoutePath[AppRouter.MONEY_LIST],
        element: <MoneyPage />,
    },
    [AppRouter.MONEY_DEPOSIT]: {
        path: RoutePath[AppRouter.MONEY_DEPOSIT],
        element: <WalletDepositPage />,
    },
    [AppRouter.MONEY_WITHDRAW]: {
        path: RoutePath[AppRouter.MONEY_WITHDRAW],
        element: <WalletWithdrawPage />,
    },
    [AppRouter.MONEY_TRANSFERS_LIST]: {
        path: RoutePath[AppRouter.MONEY_TRANSFERS_LIST],
        element: <TransfersPage />,
    },
    [AppRouter.PROVIDER_LIST]: {
        path: RoutePath[AppRouter.PROVIDER_LIST],
        element: <ProviderPage />,
    },
    [AppRouter.RECEIPTS_LIST]: {
        path: RoutePath[AppRouter.RECEIPTS_LIST],
        element: <ReceiptsPage />,
    },
    [AppRouter.ADJUSTMENT_LIST]: {
        path: RoutePath[AppRouter.ADJUSTMENT_LIST],
        element: <AdjustmentPage />,
    },
    [AppRouter.FINANCIAL_REPORT]: {
        path: RoutePath[AppRouter.FINANCIAL_REPORT],
        element: <FinancialReportPage />,
    },
    [AppRouter.RECORD_FUND]: {
        path: RoutePath[AppRouter.RECORD_FUND],
        element: <RecordFundPage />,
    },
    [AppRouter.PRODUCT_HOLD]: {
        path: RoutePath[AppRouter.PRODUCT_HOLD],
        element: <ProductStoragePage />,
    },
    [AppRouter.PRODUCT_RETURN_REQUEST]: {
        path: RoutePath[AppRouter.PRODUCT_RETURN_REQUEST],
        element: <RefundRequestPage />,
    },
    [AppRouter.PRODUCT_OVERVIEW]: {
        path: RoutePath[AppRouter.PRODUCT_OVERVIEW],
        element: <PlaceholderPage title='Обзор продукта' />,
    },
    [AppRouter.PRODUCT_WAREHOUSE]: {
        path: RoutePath[AppRouter.PRODUCT_WAREHOUSE],
        element: <ProductWarehousePage />,
    },
    [AppRouter.PRODUCT_IMPORT]: {
        path: RoutePath[AppRouter.PRODUCT_IMPORT],
        element: <ProductImportPage />,
    },
    [AppRouter.BUSINESS_LEAGUE]: {
        path: RoutePath[AppRouter.BUSINESS_LEAGUE],
        element: <BusinessLeaguePage />,
    },
    [AppRouter.MARKETING_SHOP_EXPRESS]: {
        path: RoutePath[AppRouter.MARKETING_SHOP_EXPRESS],
        element: <ShopExpressPage />,
    },
    [AppRouter.MARKETING_PURCHASE_HISTORY]: {
        path: RoutePath[AppRouter.MARKETING_PURCHASE_HISTORY],
        element: <PurchaseHistoryPage />,
    },
    [AppRouter.MARKETING_SELLER_LEVEL]: {
        path: RoutePath[AppRouter.MARKETING_SELLER_LEVEL],
        element: <SellerLevelPage />,
    },
}
