import { useState } from 'react'
import styles from './AddArticle.module.css'
import { Button, Modal } from '@mui/material'
import { Form } from '../Form'

export const AddArticle = () => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const onVisibleModal = () => setToggleModal(true)
    const onHideModal = () => setToggleModal(false)
    return (
        <div className={styles.AddArticle}>
            <Button
                size={'medium'}
                variant={'contained'}
                onClick={onVisibleModal}
            >
                Добавить статью
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
