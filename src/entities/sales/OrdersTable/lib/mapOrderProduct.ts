import type { IProductHoldItem } from '@/shared/api/list/goodsApi/types'

export type OrderCatalogProduct = {
    id: number
    title: string
    cash: number
    image: string | File
}

export const mapHoldItemToOrderProduct = (item: IProductHoldItem): OrderCatalogProduct => ({
    id: item.id,
    title: item.name,
    cash: item.sellingPrice ?? 0,
    image: item.imageUrl ?? '',
})

export const mapHoldItemsToOrderProducts = (items: IProductHoldItem[]): OrderCatalogProduct[] =>
    items.map(mapHoldItemToOrderProduct)
