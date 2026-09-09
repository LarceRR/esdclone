import type { JsonParserSettings } from './types'

const PRODUCT_FIELD_HINTS = [
    'title',
    'name',
    'sku',
    'price',
    'product',
    'description',
    'stock',
    'brand',
    'category',
    'barcode',
    'image',
    'thumbnail',
]

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    value !== null && typeof value === 'object' && !Array.isArray(value)

export const isProductItemArray = (value: unknown): value is Record<string, unknown>[] => {
    if (!Array.isArray(value) || !value.length) return false

    const sample = value.slice(0, Math.min(8, value.length))
    const objectItems = sample.filter(isPlainObject)

    if (objectItems.length < Math.ceil(sample.length * 0.75)) return false

    const first = objectItems[0]
    const keys = Object.keys(first)
    if (!keys.length) return false

    const hasHints = keys.some((key) =>
        PRODUCT_FIELD_HINTS.some((hint) => key.toLowerCase().includes(hint)),
    )

    return hasHints || keys.length >= 2
}

const scoreProductArray = (items: Record<string, unknown>[], path: string) => {
    const first = items[0]
    const keys = Object.keys(first)
    const hintMatches = keys.filter((key) =>
        PRODUCT_FIELD_HINTS.some((hint) => key.toLowerCase().includes(hint)),
    ).length

    const pathBonus = /product|item|catalog|goods|offer/i.test(path) ? 15 : 0

    return items.length * 5 + keys.length * 2 + hintMatches * 8 + pathBonus
}

export interface JsonArrayCandidate {
    path: string
    items: Record<string, unknown>[]
    score: number
}

export const getByPath = (value: unknown, path: string): unknown => {
    if (!path.trim()) return value

    return path.split('.').filter(Boolean).reduce<unknown>((acc, key) => {
        if (acc && typeof acc === 'object' && !Array.isArray(acc) && key in (acc as Record<string, unknown>)) {
            return (acc as Record<string, unknown>)[key]
        }
        return undefined
    }, value)
}

const coerceToItems = (value: unknown): Record<string, unknown>[] => {
    if (isProductItemArray(value)) return value
    if (isPlainObject(value)) return [value]
    return []
}

/** Ищет все пути к массивам объектов, похожим на товары. */
export const findProductArrayCandidates = (value: unknown, pathPrefix = ''): JsonArrayCandidate[] => {
    const candidates: JsonArrayCandidate[] = []

    if (isProductItemArray(value)) {
        candidates.push({
            path: pathPrefix,
            items: value,
            score: scoreProductArray(value, pathPrefix),
        })
        return candidates
    }

    if (Array.isArray(value)) {
        value.forEach((item) => {
            candidates.push(...findProductArrayCandidates(item, pathPrefix))
        })
        return candidates
    }

    if (!isPlainObject(value)) return candidates

    Object.entries(value).forEach(([key, nested]) => {
        const nextPath = pathPrefix ? `${pathPrefix}.${key}` : key
        candidates.push(...findProductArrayCandidates(nested, nextPath))
    })

    return candidates
}

/** Первое вхождение ключа с массивом товаров (поиск в глубину). */
export const findFirstArrayPathByKey = (value: unknown, key: string): string | null => {
    const normalizedKey = key.trim().toLowerCase()
    if (!normalizedKey) return null

    const walk = (node: unknown, prefix: string): string | null => {
        if (isPlainObject(node)) {
            for (const [entryKey, entryValue] of Object.entries(node)) {
                const entryPath = prefix ? `${prefix}.${entryKey}` : entryKey

                if (entryKey.toLowerCase() === normalizedKey && isProductItemArray(entryValue)) {
                    return entryPath
                }

                const nested = walk(entryValue, entryPath)
                if (nested) return nested
            }
        }

        if (Array.isArray(node)) {
            for (const item of node) {
                const nested = walk(item, prefix)
                if (nested) return nested
            }
        }

        return null
    }

    return walk(value, '')
}

export const pickBestProductArray = (candidates: JsonArrayCandidate[]) =>
    candidates.sort((left, right) => right.score - left.score)[0] ?? null

export const detectJsonArrayPath = (parsed: unknown): { path: string; itemCount: number } | null => {
    const best = pickBestProductArray(findProductArrayCandidates(parsed))
    if (!best) return null

    return {
        path: best.path,
        itemCount: best.items.length,
    }
}

const buildExplicitPath = (settings: JsonParserSettings) => {
    const root = settings.rootPath.trim()
    const items = settings.itemsPath.trim()

    if (!root || root.toLowerCase() === 'auto') return ''
    if (!items) return root

    return `${root}.${items}`
}

/** Разрешает массив товаров: явный путь → поиск по ключу → авто. */
export const resolveJsonProductItems = (parsed: unknown, settings: JsonParserSettings): Record<string, unknown>[] => {
    const explicitPath = buildExplicitPath(settings)

    if (explicitPath) {
        let value = getByPath(parsed, explicitPath)

        if (value === undefined && !explicitPath.includes('.')) {
            const discoveredPath = findFirstArrayPathByKey(parsed, explicitPath)
            if (discoveredPath) {
                value = getByPath(parsed, discoveredPath)
            }
        }

        const items = coerceToItems(value)
        if (items.length) return items
    }

    const auto = pickBestProductArray(findProductArrayCandidates(parsed))
    return auto?.items ?? []
}

export const formatJsonPathHint = (path: string, itemCount: number) =>
    path ? `${path} (${itemCount} ${itemCount === 1 ? 'товар' : itemCount < 5 ? 'товара' : 'товаров'})` : ''
