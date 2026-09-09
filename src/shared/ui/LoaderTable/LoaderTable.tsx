import React, { memo } from 'react'
import { Box, CircularProgress } from '@mui/material'

export const LoaderTable: React.FC = memo(() => {
    return (
        <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            width={'100%'}
            height={'90vh'}
        >
            <CircularProgress />
        </Box>
    )
})
