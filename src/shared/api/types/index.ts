// boxes
export interface IBox {
    id: number
    name: string
    position: number
}
export interface IBoxCreate {
    name: string
    position: number
}
export interface IBoxUpdate {
    name: string
    position: number
}
export interface IBoxListResponse {
    data: IBox[]
}
export interface IBoxUpdateResponse {
    data: IBox
}

// orders
export interface IWorkOrder {
    id: number
    date_start_work: string | Date
    date_end_work: string | Date
    counterparty: string
    cars: string
    sum: number
    payed: number
    status: string
    comments: string
    box_name: string
    box_position: number
    box_id: number
}
export interface IWorkOrderListResponse {
    data: IWorkOrder[]
}
export interface IWorkOrderResponse {
    data: IWorkOrder[]
}
export interface IWorkOrderCreate {
    date_start_work: string | Date
    counterparty: string
    cars: string
    status: string
    box_id: number
    date_end_work?: string | Date
    sum?: number
    payed?: number
    comments?: string
}
export interface IWorkOrderUpdate {
    id: number
    date_start_work?: string | Date
    date_end_work?: string | Date
    counterparty?: string
    cars?: string
    sum?: number
    payed?: number
    status?: string
    comments?: string
    box_id?: number
}

// categories
export interface ICategory {
    id: number
    title: string
    parent_id?: number | null
    /** Товары, привязанные непосредственно к этой категории */
    products_count?: number
}
export interface ICategoryCreate {
    title: string
    parent_id?: number | null
}

// users
export interface IUser {
    id: number
    name: string
    email: string
    phone: string
}
export interface IUserCreate {
    name: string
    surname: string
    email: string
    phone: string
    password: string
    group_id: number
}
export interface IUserUpdate {
    id: number
    surname: string
    name: string
    email: string
    phone: string
    password: string
    group_id: number
}

// groups
export interface IGroup {
    id: number
    name: string
}
export interface IGroupControllers {
    DeleteController?: boolean
    ListController?: boolean
    ShowController?: boolean
    StoreController?: boolean
    UpdateController?: boolean
}
export enum EGroupNaming {
    Group = 'Group',
    Categories = 'Category',
    User = 'User',
    Product = 'Product',
}
export interface IGroupRules {
    // [EGroupNaming.Box]?: IGroupControllers
    [EGroupNaming.Group]?: IGroupControllers
    [EGroupNaming.Categories]?: IGroupControllers
    [EGroupNaming.User]?: IGroupControllers
    [EGroupNaming.Product]?: IGroupControllers
}
export interface IGroupCreate {
    name: string
    rules?: IGroupRules
}
export interface IGroupUpdate {
    id?: number
    name: string
    rules?: IGroupRules
}
export interface IGroupUpdateResponse {
    id: number
    name: string
    rules: IGroupRules
}

// information pages
export enum EInformationPageAccess {
    Public = 'public',
    Authenticated = 'authenticated',
}

export enum EInformationPageStatus {
    Draft = 'draft',
    Published = 'published',
}

export interface IInformationPageSeo {
    metaTitle: string
    metaDescription: string
    ogTitle: string
    ogDescription: string
    noIndex: boolean
}

export interface IInformationPage {
    id: number
    title: string
    slug: string
    shopSlug: string
    url: string
    access: EInformationPageAccess
    status: EInformationPageStatus
    contentJson: string
    contentHtml: string
    seo: IInformationPageSeo
    createdAt: string
    updatedAt: string
}

export interface IInformationPageListData {
    shopSlug: string
    items: IInformationPage[]
}

export interface IInformationPageCreate {
    title: string
    slug: string
    access: EInformationPageAccess
    status: EInformationPageStatus
    contentJson: string
    contentHtml: string
    seo: IInformationPageSeo
}

export interface IInformationPageUpdate extends IInformationPageCreate {
    id: number
}

export interface IInformationPageListResponse {
    data: IInformationPageListData
}

export interface IInformationPageResponse {
    data: IInformationPage
}
