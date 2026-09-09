// auth
export const SIGN_IN_API = '/login'
export const LOGOUT_API = '/exit'
export const AUTH_INFO_API = '/check'
export const REGISTRATION_API = '/registration'
export const PASSWORD_FORGOT_API = '/password/forgot'
export const PASSWORD_RESET_API = '/password/reset'

// dashboard
export const DASHBOARD_SUMMARY_API = '/dashboard/summary'
export const DASHBOARD_CHART_API = '/dashboard/chart'
export const DASHBOARD_CATEGORIES_API = '/dashboard/categories'
export const DASHBOARD_TOP_SELLERS_API = '/dashboard/top-sellers'

// business league
export const BUSINESS_LEAGUE_SUMMARY_API = '/business-league/summary'
export const BUSINESS_LEAGUE_FRIENDS_API = '/business-league/friends'

// seller level
export const SELLER_LEVEL_SUMMARY_API = '/seller-level/summary'

// shop context (admin)
export const SHOP_LIST_API = '/shop/list'

// shop settings
export const SHOP_SETTINGS_API = '/shop/settings'
export const SHOP_SETTINGS_UPDATE_API = '/shop/settings/update'
export const SHOP_SETTINGS_UPLOAD_API = '/shop/settings/upload'
export const SHOP_SETTINGS_DELETE_IMAGE_API = '/shop/settings/delete-image'

// account (personal settings)
export const ACCOUNT_PHONE_API = '/account/phone'
export const ACCOUNT_EMAIL_SEND_CODE_API = '/account/email/send-code'
export const ACCOUNT_EMAIL_VERIFY_API = '/account/email/verify'
export const ACCOUNT_AVATAR_API = '/account/avatar'

// work orders
export const WORK_ORDERS_LIST_API = '/order/list'
export const WORK_ORDER_SHOW_API = '/order/show'
export const WORK_ORDERS_CREATE_API = '/order/store'
export const WORK_ORDERS_UPDATE_API = '/order/update'
export const WORK_ORDERS_DELETE_API = '/order/delete'
export const WORK_ORDERS_CSV_API = '/order/csv'

// box
export const BOX_LIST_API = '/box/list'
export const BOX_SHOW_API = '/box/show'
export const BOX_CREATE_API = '/box/store'
export const BOX_UPDATE_API = '/box/update'
export const BOX_DELETE_API = '/box/delete'

// categories
export const CATEGORIES_LIST_API = '/category/list'
export const CATEGORY_SHOW_API = '/category/show'
export const CATEGORY_CREATE_API = '/category/store'
export const CATEGORY_UPDATE_API = '/category/update'
export const CATEGORY_DELETE_API = '/category/delete'

// users
export const USERS_LIST_API = '/user/list'
export const USER_SHOW_API = '/user/show'
export const USER_CREATE_API = '/user/store'
export const USER_UPDATE_API = '/user/update'
export const USER_DELETE_API = '/user/delete'

// groups
export const GROUPS_LIST_API = '/group/list'
export const GROUP_SHOW_API = '/group/show'
export const GROUP_CREATE_API = '/group/store'
export const GROUP_UPDATE_API = '/group/update'
export const GROUP_DELETE_API = '/group/delete'

// sales (offers)
export const OFFER_LIST_API = '/offer/list'
export const OFFER_SHOW_API = '/offer/show'
export const OFFER_CREATE_API = '/offer/store'
export const OFFER_UPDATE_API = '/offer/update'
export const OFFER_DELETE_API = '/offer/delete'

// shop orders (магазин заказ)
export const SHOP_ORDERS_LIST_API = '/sales/list'
export const SHOP_ORDERS_SHOW_API = '/sales/show'
export const SHOP_ORDERS_CREATE_API = '/sales/store'
export const SHOP_ORDERS_UPDATE_API = '/sales/update'
export const SHOP_ORDERS_DELETE_API = '/sales/delete'
export const SHOP_ORDERS_BULK_PURCHASE_API = '/sales/bulk-purchase'

// refund requests
export const REFUND_LIST_API = '/refund/list'
export const REFUND_SHOW_API = '/refund/show'
export const REFUND_STORE_API = '/refund/store'
export const REFUND_UPDATE_API = '/refund/update'
export const REFUND_DELETE_API = '/refund/delete'
export const REFUND_BULK_PROCESS_API = '/refund/bulk-process'

// fund records (фонд записи)
export const FUND_LIST_API = '/fund/list'
export const FUND_SHOW_API = '/fund/show'
export const FUND_STORE_API = '/fund/store'
export const FUND_REVERSE_API = '/fund/reverse'

// wallet (мой бумажник)
export const WALLET_SUMMARY_API = '/wallet/summary'
export const WALLET_LIST_API = '/wallet/list'
export const WALLET_ADDRESSES_API = '/wallet/addresses'
export const WALLET_SHOW_API = '/wallet/show'
export const WALLET_DEPOSIT_API = '/wallet/deposit'
export const WALLET_WITHDRAW_API = '/wallet/withdraw'
export const WALLET_CONFIRM_API = '/wallet/confirm'
export const WALLET_REJECT_API = '/wallet/reject'

// financial report (финансовый отчёт)
export const FINANCIAL_SUMMARY_API = '/financial/summary'
export const FINANCIAL_LIST_API = '/financial/list'

// shop tariffs (магазин экспресс)
export const TARIFF_LIST_API = '/tariff/list'
export const TARIFF_SHOW_API = '/tariff/show'
export const TARIFF_STORE_API = '/tariff/store'
export const TARIFF_UPDATE_API = '/tariff/update'
export const TARIFF_DELETE_API = '/tariff/delete'
export const TARIFF_ASSIGN_API = '/tariff/assign'

// tariff purchase history (история покупок)
export const PURCHASE_LIST_API = '/purchase/list'
export const PURCHASE_SHOW_API = '/purchase/show'

// goods
export const GOODS_LIST_API = '/product/list'
export const GOODS_SHOW_API = '/product/show'
export const GOODS_CREATE_API = '/product/store'
export const GOODS_UPDATE_API = '/product/update'
export const GOODS_DELETE_API = '/product/delete'
export const GOODS_BULK_STATUS_API = '/product/bulk-status'
export const GOODS_BULK_DELETE_API = '/product/bulk-delete'
export const GOODS_BULK_FLAGS_API = '/product/bulk-flags'

// warehouse (product catalog before shop)
export const WAREHOUSE_LIST_API = '/warehouse/list'
export const WAREHOUSE_PUBLISH_API = '/warehouse/publish'
export const WAREHOUSE_BULK_DELETE_API = '/warehouse/bulk-delete'

export const PRODUCT_IMPORT_START_API = '/product/import/start'
export const PRODUCT_IMPORT_CHUNK_API = '/product/import/chunk'
export const PRODUCT_IMPORT_FINISH_API = '/product/import/finish'
export const PRODUCT_IMPORT_DRY_RUN_API = '/product/import/dry-run'
export const PRODUCT_IMPORT_SHOW_API = '/product/import'
export const PRODUCT_IMPORT_ERRORS_API = '/product/import'
export const CUSTOMER_ORDERS_LIST_API = '/order/list'
export const CUSTOMER_ORDERS_SHOW_API = '/order/show'
export const CUSTOMER_ORDERS_CREATE_API = '/order/store'
export const CUSTOMER_ORDERS_UPDATE_API = '/order/update'
export const CUSTOMER_ORDERS_DELETE_API = '/order/delete'

// cars
export const CAR_LIST_API = '/car/list'
export const CAR_SHOW_API = '/car/show'
export const CAR_CREATE_API = '/car/store'
export const CAR_UPDATE_API = '/car/update'
export const CAR_DELETE_API = '/car/delete'

// discount
export const DISCOUNT_LIST_API = '/discount/list'
export const DISCOUNT_SHOW_API = '/discount/show'
export const DISCOUNT_CREATE_API = '/discount/store'
export const DISCOUNT_UPDATE_API = '/discount/update'
export const DISCOUNT_DELETE_API = '/discount/delete'

// SMS
export const SMS_LIST_API = '/sms/list'
export const SMS_UPDATE_API = '/sms/update'

// information pages (future PHP API contract)
export const CONTENT_PAGE_LIST_API = '/content-page/list'
export const CONTENT_PAGE_SHOW_API = '/content-page/show'
export const CONTENT_PAGE_CREATE_API = '/content-page/store'
export const CONTENT_PAGE_UPDATE_API = '/content-page/update'
export const CONTENT_PAGE_DELETE_API = '/content-page/delete'
export const CONTENT_PAGE_PUBLIC_API = '/content-page/public'
