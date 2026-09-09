import { createApi } from '@reduxjs/toolkit/query/react'
import {
    CONTENT_PAGE_CREATE_API,
    CONTENT_PAGE_DELETE_API,
    CONTENT_PAGE_LIST_API,
    CONTENT_PAGE_PUBLIC_API,
    CONTENT_PAGE_SHOW_API,
    CONTENT_PAGE_UPDATE_API,
} from '@/shared/constants/apiLinks.ts'
import { baseQueryWithReauth } from '@/shared/api/helpers/reauth.ts'
import {
    IApiResponse,
    IInformationPage,
    IInformationPageCreate,
    IInformationPageListData,
    IInformationPageUpdate,
    IPublicContentPageParams,
} from './types.ts'

const assertApiSuccess = <T>(response: IApiResponse<T>): IApiResponse<T> => {
    if (response.code !== 200) {
        throw Object.assign(new Error(response.message || 'Ошибка API'), { data: response })
    }

    return response
}

export const informationPagesApi = createApi({
    reducerPath: 'informationPagesApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['InformationPages'],
    endpoints: (build) => ({
        getInformationPagesList: build.query<IApiResponse<IInformationPageListData>, void>({
            query: () => ({
                url: CONTENT_PAGE_LIST_API,
                method: 'GET',
            }),
            transformResponse: assertApiSuccess,
            providesTags: ['InformationPages'],
        }),
        getInformationPage: build.query<IApiResponse<IInformationPage>, number>({
            query: (id) => ({
                url: CONTENT_PAGE_SHOW_API,
                method: 'POST',
                body: { id },
            }),
            transformResponse: assertApiSuccess,
            providesTags: ['InformationPages'],
        }),
        createInformationPage: build.mutation<IApiResponse<IInformationPage>, IInformationPageCreate>({
            query: (body) => ({
                url: CONTENT_PAGE_CREATE_API,
                method: 'POST',
                body,
            }),
            transformResponse: assertApiSuccess,
            invalidatesTags: ['InformationPages'],
        }),
        updateInformationPage: build.mutation<IApiResponse<IInformationPage>, IInformationPageUpdate>({
            query: (body) => ({
                url: CONTENT_PAGE_UPDATE_API,
                method: 'POST',
                body,
            }),
            transformResponse: assertApiSuccess,
            invalidatesTags: ['InformationPages'],
        }),
        removeInformationPage: build.mutation<IApiResponse<{ id: number }>, number>({
            query: (id) => ({
                url: CONTENT_PAGE_DELETE_API,
                method: 'POST',
                body: { id },
            }),
            transformResponse: assertApiSuccess,
            invalidatesTags: ['InformationPages'],
        }),
        getPublicContentPage: build.query<IApiResponse<IInformationPage>, IPublicContentPageParams>({
            query: ({ shopSlug, slug }) => ({
                url: `${CONTENT_PAGE_PUBLIC_API}/${shopSlug}/${slug}`,
                method: 'GET',
            }),
            transformResponse: assertApiSuccess,
        }),
    }),
})

export const {
    useGetInformationPagesListQuery,
    useGetInformationPageQuery,
    useCreateInformationPageMutation,
    useUpdateInformationPageMutation,
    useRemoveInformationPageMutation,
    useGetPublicContentPageQuery,
} = informationPagesApi
