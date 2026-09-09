import { useCallback, useMemo, useState } from 'react'
import { Button } from '@mui/material'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { PageLoader } from '@/shared/ui/PageLoader'
import { useAppSelector } from '@/shared/store'
import {
    useAssignTariffMutation,
    useCreateTariffMutation,
    useDeleteTariffMutation,
    useGetTariffsListQuery,
    useUpdateTariffMutation,
} from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { CreateTariffModal } from './ui/CreateTariffModal'
import { EditTariff } from './ui/EditTariff'
import { RemoveTariff } from './ui/RemoveTariff'
import { AssignTariff } from './ui/AssignTariff'
import type { ShopExpressTariffDraft } from './types'
import { mapTariffFromApi } from './types'
import { formatDurationDays, formatTariffPrice } from './utils'
import styles from './ShopExpressModule.module.css'

const getErrorMessage = (err: unknown, fallback: string) => {
    if (typeof err === 'object' && err !== null && 'data' in err) {
        const data = (err as { data?: { message?: string } }).data
        if (data?.message) return data.message
    }

    return fallback
}

const ShopExpressModule = () => {
    useSetPageTitle('Магазин экспресс')
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const userData = useAppSelector((state) => state.auth.data)
    const canAssign = userData?.role === 'superadmin' || userData?.role === 'admin'

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const { data: listResponse, isFetching, isError } = useGetTariffsListQuery()
    const [createTariff, { isLoading: isCreating }] = useCreateTariffMutation()
    const [updateTariff, { isLoading: isUpdating }] = useUpdateTariffMutation()
    const [deleteTariff, { isLoading: isDeleting }] = useDeleteTariffMutation()
    const [assignTariff, { isLoading: isAssigning }] = useAssignTariffMutation()

    const tariffs = useMemo(
        () => (listResponse?.data ?? []).map(mapTariffFromApi),
        [listResponse],
    )

    const handleOpenCreateModal = useCallback(() => setIsCreateModalOpen(true), [])
    const handleCloseCreateModal = useCallback(() => setIsCreateModalOpen(false), [])

    const buildPayload = (draft: ShopExpressTariffDraft) => ({
        name: draft.name,
        cost: draft.cost,
        duration_days: draft.durationDays,
        icon_url: draft.iconUrl,
        icon: draft.iconFile ?? undefined,
    })

    const handleCreateTariff = async (draft: ShopExpressTariffDraft) => {
        try {
            const response = await createTariff(buildPayload(draft)).unwrap()
            TOAST_SUCCESS(response.message || 'Тариф создан')
        } catch (err) {
            TOAST_ERROR(getErrorMessage(err, 'Не удалось создать тариф'))
            throw err
        }
    }

    const handleUpdateTariff = async (id: number, draft: ShopExpressTariffDraft) => {
        try {
            const response = await updateTariff({ id, ...buildPayload(draft) }).unwrap()
            TOAST_SUCCESS(response.message || 'Тариф обновлен')
        } catch (err) {
            TOAST_ERROR(getErrorMessage(err, 'Не удалось обновить тариф'))
            throw err
        }
    }

    const handleRemoveTariff = async (id: number) => {
        try {
            const response = await deleteTariff(id).unwrap()
            TOAST_SUCCESS(response.message || 'Тариф удален')
        } catch (err) {
            TOAST_ERROR(getErrorMessage(err, 'Не удалось удалить тариф'))
            throw err
        }
    }

    const handleAssignTariff = async (tariffId: number, userId: number) => {
        try {
            const response = await assignTariff({ tariff_id: tariffId, user_id: userId }).unwrap()
            TOAST_SUCCESS(response.message || 'Тариф назначен')
        } catch (err) {
            TOAST_ERROR(getErrorMessage(err, 'Не удалось назначить тариф'))
            throw err
        }
    }

    const isMutating = isCreating || isUpdating || isDeleting || isAssigning

    return (
        <div className={styles.ShopExpressModule}>
            <PageLoader active={isFetching || isMutating} />

            <div className={styles.toolbar}>
                <Button
                    className={styles.createButton}
                    variant='contained'
                    onClick={handleOpenCreateModal}
                >
                    Создать тариф
                </Button>
            </div>

            <section className={styles.tablePanel}>
                <div className={styles.tableWrap}>
                    <table className={styles.tariffsTable}>
                        <thead>
                            <tr>
                                <th className={styles.colIcon}>Иконка</th>
                                <th>Название тарифа</th>
                                <th>Стоимость</th>
                                <th>Длительность</th>
                                <th className={styles.colActions}>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isError ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className={styles.emptyCell}
                                    >
                                        Не удалось загрузить тарифы
                                    </td>
                                </tr>
                            ) : (
                                tariffs.map((tariff) => (
                                    <tr key={tariff.id}>
                                        <td className={styles.iconCell}>
                                            <img
                                                src={tariff.iconUrl}
                                                alt={tariff.name}
                                                onError={(e) => {
                                                    e.currentTarget.src = '/images/no-image.jpg'
                                                }}
                                            />
                                        </td>
                                        <td>{tariff.name}</td>
                                        <td>{formatTariffPrice(tariff.cost)}</td>
                                        <td>{formatDurationDays(tariff.durationDays)}</td>
                                        <td className={styles.colActions}>
                                            <div className={styles.actionsCell}>
                                                {canAssign ? (
                                                    <AssignTariff
                                                        tariff={tariff}
                                                        onAssign={handleAssignTariff}
                                                        isLoading={isAssigning}
                                                    />
                                                ) : null}
                                                <EditTariff
                                                    tariff={tariff}
                                                    onUpdate={handleUpdateTariff}
                                                    isLoading={isUpdating}
                                                />
                                                <RemoveTariff
                                                    tariffId={tariff.id}
                                                    onRemove={handleRemoveTariff}
                                                    isLoading={isDeleting}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            {!isError && !tariffs.length && !isFetching ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className={styles.emptyCell}
                                    >
                                        Тарифы не созданы
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </section>

            <CreateTariffModal
                open={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onSave={handleCreateTariff}
                isLoading={isCreating}
            />
        </div>
    )
}

export default ShopExpressModule
