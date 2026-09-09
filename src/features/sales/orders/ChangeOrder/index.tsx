import { EditButtonTable } from '@/shared/ui/EditButtonTable'
import { useCallback, useState } from 'react'
import { Form } from './Form'

export const ChangeOrder = ({ id }: { id: number }) => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const onOpenModal = useCallback(() => setToggleModal(true), [])
    const onCloseModal = useCallback(() => setToggleModal(false), [])

    return (
        <EditButtonTable
            onClose={onCloseModal}
            onOpen={onOpenModal}
            toggle={toggleModal}
            id={id}
            title={'Редактирование заказа'}
        >
            <Form
                id={id}
                onCloseModal={onCloseModal}
            />
        </EditButtonTable>
    )
}
