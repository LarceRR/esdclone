const formatMoney = (value: number) =>
    value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatSignedAmount = (value: number) => {
    const formatted = formatMoney(Math.abs(value))
    return value >= 0 ? `+ $${formatted}` : `- $${formatted}`
}

export const formatBalance = (value: number) => `$${formatMoney(value)}`
