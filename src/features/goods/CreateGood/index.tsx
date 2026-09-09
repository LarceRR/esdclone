import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { EGroupNaming } from '@/shared/api/types'
import { CreatePlusTrigger } from '@/shared/ui/CreatePlusTrigger'
import { ModalSample } from '@/shared/ui/ModalSample'
import { Form } from './form'

type CreateGoodProps = {
    className?: string
    iconOnlyMaxWidth?: number
    fullWidth?: boolean
}

export const CreateGood = ({ className, iconOnlyMaxWidth, fullWidth }: CreateGoodProps = {}) => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)

    const onOpenCreateUserModal = useCallback(() => setToggleModal(true), [])
    const onCloseCreateUserModal = useCallback(() => setToggleModal(false), [])

    const [isDisabledCreate, setIsDisabledCreate] = useState<boolean>(false)
    const { userData } = useAuth()

    useEffect(() => {
        if (userData) {
            if (userData?.role === 'superadmin') return
            setIsDisabledCreate(userData.rules[EGroupNaming.Product]?.StoreController || true)
        }
    }, [])
    return (
        <div className={className}>
            <CreatePlusTrigger
                label='Создать товар'
                onClick={onOpenCreateUserModal}
                disabled={isDisabledCreate}
                iconOnlyMaxWidth={iconOnlyMaxWidth}
                fullWidth={fullWidth}
            />
            <ModalSample
                title={'Создание нового товара'}
                toggleModal={toggleModal}
                onCloseModal={onCloseCreateUserModal}
            >
                <Form onClose={onCloseCreateUserModal} />
            </ModalSample>
        </div>
    )
}
