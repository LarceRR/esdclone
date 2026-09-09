import { useCallback, useState } from 'react'
import { useToast } from '@/shared/lib/hooks/toast'
import { useRemoveOfferMutation } from '@/shared/api'
import { RemoveButtonTable } from '@/shared/ui/RemoveButtonTable'

export const RemoveSale: React.FC<{ id: number }> = ({ id }: { id: number }) => {
    const [toggleConfirmModal, setToggleConfirmModal] = useState<boolean>(false)
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const [onRemove, { isLoading }] = useRemoveOfferMutation()

    const onCloseConfirmModal = useCallback(() => setToggleConfirmModal(false), [])
    const onOpenConfirmModal = useCallback(() => setToggleConfirmModal(true), [])

    const handleRemoveSale = async () => {
        try {
            onRemove(id)
                .unwrap()
                .then((res) => {
                    TOAST_SUCCESS(`Вы успешно удалили заявку №${id}`)
                    console.log(res)
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
            TOAST_ERROR('Ошибка удаления заявки')
        }
    }

    return (
        <RemoveButtonTable
            onClose={onCloseConfirmModal}
            onOpen={onOpenConfirmModal}
            handleRemove={handleRemoveSale}
            toggle={toggleConfirmModal}
            isLoading={isLoading}
        />
    )
}
