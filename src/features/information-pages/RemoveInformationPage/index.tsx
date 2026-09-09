import { useCallback, useState } from 'react'
import { useRemoveInformationPageMutation } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { RemoveButtonTable } from '@/shared/ui/RemoveButtonTable'

interface RemoveInformationPageProps {
    id: number
    title: string
}

export const RemoveInformationPage = ({ id, title }: RemoveInformationPageProps) => {
    const [toggleConfirmModal, setToggleConfirmModal] = useState(false)
    const [removePage, { isLoading }] = useRemoveInformationPageMutation()
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()

    const onCloseConfirmModal = useCallback(() => setToggleConfirmModal(false), [])
    const onOpenConfirmModal = useCallback(() => setToggleConfirmModal(true), [])

    const handleRemove = () => {
        removePage(id)
            .unwrap()
            .then(() => {
                TOAST_SUCCESS(`Страница «${title}» удалена`)
                onCloseConfirmModal()
            })
            .catch((err) => {
                console.error(err)
                TOAST_ERROR(err?.data?.message || 'Ошибка удаления страницы')
            })
    }

    return (
        <RemoveButtonTable
            onClose={onCloseConfirmModal}
            onOpen={onOpenConfirmModal}
            handleRemove={handleRemove}
            toggle={toggleConfirmModal}
            isLoading={isLoading}
        />
    )
}
