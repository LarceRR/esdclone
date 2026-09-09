import { useAppDispatch, useAppSelector } from '@/shared/store'
import { authActions } from '@/shared/store/slices/authSlice.ts'
import { IAuth } from '@/shared/lib/hooks/useAuth/types.ts'
import { IUserData } from '@/shared/types/auth'
import { persistAccessToken } from '@/shared/lib/auth/authStorage.ts'

export const useAuth = (): IAuth => {
    const dispatch = useAppDispatch()
    const { userToken, data, role } = useAppSelector((state) => state.auth)
    const isAuth = !!userToken

    const setToken = (token: string) => {
        persistAccessToken(token)
        dispatch(authActions.setToken(token))
    }
    const setUser = (data: IUserData, token: string) => {
        persistAccessToken(token)
        dispatch(authActions.setUser(data))
        dispatch(authActions.setToken(token))
    }
    const removeUser = () => {
        persistAccessToken(null)
        dispatch(authActions.setUser(null))
        dispatch(authActions.setToken(null))
    }
    return {
        isAuth,
        userData: data,
        userRole: role,
        token: userToken,
        setUser,
        setToken,
        removeUser,
    }
}
