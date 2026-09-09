import React, { memo, useEffect, useState } from 'react'
import { CreatePlusTrigger } from '@/shared/ui/CreatePlusTrigger'
import { Form } from '../Form/Form.tsx'
import { ModalSample } from '@/shared/ui/ModalSample'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { EGroupNaming } from '@/shared/api/types'

interface ICreateGroupProps {
    open: boolean
    onClose: () => void
    onOpen: () => void
}

export const CreateGroup: React.FC<ICreateGroupProps> = memo((props: ICreateGroupProps) => {
    const { open, onOpen, onClose } = props
    const [isDisabledCreate, setIsDisabledCreate] = useState<boolean>(false)
    const { userData } = useAuth()

    useEffect(() => {
        if (userData) {
            if (userData?.role === 'superadmin') return
            setIsDisabledCreate(userData.rules[EGroupNaming.Group]?.StoreController || true)
        }
    }, [])

    return (
        <>
            <CreatePlusTrigger
                label='Создать группу'
                disabled={isDisabledCreate}
                onClick={onOpen}
            />
            <ModalSample
                title={'Создание группы'}
                onCloseModal={onClose}
                toggleModal={open}
            >
                <Form onClose={onClose} />
            </ModalSample>
        </>
    )
})
