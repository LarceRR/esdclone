/** Нормализует ввод даты к YYYY-MM-DD для сравнения на фронте. */
export const normalizeFilterDate = (value: string): string => {
    const trimmed = value.trim()
    if (!trimmed) return ''

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed
    }

    const dotMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
    if (dotMatch) {
        const [, day, month, year] = dotMatch
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    if (slashMatch) {
        const [, day, month, year] = slashMatch
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    const parsed = Date.parse(trimmed)
    if (!Number.isNaN(parsed)) {
        const date = new Date(parsed)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    return trimmed
}

export const getRowDateKey = (changeTime: string) => normalizeFilterDate(changeTime.slice(0, 10))

export interface RecordFundAppliedFilters {
    orderType: string
    startDate: string
    endDate: string
}

export const matchesRecordFundFilters = (
    row: { orderType: string; changeTime: string },
    filters: RecordFundAppliedFilters,
) => {
    const matchesType = filters.orderType === 'all' || row.orderType === filters.orderType

    const rowDate = getRowDateKey(row.changeTime)
    const startDate = normalizeFilterDate(filters.startDate)
    const endDate = normalizeFilterDate(filters.endDate)

    const matchesStart = !startDate || (rowDate.length >= 10 && rowDate >= startDate)
    const matchesEnd = !endDate || (rowDate.length >= 10 && rowDate <= endDate)

    return matchesType && matchesStart && matchesEnd
}
