import { EditButtonTable } from '@/shared/ui/EditButtonTable'
import { useCallback, useEffect, useState } from 'react'
import { Form } from './form'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { EGroupNaming } from '@/shared/api/types'

export const ChangeGoods = ({ id }: { id: number }) => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const onOpenModal = useCallback(() => setToggleModal(true), [])
    const onCloseModal = useCallback(() => setToggleModal(false), [])

    const [isDisabledUpdate, setIsDisabledUpdate] = useState<boolean>(false)
    const { userData } = useAuth()

    useEffect(() => {
        if (userData) {
            if (userData?.role === 'superadmin') return
            setIsDisabledUpdate(userData.rules[EGroupNaming.Product]?.UpdateController || true)
        }
    }, [])

    return (
        <EditButtonTable
            disabled={isDisabledUpdate}
            onClose={onCloseModal}
            onOpen={onOpenModal}
            toggle={toggleModal}
            id={id}
            title={'Редактирование товара'}
        >
            <Form
                onClose={onCloseModal}
                userId={id}
            />
        </EditButtonTable>
    )
}
