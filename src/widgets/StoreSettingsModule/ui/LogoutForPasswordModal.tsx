import { ModalSample } from '@/shared/ui/ModalSample'
import styles from '../StoreSettingsModule.module.css'

interface LogoutForPasswordModalProps {
    open: boolean
    isLoading: boolean
    onClose: () => void
    onConfirm: () => void
}

export const LogoutForPasswordModal = ({
    open,
    isLoading,
    onClose,
    onConfirm,
}: LogoutForPasswordModalProps) => (
    <ModalSample
        toggleModal={open}
        onCloseModal={onClose}
        title='Смена пароля'
    >
        <div className={styles.modalBody}>
            <p className={styles.modalHint}>
                Для смены пароля необходимо выйти из аккаунта. Продолжить?
            </p>
            <div className={styles.modalActions}>
                <button
                    type='button'
                    className={styles.modalSecondaryButton}
                    onClick={onClose}
                    disabled={isLoading}
                >
                    Отмена
                </button>
                <button
                    type='button'
                    className={styles.modalPrimaryButton}
                    onClick={onConfirm}
                    disabled={isLoading}
                >
                    Выйти
                </button>
            </div>
        </div>
    </ModalSample>
)
