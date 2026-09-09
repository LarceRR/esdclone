import { ThemeProvider as MuiThemeProvider, useMediaQuery } from '@mui/material'
import { ReactNode } from 'react'
import { theme } from '@/app/providers/ThemeProvider/theme/theme.ts'
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const isSmallScreen = useMediaQuery('(max-width:767px)')
    return <MuiThemeProvider theme={theme(isSmallScreen)}>{children}</MuiThemeProvider>
}
