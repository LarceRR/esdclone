import React, { ReactNode, useEffect } from 'react'
import styles from './LayoutAuth.module.css'
import classNames from 'classnames'
import { useAuth } from '@/shared/lib/hooks/useAuth'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { useNavigate } from 'react-router-dom'

interface ILayoutAuth {
    children: ReactNode
    className?: string
}

export const LayoutAuth: React.FC<ILayoutAuth> = (props) => {
    const { className, children } = props
    const navigate = useNavigate()
    const { isAuth } = useAuth()

    useEffect(() => {
        if (isAuth) {
            navigate(ELinks.HOME)
        }
    }, [isAuth])

    if (isAuth) return

    return <div className={classNames(styles.LayoutAuth, className)}>{children}</div>
}
