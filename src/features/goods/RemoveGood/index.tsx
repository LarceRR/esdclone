import { RemoveButtonTable } from '@/shared/ui/RemoveButtonTable'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/shared/lib/hooks/toast'
import { useDeleteGoodsMutation } from '@/shared/api'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { EGroupNaming } from '@/shared/api/types'

export const RemoveGood = ({ id }: { id: number }) => {
    const [toggleConfirmModal, setToggleConfirmModal] = useState<boolean>(false)
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const [onRemove, { isLoading }] = useDeleteGoodsMutation()

    const onCloseConfirmModal = useCallback(() => setToggleConfirmModal(false), [])
    const onOpenConfirmModal = useCallback(() => setToggleConfirmModal(true), [])

    const [isDisabledRemove, setIsDisabledRemove] = useState<boolean>(false)
    const { userData } = useAuth()

    useEffect(() => {
        if (userData) {
            if (userData?.role === 'superadmin') return
            setIsDisabledRemove(userData.rules[EGroupNaming.Product]?.DeleteController || true)
        }
    }, [])

    const handleRemoveUser = async () => {
        try {
            onRemove(id)
                .unwrap()
                .then((res) => {
                    if (res.code === 400) {
                        TOAST_ERROR(res.message)
                        return
                    }

                    TOAST_SUCCESS(`Вы успешно удалили продукт №${id}`)
                })
                .catch((err) => {
                    console.error(err)
                    TOAST_ERROR('Ошибка удаления. Попробуйте позже')
                })
                .finally(() => {
                    onCloseConfirmModal()
                })
        } catch (err) {
            console.error(err)
            TOAST_ERROR('Ошибка удаления продукта')
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
