export const formatWalletMoney = (value: number) =>
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const formatAmountWithCurrency = (amount: number | string, currency: string) => {
    const numeric = Number(amount)
    const formatted = Number.isFinite(numeric)
        ? numeric.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : String(amount)

    return `${formatted} ${currency}`
}
