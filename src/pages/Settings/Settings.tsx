import React from 'react'
import LayoutContent from '@/widgets/general/LayoutContent'
import styles from './Settings.module.css'
import StoreSettingsModule from '@/widgets/StoreSettingsModule'

const Settings: React.FC = () => {
    return (
        <LayoutContent className={styles.Settings}>
            <StoreSettingsModule />
        </LayoutContent>
    )
}
export default Settings
