import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogOutMutation } from '@/shared/api'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { useToast } from '@/shared/lib/hooks/toast'
import { ELinks } from '@/shared/constants/appLinks.ts'

export function usePerformLogout(redirectTo: string = ELinks.SIGN_IN) {
    const [logout] = useLogOutMutation()
    const { removeUser, token } = useAuth()
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()
    const navigate = useNavigate()

    const finishLogout = useCallback(() => {
        removeUser()
        navigate(redirectTo, { replace: true })
    }, [navigate, redirectTo, removeUser])

    return useCallback(async () => {
        if (!token) {
            finishLogout()
            return
        }
        try {
            await logout(token).unwrap()
            TOAST_SUCCESS('Вы успешно вышли из аккаунта')
            finishLogout()
        } catch {
            TOAST_ERROR('Сервер недоступен, сессия сброшена локально')
            finishLogout()
        }
    }, [finishLogout, logout, token, TOAST_ERROR, TOAST_SUCCESS])
}
