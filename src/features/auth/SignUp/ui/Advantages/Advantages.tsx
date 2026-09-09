import React, { memo } from 'react'
import { Box } from '@mui/material'
import styles from './Advantages.module.css'
import AccessIcon from '@public/icons/access-icon.svg'

const advantagesList: string[] = [
    'Без ограничение числа пользователей',
    'Электронный диагностический лист',
    'Учет заказов, склада и зарплат',
    'Проценка заказов',
    'Справочник норм времени',
    'Телефония',
]

export const Advantages: React.FC = memo(() => {
    return (
        <Box
            className={styles.Advantages}
            width={'100%'}
            height={'100%'}
            padding={'2rem'}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            gap={'1.25rem'}
        >
            {advantagesList.map((item) => (
                <Box
                    key={item}
                    display={'flex'}
                    alignItems={'center'}
                    gap={'0.75rem'}
                >
                    <AccessIcon />
                    <h6>{item}</h6>
                </Box>
            ))}
        </Box>
    )
})
