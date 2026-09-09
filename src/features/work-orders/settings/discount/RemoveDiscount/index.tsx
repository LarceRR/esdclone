import { useCallback, useState } from 'react'
import { useToast } from '@/shared/lib/hooks/toast'
import { useRemoveDiscountMutation } from '@/shared/api'
import { RemoveButtonTable } from '@/shared/ui/RemoveButtonTable'

export const RemoveDiscount = ({ id }: { id: number }) => {
    const [toggleConfirmModal, setToggleConfirmModal] = useState<boolean>(false)
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    // TODO: Поменять
    const [onRemove, { isLoading }] = useRemoveDiscountMutation()

    const onCloseConfirmModal = useCallback(() => setToggleConfirmModal(false), [])
    const onOpenConfirmModal = useCallback(() => setToggleConfirmModal(true), [])

    const handleRemoveDiscount = async () => {
        try {
            onRemove(id)
                .unwrap()
                .then(() => TOAST_SUCCESS(`Вы успешно удалили дисконтную карту №${id}`))
                .catch((err) => {
                    console.error(err)
                    TOAST_ERROR('Ошибка удаления. Попробуйте позже')
                })
                .finally(() => {
                    onCloseConfirmModal()
                })
        } catch (err) {
            console.error(err)
            TOAST_ERROR('Ошибка удаления')
        }
    }
    return (
        <RemoveButtonTable
            onClose={onCloseConfirmModal}
            onOpen={onOpenConfirmModal}
            handleRemove={handleRemoveDiscount}
            toggle={toggleConfirmModal}
            isLoading={isLoading}
        />
    )
}
