import React, { memo, useCallback, useState } from 'react'
import { useToast } from '@/shared/lib/hooks/toast'
import { useRemoveBoxMutation } from '@/shared/api'
import { RemoveButtonTable } from '@/shared/ui/RemoveButtonTable'
interface IRemoveBoxProps {
    id: number
}

export const RemoveBox: React.FC<IRemoveBoxProps> = memo(({ id }: IRemoveBoxProps) => {
    const [toggleConfirmModal, setToggleConfirmModal] = useState<boolean>(false)
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const [onRemove, { isLoading }] = useRemoveBoxMutation()

    const onCloseConfirmModal = useCallback(() => setToggleConfirmModal(false), [])
    const onOpenConfirmModal = useCallback(() => setToggleConfirmModal(true), [])

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
                    TOAST_SUCCESS(`Вы успешно удалили бокс №${id}`)
                    onCloseConfirmModal()
                })
        } catch (err) {
            console.error(err)
            TOAST_ERROR('Ошибка удаления бокса')
        }
    }

    return (
        <RemoveButtonTable
            onClose={onCloseConfirmModal}
            onOpen={onOpenConfirmModal}
            handleRemove={handleRemoveGroup}
            toggle={toggleConfirmModal}
            isLoading={isLoading}
        />
    )
})
