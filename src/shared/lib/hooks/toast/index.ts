import { useCallback } from 'react'
import toast, { ToastOptions } from 'react-hot-toast'

const configToast: ToastOptions = {
    duration: 1500,
    position: 'bottom-right',
}

export const useToast = () => {
    const TOAST_SUCCESS = useCallback(
        (message: string) => toast.success(message || 'Успешно', configToast),
        [],
    )
    const TOAST_ERROR = useCallback(
        (message: string) => toast.error(message || 'Ошибка', configToast),
        [],
    )

    return {
        TOAST_ERROR,
        TOAST_SUCCESS,
    }
}
