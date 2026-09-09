import { IconButton } from '@mui/material'
import EditIcon from '@public/icons/edit-icon.svg'
import { ModalSample } from '@/shared/ui/ModalSample'
import styles from './editButton.module.css'

interface IProps {
    id?: number
    title: string
    children: React.ReactNode
    onOpen: () => void
    onClose: () => void
    toggle: boolean
    disabled?: boolean
    icon?: React.ReactNode
}

export const EditButtonTable = (props: IProps) => {
    const { id, title, children, icon, onOpen, onClose, toggle, disabled } = props

    return (
        <>
            <IconButton
                disabled={disabled || false}
                size={'large'}
                onClick={onOpen}
                className={styles.iconButton}
            >
                {icon ? icon : <EditIcon />}
            </IconButton>
            <ModalSample
                toggleModal={toggle}
                onCloseModal={onClose}
                title={`${title} ${id ? `№${id}` : ''}`}
            >
                {children}
            </ModalSample>
        </>
    )
}
