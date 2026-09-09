import React from 'react'
import { Box } from '@mui/material'
import styles from './SignUpModule.module.css'
import { Form } from '../Form/Form.tsx'
import { Advantages } from '@/features/auth/SignUp/ui/Advantages/Advantages.tsx'

export const SignUpModule: React.FC = () => {
    return (
        <Box
            className={styles.SignUpModule}
            width={'50%'}
            display={'flex'}
        >
            <Box
                width={'45%'}
                className={styles.form}
            >
                <Form />
            </Box>
            <Box width={'55%'}>
                <Advantages />
            </Box>
        </Box>
    )
}
