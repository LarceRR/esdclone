import { useState } from 'react'
import styles from './AddDiscount.module.css'
import { Button } from '@mui/material'
import { Form } from '../Form'
import { ModalSample } from '@/shared/ui/ModalSample'

export const AddDiscount = () => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const onVisibleModal = () => setToggleModal(true)
    const onHideModal = () => setToggleModal(false)
    return (
        <div className={styles.AddDiscount}>
            <Button
                size={'medium'}
                variant={'contained'}
                onClick={onVisibleModal}
            >
                Добавить дисконтную карту
            </Button>
            <ModalSample
                title={'Добавление дисконтной карты'}
                onCloseModal={onHideModal}
                toggleModal={toggleModal}
            >
                <Form onHide={onHideModal} />
            </ModalSample>
        </div>
    )
}
