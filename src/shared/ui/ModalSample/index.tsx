import { Modal } from '@mui/material'
import CloseIcon from '@public/icons/close-icon.svg'
import styles from './index.module.css'
import classNames from 'classnames'

interface IProps {
    toggleModal: boolean
    onCloseModal: () => void
    children: React.ReactNode
    title: string
    style?: React.CSSProperties
}

export const ModalSample = (props: IProps) => {
    const { onCloseModal, toggleModal, title, style, children } = props
    return (
        <Modal
            onClose={onCloseModal}
            open={toggleModal}
        >
            <div
                style={style}
                className={styles.wrapper}
            >
                <header className={classNames(styles.header, title && styles.hasTitle)}>
                    <h3>{title}</h3>
                    <button onClick={onCloseModal}>
                        <CloseIcon />
                    </button>
                </header>
                {children}
            </div>
        </Modal>
    )
}
