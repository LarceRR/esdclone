import { useCallback, useEffect, useState } from 'react'
import { EditButtonTable } from '@/shared/ui/EditButtonTable'
import { Form } from './ui/Form/Form.tsx'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { EGroupNaming } from '@/shared/api/types'

export const ChangeGroup = ({ id }: { id: number }) => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const onOpenModal = useCallback(() => setToggleModal(true), [])
    const onCloseModal = useCallback(() => setToggleModal(false), [])
    const [isDisabledEdit, setIsDisabledEdit] = useState<boolean>(false)
    const { userData } = useAuth()

    useEffect(() => {
        if (userData) {
            if (userData?.role === 'superadmin') return
            setIsDisabledEdit(userData.rules[EGroupNaming.Group]?.UpdateController || true)
        }
    }, [])

    return (
        <EditButtonTable
            disabled={isDisabledEdit}
            onClose={onCloseModal}
            onOpen={onOpenModal}
            toggle={toggleModal}
            id={id}
            title={'Редактирование группы'}
        >
            <Form
                id={id}
                onClose={onCloseModal}
            />
        </EditButtonTable>
    )
}
