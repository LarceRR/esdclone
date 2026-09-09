import { IGroupRules } from '@/shared/api/types'

export interface ILogin {
    access_token: string
    expires_in: number
    token_type: string
}
export interface IUserData {
    created_at: Date
    email: string
    email_verified_at: Date
    id: number
    name: string
    phone: string
    role: null | string
    rules: IGroupRules
    updated_at: Date
}
