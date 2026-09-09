import { ModalSample } from '@/shared/ui/ModalSample'
import styles from '../StoreSettingsModule.module.css'

interface NameViewModalProps {
    open: boolean
    fullName: string
    onClose: () => void
}

export const NameViewModal = ({ open, fullName, onClose }: NameViewModalProps) => (
    <ModalSample
        toggleModal={open}
        onCloseModal={onClose}
        title='Имя пользователя'
    >
        <div className={styles.modalBody}>
            <p className={styles.modalNameValue}>{fullName}</p>
            <div className={styles.modalActions}>
                <button
                    type='button'
                    className={styles.modalPrimaryButton}
                    onClick={onClose}
                >
                    Закрыть
                </button>
            </div>
        </div>
    </ModalSample>
)
