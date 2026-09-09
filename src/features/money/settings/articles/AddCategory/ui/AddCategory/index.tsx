import { useState } from 'react'
import styles from './AddCategory.module.css'
import { Button, Modal } from '@mui/material'
import { Form } from '../Form'

export const AddCategory = () => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const onVisibleModal = () => setToggleModal(true)
    const onHideModal = () => setToggleModal(false)
    return (
        <div className={styles.AddCategory}>
            <Button
                size={'medium'}
                variant={'contained'}
                onClick={onVisibleModal}
            >
                Добавить категорию
            </Button>
            <Modal
                onClose={onHideModal}
                open={toggleModal}
            >
                <div className={styles.modal}>
                    <Form onHide={onHideModal} />
                </div>
            </Modal>
        </div>
    )
}
