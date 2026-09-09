import { IUserData } from '@/shared/types/auth'

export interface IAuth {
    isAuth: boolean
    userData: IUserData | null
    userRole: string | null
    token: string | null
    setUser: (data: IUserData, token: string) => void
    setToken: (token: string) => void
    removeUser: () => void
}
