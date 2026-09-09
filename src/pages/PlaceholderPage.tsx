import { Box, Typography } from '@mui/material'
import LayoutContent from '@/widgets/general/LayoutContent'

export function PlaceholderPage({ title }: { title: string }) {
    return (
        <LayoutContent>
            <Box sx={{ py: 2 }}>
                <Typography variant='h5' component='h1'>
                    {title}
                </Typography>
            </Box>
        </LayoutContent>
    )
}
