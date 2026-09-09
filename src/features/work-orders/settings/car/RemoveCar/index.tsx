import React, { useCallback, useState } from 'react'
import { useToast } from '@/shared/lib/hooks/toast'
import { useRemoveCarMutation } from '@/shared/api'
import { RemoveButtonTable } from '@/shared/ui/RemoveButtonTable'

export const RemoveCar: React.FC<{ id: number }> = ({ id }) => {
    const [toggleConfirmModal, setToggleConfirmModal] = useState<boolean>(false)
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const [onRemove, { isLoading }] = useRemoveCarMutation()

    const onCloseConfirmModal = useCallback(() => setToggleConfirmModal(false), [])
    const onOpenConfirmModal = useCallback(() => setToggleConfirmModal(true), [])

    const handleRemoveCar = async () => {
        try {
            onRemove(id)
                .unwrap()
                .then(() => TOAST_SUCCESS(`Вы успешно удалили автомобиль №${id}`))
                .catch((err) => {
                    console.error(err)
                    TOAST_ERROR('Ошибка удаления. Попробуйте позже')
                })
                .finally(() => {
                    onCloseConfirmModal()
                })
        } catch (err) {
            console.error(err)
            TOAST_ERROR('Ошибка удаления автомобиля')
        }
    }

    return (
        <RemoveButtonTable
            onClose={onCloseConfirmModal}
            onOpen={onOpenConfirmModal}
            handleRemove={handleRemoveCar}
            toggle={toggleConfirmModal}
            isLoading={isLoading}
        />
    )
}
