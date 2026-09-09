export interface ProductWarehouseRow {
    id: number
    productId: string
    imageUrl: string | null
    name: string
    category: string
    subCategory: string
    purchasePrice: number | null
}

const formatMoney = (value: number) =>
    value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatPrice = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '—'
    return `$${formatMoney(value)}`
}
