import {
    IInformationPage,
    IInformationPageCreate,
    IInformationPageListData,
    IInformationPageUpdate,
} from '@/shared/api/types'

export interface IApiResponse<T> {
    code: number
    message: string
    data: T
}

export interface IPublicContentPageParams {
    shopSlug: string
    slug: string
}

export type { IInformationPage, IInformationPageCreate, IInformationPageListData, IInformationPageUpdate }
