import React from 'react'
import { Box, CircularProgress } from '@mui/material'

export const LoaderCalendarModule: React.FC = () => {
    return (
        <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            width={'100%'}
            height={'100vh'}
        >
            <CircularProgress />
        </Box>
    )
}
