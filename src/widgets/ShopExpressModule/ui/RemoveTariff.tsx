import { useCallback, useState } from 'react'
import { RemoveButtonTable } from '@/shared/ui/RemoveButtonTable'

interface RemoveTariffProps {
    tariffId: number
    onRemove: (id: number) => Promise<void>
    isLoading?: boolean
}

export const RemoveTariff = ({ tariffId, onRemove, isLoading = false }: RemoveTariffProps) => {
    const [toggleConfirm, setToggleConfirm] = useState(false)

    const onClose = useCallback(() => setToggleConfirm(false), [])
    const onOpen = useCallback(() => setToggleConfirm(true), [])

    const handleRemove = async () => {
        await onRemove(tariffId)
        onClose()
    }

    return (
        <RemoveButtonTable
            toggle={toggleConfirm}
            onOpen={onOpen}
            onClose={onClose}
            handleRemove={() => void handleRemove()}
            isLoading={isLoading}
        />
    )
}
