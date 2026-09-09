const formatMoney = (value: number) =>
    value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatTariffPrice = (value: number) => `$${formatMoney(value)}`

export const formatDurationDays = (days: number) => {
    const mod10 = days % 10
    const mod100 = days % 100
    if (mod100 >= 11 && mod100 <= 14) return `${days} дней`
    if (mod10 === 1) return `${days} день`
    if (mod10 >= 2 && mod10 <= 4) return `${days} дня`
    return `${days} дней`
}
