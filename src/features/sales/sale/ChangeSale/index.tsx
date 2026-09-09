import { useCallback, useState } from 'react'
import { EditButtonTable } from '@/shared/ui/EditButtonTable'
import { Form } from './Form.tsx'

export const ChangeSale = ({ id }: { id: number }) => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const onOpenModal = useCallback(() => setToggleModal(true), [])
    const onCloseModal = useCallback(() => setToggleModal(false), [])

    return (
        <EditButtonTable
            onClose={onCloseModal}
            onOpen={onOpenModal}
            toggle={toggleModal}
            id={id}
            title={'Редактирование продажи'}
        >
            <Form
                id={id}
                onClose={onCloseModal}
            />
        </EditButtonTable>
    )
}
