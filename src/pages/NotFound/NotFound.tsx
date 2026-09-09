import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { ELinks } from '@/shared/constants/appLinks.ts'
import styles from './NotFound.module.css'
import { memo } from 'react'

const NotFound = memo(() => {
    return (
        <div className={styles.NotFound}>
            <div className={styles.modal}>
                <div className={styles.text}>
                    <h1>404</h1>
                    <div className={styles.sep} />
                    <p>Неправильно введен адрес или такой страницы не существует!</p>
                </div>
                <Link to={ELinks.HOME}>
                    <Button
                        size={'medium'}
                        variant={'contained'}
                        fullWidth
                    >
                        На главную
                    </Button>
                </Link>
            </div>
        </div>
    )
})
export default NotFound
