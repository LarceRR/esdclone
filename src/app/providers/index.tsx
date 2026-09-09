import React, { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { persistor, store } from '@/shared/store'
import { ErrorBoundary } from '@/app/providers/ErrorBoundary'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import { PersistGate } from 'redux-persist/integration/react'

const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <ThemeProvider>
            <ErrorBoundary>
                <BrowserRouter>
                    <Provider store={store}>
                        <PersistGate
                            loading={null}
                            persistor={persistor}
                        >
                            {children}
                        </PersistGate>
                    </Provider>
                </BrowserRouter>
                <Toaster />
            </ErrorBoundary>
        </ThemeProvider>
    )
}
export default AppProviders
