import React, { memo } from 'react'
import { UsersTable } from '@/entities/UsersTable'
import styles from './UsersListModule.module.css'
import CreateUser from '@/features/users-list/CreateUser'

export const UsersListModule: React.FC = memo(() => {
    return (
        <div className={styles.UsersListModule}>
            <UsersTable pageTitle='Пользователи' toolbarSlot={<CreateUser />} />
        </div>
    )
})
