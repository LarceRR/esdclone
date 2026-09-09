import React from 'react'
import { Modal } from '@mui/material'
import styles from './CreateOrder.module.css'
import { Form } from '../Form/Form.tsx'

interface ICreateOrder {
    open: boolean
    onClose: () => void
}

export const CreateOrder: React.FC<ICreateOrder> = ({ open, onClose }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <div className={styles.modal}>
                <Form onClose={onClose} />
            </div>
        </Modal>
    )
}
