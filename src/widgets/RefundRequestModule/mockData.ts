export const formatPrice = (value: number | string) => {
    const amount = Number(value ?? 0)
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const formatDateTime = (value: string | null | undefined) => {
    if (!value) return '—'
    return value.replace('T', ' ').slice(0, 19)
}
