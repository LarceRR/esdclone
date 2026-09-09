import { EditButtonTable } from '@/shared/ui/EditButtonTable'
import { useCallback, useState } from 'react'
import { Form } from './Form.tsx'

export const ChangeCar = ({ id }: { id: number }) => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const onOpenModal = useCallback(() => setToggleModal(true), [])
    const onCloseModal = useCallback(() => setToggleModal(false), [])

    return (
        <EditButtonTable
            onClose={onCloseModal}
            onOpen={onOpenModal}
            toggle={toggleModal}
            id={id}
            title={'Редактирование автомобиля'}
        >
            <Form
                onClose={onCloseModal}
                id={id}
            />
        </EditButtonTable>
    )
}
