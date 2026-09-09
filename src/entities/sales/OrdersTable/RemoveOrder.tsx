import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/shared/lib/hooks/toast'
import { useRemoveCustomerOrderMutation } from '@/shared/api'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { EGroupNaming } from '@/shared/api/types'
import { RemoveButtonTable } from '@/shared/ui/RemoveButtonTable'
import { useNavigate } from 'react-router-dom'
import { ELinks } from '@/shared/constants/appLinks.ts'

export const RemoveOrder = ({ id, handleCloseList }: { id: number; handleCloseList: () => void }) => {
    const [toggleConfirmModal, setToggleConfirmModal] = useState<boolean>(false)
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const [onRemove, { isLoading }] = useRemoveCustomerOrderMutation()
    const navigate = useNavigate()

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
                    navigate(ELinks.DASHBOARD)
                    window.localStorage.setItem('isDeleted', 'true')
                    TOAST_SUCCESS(`Вы успешно удалили заказ №${id}`)
                })
                .catch((err) => {
                    console.error(err)
                    TOAST_ERROR('Ошибка удаления. Попробуйте позже')
                })
                .finally(() => {
                    onCloseConfirmModal()
                    handleCloseList()
                })
        } catch (err) {
            console.error(err)
            TOAST_ERROR('Ошибка удаления заказа')
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
            isIcon={{ active: true, text: 'Удалить заказ' }}
        />
    )
}
