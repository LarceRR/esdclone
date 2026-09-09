import { memo } from 'react'
import styles from './SalesTabs.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import { ELinks } from '@/shared/constants/appLinks.ts'

export const SalesTabs = memo(() => {
    const navigate = useNavigate()
    const { pathname } = useLocation() || 'sale'
    const chapter = pathname.split('/').at(-1)
    return (
        <div className={styles.SalesTabs}>
            <Button
                size={'medium'}
                variant={'outlined'}
                disabled={chapter === 'sale'}
                onClick={() => navigate(ELinks.DASHBOARD)}
            >
                Продажи
            </Button>
            <Button
                size={'medium'}
                variant={'outlined'}
                disabled={chapter === 'order'}
                onClick={() => navigate(ELinks.SALES_ORDER_LIST)}
            >
                Заказы клиентов
            </Button>
        </div>
    )
})
