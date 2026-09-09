import React, { useCallback, useState } from 'react'
import { IconButton, Modal } from '@mui/material'
import styles from './ChangeOrder.module.css'
import { Form } from '../Form/Form.tsx'
import EditIcon from '@public/icons/edit-icon.svg'

interface IChangeOrder {
    open: boolean
    onClose?: () => void
    orderId?: number
    module: 'calendar' | 'table'
}

export const ChangeOrder: React.FC<IChangeOrder> = (props) => {
    const { open = false, onClose, orderId, module } = props
    const [toggleModal, setToggleModal] = useState<boolean>(false)

    // table
    const onOpenToggleModal = useCallback(() => setToggleModal(true), [])
    const onCloseToggleModal = useCallback(() => setToggleModal(false), [])

    return (
        <>
            {module === 'table' && (
                <IconButton
                    size={'large'}
                    onClick={onOpenToggleModal}
                >
                    <EditIcon />
                </IconButton>
            )}
            <Modal
                open={module === 'table' ? toggleModal : open}
                onClose={module === 'table' ? onCloseToggleModal : onClose}
                sx={{
                    outline: 'none',
                }}
            >
                <div className={styles.modal}>
                    <Form
                        orderId={orderId}
                        onClose={onCloseToggleModal}
                    />
                </div>
            </Modal>
        </>
    )
}
