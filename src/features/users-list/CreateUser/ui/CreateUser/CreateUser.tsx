import { memo, useCallback, useEffect, useState } from 'react'
import styles from './CreateUser.module.css'
import { CreatePlusTrigger } from '@/shared/ui/CreatePlusTrigger'
import { Form } from '../Form/Form.tsx'
import { ModalSample } from '@/shared/ui/ModalSample'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { EGroupNaming } from '@/shared/api/types'

export const CreateUser = memo(() => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)

    const onOpenCreateUserModal = useCallback(() => setToggleModal(true), [])
    const onCloseCreateUserModal = useCallback(() => setToggleModal(false), [])

    const [isDisabledCreate, setIsDisabledCreate] = useState<boolean>(false)
    const { userData } = useAuth()

    useEffect(() => {
        if (userData) {
            if (userData?.role === 'superadmin') return
            setIsDisabledCreate(userData.rules[EGroupNaming.User]?.StoreController || true)
        }
    }, [])

    return (
        <div className={styles.CreateUser}>
            <CreatePlusTrigger
                label='Создать пользователя'
                onClick={onOpenCreateUserModal}
                disabled={isDisabledCreate}
            />
            <ModalSample
                title={'Создание нового пользователя'}
                toggleModal={toggleModal}
                onCloseModal={onCloseCreateUserModal}
            >
                <Form onClose={onCloseCreateUserModal} />
            </ModalSample>
        </div>
    )
})
