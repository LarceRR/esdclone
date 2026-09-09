import { useState } from 'react'
import styles from '@/features/work-orders/settings/AddAd/ui/AddAd/AddAd.module.css'
import { Button, Modal } from '@mui/material'
import { Form } from '../Form'

export const AddCashbox = () => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const onVisibleModal = () => setToggleModal(true)
    const onHideModal = () => setToggleModal(false)
    return (
        <div className={styles.AddCashbox}>
            <Button
                size={'medium'}
                variant={'contained'}
                onClick={onVisibleModal}
            >
                Добавить кассу
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
