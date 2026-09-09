import { ModalSample } from '@/shared/ui/ModalSample'
import type { ShopExpressTariffDraft } from '../types'
import { TariffForm } from './TariffForm'

interface CreateTariffModalProps {
    open: boolean
    onClose: () => void
    onSave: (tariff: ShopExpressTariffDraft) => Promise<void>
    isLoading?: boolean
}

export const CreateTariffModal = ({ open, onClose, onSave, isLoading = false }: CreateTariffModalProps) => {
    const handleSave = async (draft: ShopExpressTariffDraft) => {
        await onSave(draft)
        onClose()
    }

    return (
        <ModalSample
            toggleModal={open}
            onCloseModal={onClose}
            title='Создать тариф'
        >
            <TariffForm
                submitLabel={isLoading ? 'Сохранение...' : 'Сохранить'}
                onSubmit={(draft) => void handleSave(draft)}
                onCancel={onClose}
            />
        </ModalSample>
    )
}
