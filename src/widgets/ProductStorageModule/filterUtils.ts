import type { ProductStorageRow } from './mockData'

export interface ProductStorageAppliedFilters {
    name: string
    id: string
    category: string
    status: string
}

const normalizeId = (value: string) => value.replace(/\s/g, '').toLowerCase()

export const matchesProductStorageFilters = (
    row: ProductStorageRow,
    filters: ProductStorageAppliedFilters,
) => {
    const nameQuery = filters.name.trim().toLowerCase()
    const idQuery = normalizeId(filters.id)

    const matchesName = !nameQuery || row.name.toLowerCase().includes(nameQuery)
    const matchesId = !idQuery || normalizeId(row.productId).includes(idQuery)
    const matchesCategory = filters.category === 'all' || row.category === filters.category
    const matchesStatus = filters.status === 'all' || row.status === filters.status

    return matchesName && matchesId && matchesCategory && matchesStatus
}
