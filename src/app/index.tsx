import './styles/index.css'
import AppProviders from '@/app/providers'
import Router from '@/app/Router'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { ru } from 'date-fns/locale'

export const App = () => {
    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={ru}
        >
            <AppProviders>
                <Router />
            </AppProviders>
        </LocalizationProvider>
    )
}
