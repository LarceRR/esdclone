import { ErrorBoundary as ErrorBoundaryPackage } from 'react-error-boundary'
import { FallbackComponent } from './ui/FallbackComponent.tsx'
import { ReactNode } from 'react'
export const ErrorBoundary = ({ children }: { children: ReactNode }) => {
    return <ErrorBoundaryPackage fallback={<FallbackComponent />}>{children}</ErrorBoundaryPackage>
}
