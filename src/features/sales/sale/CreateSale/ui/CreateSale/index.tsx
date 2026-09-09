import { useCallback, useState } from 'react'
import styles from './CreateSale.module.css'
import { Button } from '@mui/material'
import { Form } from '../Form'
import { ModalSample } from '@/shared/ui/ModalSample'

export const CreateSale = () => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)

    const onOpenCreateSaleModal = useCallback(() => setToggleModal(true), [])
    const onCloseCreateSaleModal = useCallback(() => setToggleModal(false), [])

    return (
        <div className={styles.CreateSale}>
            <Button
                size={'medium'}
                variant={'contained'}
                onClick={onOpenCreateSaleModal}
            >
                Добавить заявку
            </Button>
            <ModalSample
                title={'Добавление заявки'}
                onCloseModal={onCloseCreateSaleModal}
                toggleModal={toggleModal}
            >
                <Form onClose={onCloseCreateSaleModal} />
            </ModalSample>
        </div>
    )
}
