import styles from './AddCar.module.css'
import { Button } from '@mui/material'
import { useState } from 'react'
import { Form } from '../Form'
import { ModalSample } from '@/shared/ui/ModalSample'

export const AddCar = () => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const onVisibleModal = () => setToggleModal(true)
    const onHideModal = () => setToggleModal(false)
    return (
        <div className={styles.AddCar}>
            <Button
                size={'medium'}
                variant={'contained'}
                onClick={onVisibleModal}
            >
                Добавить автомобиль
            </Button>
            <ModalSample
                toggleModal={toggleModal}
                onCloseModal={onHideModal}
                title={'Добавление автомобиля'}
            >
                <Form onHide={onHideModal} />
            </ModalSample>
        </div>
    )
}
