import styles from './index.module.css'
import { Button } from '@mui/material'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { useLocation, useNavigate } from 'react-router-dom'

export const StockTabs = () => {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const chapter = pathname.split('/').at(-1)
    return (
        <div className={styles.container}>
            <Button
                size={'medium'}
                variant={'outlined'}
                disabled={chapter === 'provider'}
                onClick={() => navigate(ELinks.STOCK_PROVIDER_LIST)}
            >
                У поставщиков
            </Button>
            <Button
                size={'medium'}
                variant={'outlined'}
                disabled={chapter === 'receipts'}
                onClick={() => navigate(ELinks.STOCK_RECEIPTS_LIST)}
            >
                Поступления
            </Button>
            <Button
                size={'medium'}
                variant={'outlined'}
                disabled={chapter === 'adjustment'}
                onClick={() => navigate(ELinks.STOCK_ADJUSTMENT_LIST)}
            >
                Корректировка
            </Button>
        </div>
    )
}
