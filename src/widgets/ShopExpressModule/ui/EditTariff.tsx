import { useCallback, useState } from 'react'
import { EditButtonTable } from '@/shared/ui/EditButtonTable'
import type { ShopExpressTariff, ShopExpressTariffDraft } from '../types'
import { TariffForm } from './TariffForm'

interface EditTariffProps {
    tariff: ShopExpressTariff
    onUpdate: (id: number, draft: ShopExpressTariffDraft) => Promise<void>
    isLoading?: boolean
}

export const EditTariff = ({ tariff, onUpdate, isLoading = false }: EditTariffProps) => {
    const [toggleModal, setToggleModal] = useState(false)

    const onOpen = useCallback(() => setToggleModal(true), [])
    const onClose = useCallback(() => setToggleModal(false), [])

    const handleSave = async (draft: ShopExpressTariffDraft) => {
        await onUpdate(tariff.id, draft)
        onClose()
    }

    return (
        <EditButtonTable
            title='Редактирование тарифа'
            toggle={toggleModal}
            onOpen={onOpen}
            onClose={onClose}
        >
            <TariffForm
                initialTariff={tariff}
                submitLabel={isLoading ? 'Сохранение...' : 'Сохранить'}
                onSubmit={(draft) => void handleSave(draft)}
                onCancel={onClose}
            />
        </EditButtonTable>
    )
}
