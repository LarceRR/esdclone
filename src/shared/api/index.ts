import { authApi } from '@/shared/api/list/authApi'
import { workOrdersApi } from '@/shared/api/list/workOrdersApi'
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

// auth
export const { useSignInMutation, useLogOutMutation, useInfoUserMutation, useForgotPasswordMutation, useResetPasswordMutation } = authApi

// work orders
export const {
    useCreateWorkOrderMutation,
    useExportCsvWorkOrderMutation,
    useGetWorkOrderMutation,
    useDeleteWorkOrderMutation,
    useGetListWorkOrdersQuery,
    useUpdateWorkOrderMutation,
} = workOrdersApi

// goods
export const {
    useCreateGoodsMutation,
    useGetGoodsMutation,
    useGetListGoodsQuery,
    useLazyGetListGoodsQuery,
    useDeleteGoodsMutation,
    useUpdateGoodsMutation,
    useBulkUpdateProductStatusMutation,
    useBulkDeleteProductsMutation,
    useBulkUpdateProductFlagsMutation,
} = goodsApi

// boxes
export const {
    useGetAllBoxesQuery,
    useLazyGetAllBoxesQuery,
    useCreateBoxMutation,
    useGetBoxQuery,
    useLazyGetBoxQuery,
    useUpdateBoxMutation,
    useRemoveBoxMutation,
} = boxApi

// categories
export const {
    useGetCategoriesListQuery,
    useCreateCategoryMutation,
    useLazyGetCategoriesListQuery,
    useRemoveCategoryMutation,
    useUpdateCategoryMutation,
    useLazyGetCategoryQuery,
    useGetCategoryQuery,
} = categoriesApi

// users
export const {
    useGetUserQuery,
    useLazyGetUserQuery,
    useGetUsersListQuery,
    useLazyGetUsersListQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useRemoveUserMutation,
} = usersApi

// groups
export const {
    useGetGroupsQuery,
    useLazyGetGroupsQuery,
    useCreateGroupMutation,
    useRemoveGroupMutation,
    useGetGroupQuery,
    useLazyGetGroupQuery,
    useUpdateGroupMutation,
} = groupsApi

// sales
export const {
    useCreateOfferMutation,
    useGetOfferMutation,
    useRemoveOfferMutation,
    useUpdateOfferMutation,
    useGetOfferListQuery,
    useLazyGetOfferListQuery,
} = salesApi

// customer orders
export const {
    useCreateCustomerOrderMutation,
    useGetCustomerOrderMutation,
    useGetCustomerOrdersListQuery,
    useRemoveCustomerOrderMutation,
    useUpdateCustomerOrderMutation,
} = customerOrdersApi

// car
export const { useCreateCarMutation, useGetCarListQuery, useGetCarMutation, useUpdateCarMutation, useRemoveCarMutation } = carApi

// discount
export const {
    useCreateDiscountMutation,
    useLazyGetDiscountListQuery,
    useGetDiscountMutation,
    useGetDiscountListQuery,
    useUpdateDiscountMutation,
    useRemoveDiscountMutation,
} = discountApi

// discount
export const { useGetSMSListQuery, useUpdateSMSMutation } = smsApi

// information pages
export const {
    useGetInformationPagesListQuery,
    useLazyGetInformationPagesListQuery,
    useGetInformationPageQuery,
    useLazyGetInformationPageQuery,
    useCreateInformationPageMutation,
    useUpdateInformationPageMutation,
    useRemoveInformationPageMutation,
    useGetPublicContentPageQuery,
} = informationPagesApi

// shop orders
export const {
    useGetShopOrdersListQuery,
    useLazyGetShopOrdersListQuery,
    useGetShopOrderMutation,
    useCreateShopOrderMutation,
    useUpdateShopOrderMutation,
    useDeleteShopOrderMutation,
    useBulkPurchaseShopOrdersMutation,
} = shopOrdersApi

// refund requests
export const {
    useGetRefundRequestsListQuery,
    useLazyGetRefundRequestsListQuery,
    useGetRefundRequestMutation,
    useCreateRefundRequestMutation,
    useUpdateRefundRequestMutation,
    useDeleteRefundRequestMutation,
    useBulkProcessRefundRequestsMutation,
} = refundRequestApi

// warehouse
export const { useGetWarehouseListQuery, usePublishWarehouseProductsMutation, useBulkDeleteWarehouseProductsMutation } = warehouseApi

// fund records
export const {
    useGetFundRecordsListQuery,
    useLazyGetFundRecordsListQuery,
    useGetFundRecordMutation,
    useCreateFundRecordMutation,
    useReverseFundRecordMutation,
} = fundRecordApi

// wallet
export const {
    useGetWalletSummaryQuery,
    useGetWalletAddressesQuery,
    useGetWalletTransactionsListQuery,
    useLazyGetWalletTransactionsListQuery,
    useGetWalletTransactionMutation,
    useCreateWalletDepositMutation,
    useCreateWalletWithdrawMutation,
    useConfirmWalletTransactionMutation,
    useRejectWalletTransactionMutation,
} = walletApi

// financial report
export const { useGetFinancialSummaryQuery, useGetFinancialReportListQuery } = financialReportApi

// tariffs
export const {
    useGetTariffsListQuery,
    useCreateTariffMutation,
    useUpdateTariffMutation,
    useDeleteTariffMutation,
    useAssignTariffMutation,
} = tariffApi

// purchase history
export const { useGetPurchaseHistoryListQuery } = purchaseHistoryApi
