import { useCallback, useState } from 'react'
import { useToast } from '@/shared/lib/hooks/toast'
import { useRemoveCustomerOrderMutation } from '@/shared/api'
import { RemoveButtonTable } from '@/shared/ui/RemoveButtonTable'

export const RemoveOrder: React.FC<{ id: number }> = ({ id }: { id: number }) => {
    const [toggleConfirmModal, setToggleConfirmModal] = useState<boolean>(false)
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const [onRemove, { isLoading }] = useRemoveCustomerOrderMutation()

    const onCloseConfirmModal = useCallback(() => setToggleConfirmModal(false), [])
    const onOpenConfirmModal = useCallback(() => setToggleConfirmModal(true), [])

    const handleRemoveCustomerOrder = async () => {
        try {
            onRemove(id)
                .unwrap()
                .then((res) => console.log(res))
                .catch((err) => {
                    console.error(err)
                    TOAST_ERROR('Ошибка удаления. Попробуйте позже')
                })
                .finally(() => {
                    TOAST_SUCCESS(`Вы успешно удалили заказ №${id}`)
                    onCloseConfirmModal()
                })
        } catch (err) {
            console.error(err)
            TOAST_ERROR('Ошибка удаления группы')
        }
    }

    return (
        <RemoveButtonTable
            onClose={onCloseConfirmModal}
            onOpen={onOpenConfirmModal}
            handleRemove={handleRemoveCustomerOrder}
            toggle={toggleConfirmModal}
            isLoading={isLoading}
        />
    )
}
