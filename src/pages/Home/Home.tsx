import React, { useEffect } from 'react'
import LayoutContent from '@/widgets/general/LayoutContent'
import { Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { ELinks } from '@/shared/constants/appLinks.ts'

const Home: React.FC = () => {
    const navigate = useNavigate()
    const { isAuth } = useAuth()

    useEffect(() => {
        if (isAuth) {
            navigate(ELinks.DASHBOARD)
        }
    }, [isAuth])
    return (
        <LayoutContent>
            <Alert severity='warning'>Если у вас недоступны нужные разделы – обратитесь к администратору для получения прав</Alert>
        </LayoutContent>
    )
}
export default Home
