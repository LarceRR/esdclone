import React from 'react'
import LayoutAuth from '@/widgets/general/LayoutAuth'
import { SignInModule } from '@/features/auth/SignIn/ui/SignInModule/SignInModule.tsx'

const SignIn: React.FC = () => {
    return (
        <LayoutAuth>
            <SignInModule />
        </LayoutAuth>
    )
}
export default SignIn
