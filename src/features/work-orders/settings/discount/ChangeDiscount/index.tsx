import { useCallback, useState } from 'react'
import { Form } from './Form.tsx'
import { EditButtonTable } from '@/shared/ui/EditButtonTable'

export const ChangeDiscount = ({ id }: { id: number }) => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const onOpenModal = useCallback(() => setToggleModal(true), [])
    const onCloseModal = useCallback(() => setToggleModal(false), [])

    return (
        <EditButtonTable
            onClose={onCloseModal}
            onOpen={onOpenModal}
            toggle={toggleModal}
            id={id}
            title={'Редактирование дисконтной карты'}
        >
            <Form
                onClose={onCloseModal}
                id={id}
            />
        </EditButtonTable>
    )
}
