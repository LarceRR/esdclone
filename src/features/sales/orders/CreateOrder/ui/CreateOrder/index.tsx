import { useCallback, useState } from 'react'
import { Button } from '@mui/material'
import { ModalSample } from '@/shared/ui/ModalSample'
import { Form } from '../Form'

export const CreateOrder = () => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)

    const onOpenCreateSaleModal = useCallback(() => setToggleModal(true), [])
    const onCloseCreateSaleModal = useCallback(() => setToggleModal(false), [])

    return (
        <>
            <Button
                size={'medium'}
                variant={'contained'}
                onClick={onOpenCreateSaleModal}
            >
                Добавить заказ
            </Button>
            <ModalSample
                title={'Добавление нового заказа'}
                onCloseModal={onCloseCreateSaleModal}
                toggleModal={toggleModal}
            >
                <Form onClose={onCloseCreateSaleModal} />
            </ModalSample>
        </>
    )
}
