import { useState } from 'react'
import styles from './AddHardWork.module.css'
import { Button } from '@mui/material'
import { Form } from '../Form'
import { ModalSample } from '@/shared/ui/ModalSample'

export const AddHardWork = () => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const onVisibleModal = () => setToggleModal(true)
    const onHideModal = () => setToggleModal(false)
    return (
        <div className={styles.AddHardWork}>
            <Button
                size={'medium'}
                variant={'contained'}
                onClick={onVisibleModal}
            >
                Добавить сложность работ
            </Button>
            <ModalSample
                onCloseModal={onHideModal}
                title={'Добавление сложности работ'}
                toggleModal={toggleModal}
            >
                <Form />
            </ModalSample>
        </div>
    )
}
