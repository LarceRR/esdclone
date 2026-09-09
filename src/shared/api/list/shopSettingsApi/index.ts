import { createApi } from '@reduxjs/toolkit/query/react'
import {
    SHOP_SETTINGS_API,
    SHOP_SETTINGS_DELETE_IMAGE_API,
    SHOP_SETTINGS_UPDATE_API,
    SHOP_SETTINGS_UPLOAD_API,
    ACCOUNT_AVATAR_API,
    ACCOUNT_EMAIL_SEND_CODE_API,
    ACCOUNT_EMAIL_VERIFY_API,
    ACCOUNT_PHONE_API,
} from '@/shared/constants/apiLinks.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import {
    IApiResponse,
    IShopSettingsData,
    IShopSettingsShop,
    IShopSettingsUpdatePayload,
    IShopSettingsUser,
    ShopImageType,
} from './types.ts'

const assertApiSuccess = <T>(response: IApiResponse<T>): IApiResponse<T> => {
    if (response.code !== 200) {
        throw Object.assign(new Error(response.message || 'Ошибка API'), { data: response })
    }

    return response
}

export const shopSettingsApi = createApi({
    reducerPath: 'shopSettingsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['ShopSettings'],
    endpoints: (build) => ({
        getShopSettings: build.query<IApiResponse<IShopSettingsData>, void>({
            query: () => ({
                url: SHOP_SETTINGS_API,
                method: 'GET',
            }),
            transformResponse: assertApiSuccess,
            providesTags: ['ShopSettings'],
        }),
        updateShopSettings: build.mutation<IApiResponse<IShopSettingsData>, IShopSettingsUpdatePayload>({
            query: (body) => ({
                url: SHOP_SETTINGS_UPDATE_API,
                method: 'POST',
                body,
            }),
            transformResponse: assertApiSuccess,
            invalidatesTags: ['ShopSettings'],
        }),
        uploadShopImage: build.mutation<
            IApiResponse<{ shop: IShopSettingsShop }>,
            { type: ShopImageType; file: File }
        >({
            query: ({ type, file }) => {
                const formData = new FormData()
                formData.append('type', type)
                formData.append('file', file)

                return {
                    url: SHOP_SETTINGS_UPLOAD_API,
                    method: 'POST',
                    body: formData,
                }
            },
            transformResponse: assertApiSuccess,
            invalidatesTags: ['ShopSettings'],
        }),
        deleteShopImage: build.mutation<IApiResponse<{ shop: IShopSettingsShop }>, ShopImageType>({
            query: (type) => ({
                url: SHOP_SETTINGS_DELETE_IMAGE_API,
                method: 'POST',
                body: { type },
            }),
            transformResponse: assertApiSuccess,
            invalidatesTags: ['ShopSettings'],
        }),
        updatePhone: build.mutation<IApiResponse<{ user: IShopSettingsUser }>, { phone: string }>({
            query: (body) => ({
                url: ACCOUNT_PHONE_API,
                method: 'POST',
                body,
            }),
            transformResponse: assertApiSuccess,
            invalidatesTags: ['ShopSettings'],
        }),
        sendEmailCode: build.mutation<
            IApiResponse<{ debug_verification_code?: string }>,
            { email: string }
        >({
            query: (body) => ({
                url: ACCOUNT_EMAIL_SEND_CODE_API,
                method: 'POST',
                body,
            }),
            transformResponse: assertApiSuccess,
        }),
        verifyEmail: build.mutation<IApiResponse<{ user: IShopSettingsUser }>, { email: string; code: string }>({
            query: (body) => ({
                url: ACCOUNT_EMAIL_VERIFY_API,
                method: 'POST',
                body,
            }),
            transformResponse: assertApiSuccess,
            invalidatesTags: ['ShopSettings'],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: response } = await queryFulfilled
                    const updatedUser = response.data?.user
                    if (!updatedUser) return

                    dispatch(
                        shopSettingsApi.util.updateQueryData('getShopSettings', undefined, (draft) => {
                            if (draft.data) {
                                draft.data.user = updatedUser
                            }
                        }),
                    )
                } catch {
                    // refetch via invalidatesTags on success path
                }
            },
        }),
        uploadAvatar: build.mutation<IApiResponse<{ user: IShopSettingsUser }>, File>({
            query: (file) => {
                const formData = new FormData()
                formData.append('file', file)

                return {
                    url: ACCOUNT_AVATAR_API,
                    method: 'POST',
                    body: formData,
                }
            },
            transformResponse: assertApiSuccess,
            invalidatesTags: ['ShopSettings'],
        }),
    }),
})

export const {
    useGetShopSettingsQuery,
    useUpdateShopSettingsMutation,
    useUploadShopImageMutation,
    useDeleteShopImageMutation,
    useUpdatePhoneMutation,
    useSendEmailCodeMutation,
    useVerifyEmailMutation,
    useUploadAvatarMutation,
} = shopSettingsApi
