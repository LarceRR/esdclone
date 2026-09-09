import React from 'react'
import LayoutAuth from '@/widgets/general/LayoutAuth'
import SignUpModule from '@/features/auth/SignUp'

const SignUp: React.FC = () => {
    return (
        <LayoutAuth>
            <SignUpModule />
        </LayoutAuth>
    )
}
export default SignUp
