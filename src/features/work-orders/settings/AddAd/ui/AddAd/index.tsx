import styles from './AddAd.module.css'
import { useState } from 'react'
import { Button } from '@mui/material'
import { Form } from '../Form'
import { ModalSample } from '@/shared/ui/ModalSample'

export const AddAd = () => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const onVisibleModal = () => setToggleModal(true)
    const onHideModal = () => setToggleModal(false)
    return (
        <div className={styles.AddAd}>
            <Button
                size={'medium'}
                variant={'contained'}
                onClick={onVisibleModal}
            >
                Добавить источник
            </Button>
            <ModalSample
                toggleModal={toggleModal}
                onCloseModal={onHideModal}
                title={'Добавление источника'}
            >
                <Form />
            </ModalSample>
        </div>
    )
}
