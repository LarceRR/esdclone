import { useCallback, useState } from 'react'
import { RemoveButtonTable } from '@/shared/ui/RemoveButtonTable'

interface RemoveProductProps {
    handleRemoveProduct: () => void
    handleSoftDelete: () => void
}

export const RemoveProduct = ({ handleRemoveProduct, handleSoftDelete }: RemoveProductProps) => {
    const [toggleConfirmModal, setToggleConfirmModal] = useState(false)

    const onOpenConfirmModal = useCallback(() => setToggleConfirmModal(true), [])
    const onCloseConfirmModal = useCallback(() => {
        // при закрытии попапа (отмена) — выделяем
        setToggleConfirmModal(false)
        handleSoftDelete()
    }, [handleSoftDelete])
    const onConfirmHardDelete = useCallback(() => {
        // удаляем
        handleRemoveProduct()
        setToggleConfirmModal(false)
    }, [handleRemoveProduct])

    return (
        <RemoveButtonTable
            onOpen={onOpenConfirmModal}
            onClose={onCloseConfirmModal}
            handleRemove={onConfirmHardDelete}
            toggle={toggleConfirmModal}
            isLoading={false}
        />
    )
}
