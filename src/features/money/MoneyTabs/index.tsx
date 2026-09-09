import { memo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './MoneyTabs.module.css'
import { Button } from '@mui/material'
import { ELinks } from '@/shared/constants/appLinks.ts'

export const MoneyTabs = memo(() => {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const chapter = pathname.split('/').at(-1)
    return (
        <div className={styles.MoneyTabs}>
            <Button
                size={'medium'}
                variant={'outlined'}
                disabled={chapter === 'money'}
                onClick={() => navigate(ELinks.MONEY_LIST)}
            >
                Деньги
            </Button>
            <Button
                size={'medium'}
                variant={'outlined'}
                disabled={chapter === 'transfers'}
                onClick={() => navigate(ELinks.MONEY_TRANSFERS_LIST)}
            >
                Перемещения
            </Button>
        </div>
    )
})
