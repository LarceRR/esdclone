import { Route, Routes } from 'react-router-dom'
import { routeConfig } from '@/shared/config/routeConfig/routeConfig.tsx'
import { Suspense } from 'react'
import { PageLoader } from '@/widgets/PageLoader'

const Router = () => {
    const routes = Object.values(routeConfig)
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {routes.map(({ path, element }) => (
                    <Route
                        key={path}
                        path={path}
                        element={element}
                    />
                ))}
            </Routes>
        </Suspense>
    )
}
export default Router
