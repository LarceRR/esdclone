import { useState } from 'react'
import styles from './AddStatusWorkOrders.module.css'
import { Button } from '@mui/material'
import { Form } from '../Form'
import { ModalSample } from '@/shared/ui/ModalSample'

export const AddStatusWorkOrders = () => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const onVisibleModal = () => setToggleModal(true)
    const onHideModal = () => setToggleModal(false)
    return (
        <div className={styles.AddStatusWorkOrders}>
            <Button
                size={'medium'}
                variant={'contained'}
                onClick={onVisibleModal}
            >
                Добавить статус заказ-нарядов
            </Button>
            <ModalSample
                toggleModal={toggleModal}
                title={'Добавление статуса'}
                onCloseModal={onHideModal}
            >
                <Form />
            </ModalSample>
        </div>
    )
}
