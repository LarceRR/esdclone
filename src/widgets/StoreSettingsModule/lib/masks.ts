export const maskName = (value: string) => {
    const trimmed = value.trim()
    if (trimmed.length === 0) return ''
    if (trimmed.length <= 2) return `${trimmed[0]}*`
    return `${trimmed[0]}${'*'.repeat(Math.min(trimmed.length - 1, 3))}`
}

export const maskEmail = (value: string) => {
    const [local, domain] = value.split('@')
    if (!local || !domain) return value
    if (local.length <= 1) return `*@${domain}`
    return `${local[0]}${'*'.repeat(Math.max(local.length - 1, 3))}@${domain}`
}

export const maskPhone = (value: string | null | undefined) => {
    if (!value) return ''
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 4) return value
    return `${digits.slice(0, 2)}${'*'.repeat(Math.max(digits.length - 4, 2))}${digits.slice(-2)}`
}
