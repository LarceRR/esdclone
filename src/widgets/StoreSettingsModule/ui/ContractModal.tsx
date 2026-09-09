import { ModalSample } from '@/shared/ui/ModalSample'
import styles from '../StoreSettingsModule.module.css'

interface ContractModalProps {
    open: boolean
    contractUrl: string
    onClose: () => void
}

export const ContractModal = ({ open, contractUrl, onClose }: ContractModalProps) => (
    <ModalSample
        toggleModal={open}
        onCloseModal={onClose}
        title='Электронный договор'
        style={{ width: 'min(92vw, 56rem)', maxHeight: '90vh' }}
    >
        <div className={styles.contractModalBody}>
            <iframe
                className={styles.contractFrame}
                src={contractUrl}
                title='Электронный договор'
            />
        </div>
    </ModalSample>
)
