import { useEffect, useMemo } from 'react'
import { usePageTitleContext } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { useAppDispatch, useAppSelector } from '@/shared/store'
import { shopContextActions } from '@/shared/store/slices/shopContextSlice.ts'
import { useGetShopListQuery } from '@/shared/api/list/shopApi'
import { dashboardApi } from '@/shared/api/list/dashboardApi'
import { ShopTitleSelect } from '@/pages/Dashboard/ui/ShopTitleSelect.tsx'

const isAdminRole = (role: string | null) => role === 'admin' || role === 'superadmin'

interface DashboardTitleProps {
    shopName?: string | null
}

export const DashboardTitle = ({ shopName }: DashboardTitleProps) => {
    const dispatch = useAppDispatch()
    const { setTitle, setTitleNode } = usePageTitleContext()
    const role = useAppSelector((state) => state.auth.role)
    const selectedSellerId = useAppSelector((state) => state.shopContext.selectedSellerId)
    const isAdmin = isAdminRole(role)
    const { data: shopsResponse } = useGetShopListQuery(undefined, { skip: !isAdmin })
    const shops = shopsResponse?.data ?? []
    const shopsKey = shops.map((shop) => `${shop.id}:${shop.seller_id}:${shop.name}`).join('|')

    useEffect(() => {
        if (!isAdmin || shops.length === 0 || selectedSellerId !== null) {
            return
        }
        dispatch(shopContextActions.setSelectedSellerId(shops[0].seller_id))
        dispatch(dashboardApi.util.invalidateTags(['Dashboard']))
    }, [dispatch, isAdmin, selectedSellerId, shops])

    const titleNode = useMemo(() => {
        if (!isAdmin || shops.length === 0) {
            return null
        }

        return (
            <>
                Дэшборд — <ShopTitleSelect shops={shops} />
            </>
        )
    }, [isAdmin, shops, shopsKey])

    useEffect(() => {
        if (titleNode) {
            setTitleNode(titleNode)
        } else {
            setTitle(shopName ? `Дэшборд — ${shopName}` : 'Дэшборд')
        }

        return () => {
            setTitle(null)
            setTitleNode(null)
        }
    }, [setTitle, setTitleNode, shopName, titleNode])

    return null
}
