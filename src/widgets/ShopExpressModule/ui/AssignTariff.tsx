import { useCallback, useMemo, useState } from 'react'
import { Button, IconButton, Tooltip } from '@mui/material'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import { ModalSample } from '@/shared/ui/ModalSample'
import { useGetUsersListQuery } from '@/shared/api'
import toast from 'react-hot-toast'
import type { ShopExpressTariff } from '../types'
import iconStyles from '@/shared/ui/EditButtonTable/editButton.module.css'
import styles from './AssignTariffModal.module.css'

interface AssignTariffProps {
    tariff: ShopExpressTariff
    onAssign: (tariffId: number, userId: number) => Promise<void>
    isLoading?: boolean
}

export const AssignTariff = ({ tariff, onAssign, isLoading = false }: AssignTariffProps) => {
    const [open, setOpen] = useState(false)
    const [userId, setUserId] = useState('')
    const { data: usersResponse, isFetching: isUsersLoading } = useGetUsersListQuery(undefined, {
        skip: !open,
    })

    const users = useMemo(() => {
        const list = usersResponse?.data ?? usersResponse ?? []
        if (!Array.isArray(list)) return []
        return list
    }, [usersResponse])

    const onOpen = useCallback(() => setOpen(true), [])
    const onClose = useCallback(() => {
        setOpen(false)
        setUserId('')
    }, [])

    const handleAssign = async () => {
        const selectedUserId = Number(userId)
        if (!selectedUserId) {
            toast.error('Выберите пользователя')
            return
        }

        try {
            await onAssign(tariff.id, selectedUserId)
            toast.success(`Тариф «${tariff.name}» назначен`)
            onClose()
        } catch {
            // error handled in parent
        }
    }

    return (
        <>
            <Tooltip title='Назначить пользователю'>
                <span>
                    <IconButton
                        className={iconStyles.iconButton}
                        size='large'
                        disabled={isLoading}
                        onClick={onOpen}
                        aria-label={`Назначить тариф ${tariff.name}`}
                    >
                        <PersonAddOutlinedIcon fontSize='small' />
                    </IconButton>
                </span>
            </Tooltip>

            <ModalSample
                toggleModal={open}
                onCloseModal={onClose}
                title={`Назначить тариф «${tariff.name}»`}
            >
                <div className={styles.form}>
                    <label className={styles.field}>
                        <span>Пользователь</span>
                        <select
                            value={userId}
                            disabled={isUsersLoading || isLoading}
                            onChange={(event) => setUserId(event.target.value)}
                        >
                            <option value=''>Выберите пользователя</option>
                            {users.map((user: { id: number; name: string; surname: string; email: string }) => (
                                <option
                                    key={user.id}
                                    value={user.id}
                                >
                                    {user.name} {user.surname} ({user.email})
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className={styles.actions}>
                        <Button
                            variant='contained'
                            disabled={isLoading || isUsersLoading}
                            onClick={() => void handleAssign()}
                        >
                            Назначить
                        </Button>
                        <Button
                            variant='outlined'
                            onClick={onClose}
                        >
                            Отменить
                        </Button>
                    </div>
                </div>
            </ModalSample>
        </>
    )
}
