import type { ITariffListItem } from '@/shared/api/list/tariffApi/types.ts'

export interface ShopExpressTariff {
    id: number
    name: string
    cost: number
    durationDays: number
    iconUrl: string
}

export interface ShopExpressTariffDraft {
    name: string
    cost: number
    durationDays: number
    iconUrl?: string
    iconFile?: File | null
}

export const mapTariffFromApi = (item: ITariffListItem): ShopExpressTariff => ({
    id: item.id,
    name: item.name,
    cost: item.cost,
    durationDays: item.duration_days,
    iconUrl: item.icon_url,
})
