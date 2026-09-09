import React, { useCallback, useState } from 'react'
import styles from './GroupsListModule.module.css'
import { GroupsTable } from '@/entities/GroupsTable'
import CreateGroup from '@/features/groups-list/CreateGroup'

export const GroupsListModule: React.FC = () => {
    const [toggleModal, setToggleModal] = useState<boolean>(false)

    const onOpenCreateGroupModal = useCallback(() => setToggleModal(true), [])
    const onCloseCreateGroupModal = useCallback(() => setToggleModal(false), [])

    return (
        <div className={styles.GroupsListModule}>
            <GroupsTable
                pageTitle='Группы'
                toolbarSlot={
                    <CreateGroup
                        open={toggleModal}
                        onClose={onCloseCreateGroupModal}
                        onOpen={onOpenCreateGroupModal}
                    />
                }
            />
        </div>
    )
}
