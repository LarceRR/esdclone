import type { SellerLevelId } from '@/shared/api/list/sellerLevelApi/types.ts'

export type { SellerLevelId }

export const sellerLevelIconSrc = (id: SellerLevelId) => `/images/shop-level/${id}.png`

export interface SellerLevelRow {
    id: SellerLevelId
    label: string
    operatingFunds: number
    branches: number
    profitRatio: string
    trafficSupport: string
    globalDeliveryDays: number
    purchaseDiscount: string
    upgradeBonus: string
    exclusiveService: boolean
    homePageRecommendation: boolean
}

export const sellerLevelRows: SellerLevelRow[] = [
    {
        id: 'C',
        label: 'Уровень C',
        operatingFunds: 5000,
        branches: 5,
        profitRatio: '5.00%–24.00%',
        trafficSupport: '100–150',
        globalDeliveryDays: 7,
        purchaseDiscount: '0.00%',
        upgradeBonus: '$200.00',
        exclusiveService: true,
        homePageRecommendation: false,
    },
    {
        id: 'B',
        label: 'Уровень B',
        operatingFunds: 20000,
        branches: 20,
        profitRatio: '5.00%–28.00%',
        trafficSupport: '200–300',
        globalDeliveryDays: 7,
        purchaseDiscount: '0.00%',
        upgradeBonus: '$400.00',
        exclusiveService: true,
        homePageRecommendation: true,
    },
    {
        id: 'A',
        label: 'Уровень A',
        operatingFunds: 50000,
        branches: 30,
        profitRatio: '5.00%–32.00%',
        trafficSupport: '400–500',
        globalDeliveryDays: 7,
        purchaseDiscount: '0.00%',
        upgradeBonus: '$600.00',
        exclusiveService: true,
        homePageRecommendation: true,
    },
    {
        id: 'S',
        label: 'Уровень S',
        operatingFunds: 100000,
        branches: 50,
        profitRatio: '5.00%–36.00%',
        trafficSupport: '700–800',
        globalDeliveryDays: 7,
        purchaseDiscount: '0.00%',
        upgradeBonus: '$800.00',
        exclusiveService: true,
        homePageRecommendation: true,
    },
    {
        id: 'SS',
        label: 'Уровень SS',
        operatingFunds: 200000,
        branches: 100,
        profitRatio: '5.00%–36.00%',
        trafficSupport: '800–1200',
        globalDeliveryDays: 7,
        purchaseDiscount: '0.00%',
        upgradeBonus: '$2,000.00',
        exclusiveService: true,
        homePageRecommendation: true,
    },
    {
        id: 'SSS',
        label: 'Уровень SSS',
        operatingFunds: 500000,
        branches: 200,
        profitRatio: '5.00%–36.00%',
        trafficSupport: '1200–1500',
        globalDeliveryDays: 7,
        purchaseDiscount: '0.00%',
        upgradeBonus: '$5,000.00',
        exclusiveService: true,
        homePageRecommendation: true,
    },
]

export const formatOperatingFunds = (value: number) => value.toLocaleString('en-US')
