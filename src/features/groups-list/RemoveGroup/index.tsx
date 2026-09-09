import { RemoveButtonTable } from '@/shared/ui/RemoveButtonTable'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/shared/lib/hooks/toast'
import { useRemoveGroupMutation } from '@/shared/api'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { EGroupNaming } from '@/shared/api/types'

export const RemoveGroup = ({ id }: { id: number }) => {
    const [toggleConfirmModal, setToggleConfirmModal] = useState<boolean>(false)
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const [onRemove, { isLoading }] = useRemoveGroupMutation()

    const onCloseConfirmModal = useCallback(() => setToggleConfirmModal(false), [])
    const onOpenConfirmModal = useCallback(() => setToggleConfirmModal(true), [])

    const [isDisabledRemove, setIsDisabledRemove] = useState<boolean>(false)
    const { userData } = useAuth()

    useEffect(() => {
        if (userData) {
            if (userData?.role === 'superadmin') return
            setIsDisabledRemove(userData.rules[EGroupNaming.Group]?.DeleteController || true)
        }
    }, [])

    const handleRemoveGroup = async () => {
        try {
            onRemove(id)
                .unwrap()
                .then((res) => console.log(res))
                .catch((err) => {
                    console.error(err)
                    TOAST_ERROR('Ошибка удаления. Попробуйте позже')
                })
                .finally(() => {
                    TOAST_SUCCESS(`Вы успешно удалили группу №${id}`)
                    onCloseConfirmModal()
                })
        } catch (err) {
            console.error(err)
            TOAST_ERROR('Ошибка удаления группы')
        }
    }
    return (
        <RemoveButtonTable
            disabled={isDisabledRemove}
            onClose={onCloseConfirmModal}
            onOpen={onOpenConfirmModal}
            handleRemove={handleRemoveGroup}
            toggle={toggleConfirmModal}
            isLoading={isLoading}
        />
    )
}
