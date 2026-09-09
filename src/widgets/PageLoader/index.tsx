import React from 'react'
import { Box, CircularProgress } from '@mui/material'

export const PageLoader: React.FC = () => {
    return (
        <Box
            width={'100vw'}
            height={'100vh'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <CircularProgress />
        </Box>
    )
}
