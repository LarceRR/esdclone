import { useCallback, useState } from 'react'
import styles from './CreateOrder.module.css'
import { Button, Modal } from '@mui/material'
import { Form } from '../Form'

export const CreateOrder = () => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)

    const onOpenCreateOrderModal = useCallback(() => setToggleModal(true), [])
    const onCloseCreateOrderModal = useCallback(() => setToggleModal(false), [])

    return (
        <div className={styles.CreateSale}>
            <Button
                size={'medium'}
                variant={'contained'}
                onClick={onOpenCreateOrderModal}
            >
                Добавить новый заказ
            </Button>
            <Modal
                onClose={onCloseCreateOrderModal}
                open={toggleModal}
            >
                <div className={styles.modal}>
                    <Form onClose={onCloseCreateOrderModal} />
                </div>
            </Modal>
        </div>
    )
}
