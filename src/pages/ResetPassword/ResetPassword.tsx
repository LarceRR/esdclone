import React from 'react'
import LayoutAuth from '@/widgets/general/LayoutAuth'
import { ResetPasswordModule } from '@/features/auth/ResetPassword/ui/ResetPasswordModule/ResetPasswordModule.tsx'

const ResetPassword: React.FC = () => {
    return (
        <LayoutAuth>
            <ResetPasswordModule />
        </LayoutAuth>
    )
}

export default ResetPassword
