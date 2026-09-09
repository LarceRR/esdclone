export interface IShopSettingsShop {
    id: number
    name: string
    contact_person: string | null
    phone: string | null
    profile: string | null
    welcome_message: string | null
    social_facebook: string | null
    social_twitter: string | null
    social_google: string | null
    social_youtube: string | null
    social_instagram: string | null
    logo_url: string | null
    banner_1_url: string | null
    banner_2_url: string | null
    banner_3_url: string | null
}

export interface IShopSettingsUser {
    id: number
    name: string
    surname: string
    phone: string | null
    email: string
    email_verified_at: string | null
    avatar_url: string | null
}

export interface IShopSettingsData {
    shop: IShopSettingsShop
    user: IShopSettingsUser
    contract_url: string
}

export interface IShopSettingsUpdatePayload {
    name?: string
    contact_person?: string | null
    phone?: string | null
    profile?: string | null
    welcome_message?: string | null
    social_facebook?: string | null
    social_twitter?: string | null
    social_google?: string | null
    social_youtube?: string | null
    social_instagram?: string | null
}

export type ShopImageType = 'logo' | 'banner_1' | 'banner_2' | 'banner_3'

export interface IApiResponse<T> {
    code: number
    message: string
    data: T
}
