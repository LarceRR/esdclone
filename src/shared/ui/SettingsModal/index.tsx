import { useState } from 'react'
import { Button, Modal } from '@mui/material'
import styles from './SettingsModal.module.css'
import classNames from 'classnames'

interface IProps {
    children: React.ReactNode
    className?: string
    zIndex?: number
}
export const SettingsModal = ({ children, zIndex, className }: IProps) => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)
    const onVisibleModal = () => setToggleModal(true)
    const onHideModal = () => setToggleModal(false)
    return (
        <div className={classNames(styles.SettingsModal, className)}>
            <Button
                size={'medium'}
                variant={'contained'}
                onClick={onVisibleModal}
            >
                Настройки
            </Button>
            <Modal
                onClose={onHideModal}
                open={toggleModal}
                sx={{ zIndex: zIndex ? zIndex : 10 }}
            >
                <div className={styles.modal}>
                    <h2>Настройки</h2>
                    <div className={styles.content}>{children}</div>
                </div>
            </Modal>
        </div>
    )
}
