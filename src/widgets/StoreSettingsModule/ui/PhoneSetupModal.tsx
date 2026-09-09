import { ModalSample } from '@/shared/ui/ModalSample'
import styles from '../StoreSettingsModule.module.css'

interface PhoneSetupModalProps {
    open: boolean
    initialPhone: string
    isSaving: boolean
    onClose: () => void
    onSave: (phone: string) => void
}

export const PhoneSetupModal = ({
    open,
    initialPhone,
    isSaving,
    onClose,
    onSave,
}: PhoneSetupModalProps) => {
    return (
        <ModalSample
            toggleModal={open}
            onCloseModal={onClose}
            title='Настройка номера'
        >
            <div className={styles.modalBody}>
                <label className={styles.field}>
                    <span className={styles.fieldLabel}>Мобильный номер</span>
                    <input
                        className={styles.input}
                        type='tel'
                        defaultValue={initialPhone}
                        id='phone-setup-input'
                        placeholder='Введите номер телефона'
                    />
                </label>
                <div className={styles.modalActions}>
                    <button
                        type='button'
                        className={styles.modalSecondaryButton}
                        onClick={onClose}
                    >
                        Отмена
                    </button>
                    <button
                        type='button'
                        className={styles.modalPrimaryButton}
                        disabled={isSaving}
                        onClick={() => {
                            const input = document.getElementById('phone-setup-input') as HTMLInputElement | null
                            onSave(input?.value ?? '')
                        }}
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </ModalSample>
    )
}
