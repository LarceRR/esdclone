export interface ProductStorageRow {
    id: number
    productId: string
    imageUrl: string | null
    name: string
    category: string
    subCategory: string
    purchasePrice: number | null
    sellingPrice: number | null
    discountedPrice: number | null
    profit: number | null
    accumulatedSales: number
    listProducts: boolean
    recommendation: boolean
    subscription: boolean
    status: string
}

export const productStatuses = ['На полке', 'Снят с полки', 'Черновик', 'На модерации'] as const

const formatMoney = (value: number) =>
    value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatPrice = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '—'
    return `$${formatMoney(value)}`
}
