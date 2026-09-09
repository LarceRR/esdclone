import { memo, useCallback, useEffect, useState } from 'react'
import styles from './createCategory.module.css'
import { CreatePlusTrigger } from '@/shared/ui/CreatePlusTrigger'
import { Form } from './form/index.tsx'
import { ModalSample } from '@/shared/ui/ModalSample'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { EGroupNaming } from '@/shared/api/types'

export const CreateCategory = memo(() => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)

    const onOpenCreateUserModal = useCallback(() => setToggleModal(true), [])
    const onCloseCreateUserModal = useCallback(() => setToggleModal(false), [])

    const [isDisabledCreate, setIsDisabledCreate] = useState<boolean>(false)
    const { userData } = useAuth()

    useEffect(() => {
        if (userData) {
            if (userData?.role === 'superadmin') return
            setIsDisabledCreate(userData.rules[EGroupNaming.Categories]?.StoreController || true)
        }
    }, [])

    return (
        <div className={styles.CreateUser}>
            <CreatePlusTrigger
                label='Создать категорию'
                onClick={onOpenCreateUserModal}
                disabled={isDisabledCreate}
            />
            <ModalSample
                title={'Создание новой категории'}
                toggleModal={toggleModal}
                onCloseModal={onCloseCreateUserModal}
            >
                <Form onClose={onCloseCreateUserModal} />
            </ModalSample>
        </div>
    )
})
