import { RemoveButtonTable } from '@/shared/ui/RemoveButtonTable'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/shared/lib/hooks/toast'
import { useRemoveCategoryMutation } from '@/shared/api'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { EGroupNaming } from '@/shared/api/types'

const getErrorMessage = (err: unknown, fallback: string) => {
    if (typeof err === 'object' && err !== null && 'data' in err) {
        const data = (err as { data?: { message?: string } }).data
        if (data?.message) return data.message
    }

    return fallback
}

export const RemoveCategory = ({ id }: { id: number }) => {
    const [toggleConfirmModal, setToggleConfirmModal] = useState<boolean>(false)
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const [onRemove, { isLoading }] = useRemoveCategoryMutation()

    const onCloseConfirmModal = useCallback(() => setToggleConfirmModal(false), [])
    const onOpenConfirmModal = useCallback(() => setToggleConfirmModal(true), [])

    const [isDisabledRemove, setIsDisabledRemove] = useState<boolean>(false)
    const { userData } = useAuth()

    useEffect(() => {
        if (userData) {
            if (userData?.role === 'superadmin') return
            setIsDisabledRemove(userData.rules[EGroupNaming.Categories]?.DeleteController || true)
        }
    }, [userData])

    const handleRemoveUser = async () => {
        try {
            const response = await onRemove(id).unwrap()
            TOAST_SUCCESS(response.message || `Категория №${id} удалена`)
            onCloseConfirmModal()
        } catch (err) {
            TOAST_ERROR(getErrorMessage(err, 'Ошибка удаления категории'))
        }
    }

    return (
        <RemoveButtonTable
            disabled={isDisabledRemove}
            onClose={onCloseConfirmModal}
            onOpen={onOpenConfirmModal}
            handleRemove={handleRemoveUser}
            toggle={toggleConfirmModal}
            isLoading={isLoading}
        />
    )
}
