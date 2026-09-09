import type {
    CsvDelimiterValue,
    CsvParserSettings,
    ImportFileFormat,
    ImportPreview,
    JsonParserSettings,
    XmlParserSettings,
} from './types'
import { resolveJsonProductItems } from './jsonResolve'
import { IMPORT_FIELD_ALIASES } from './constants'

const PREVIEW_LIMIT = 4
export const MAX_IMPORT_FILE_BYTES = 10 * 1024 * 1024
export const MAX_IMPORT_ROWS = 10_000
export const IMPORT_CHUNK_SIZE = 200

export const detectFormatFromName = (fileName: string): ImportFileFormat | null => {
    const lower = fileName.toLowerCase()
    if (lower.endsWith('.csv')) return 'csv'
    if (lower.endsWith('.json')) return 'json'
    if (lower.endsWith('.xml')) return 'xml'
    return null
}

export const decodeFileText = (
    buffer: ArrayBuffer,
    encoding: 'utf-8' | 'windows-1251' | 'iso-8859-1' | 'auto',
): string => {
    if (encoding === 'auto') {
        const bytes = new Uint8Array(buffer)
        if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
            return new TextDecoder('utf-8').decode(buffer.slice(3))
        }

        const utf8 = new TextDecoder('utf-8').decode(buffer)
        if (!utf8.includes('\uFFFD')) {
            return utf8
        }

        return new TextDecoder('windows-1251').decode(buffer)
    }

    const label = encoding === 'windows-1251' ? 'windows-1251' : encoding === 'iso-8859-1' ? 'iso-8859-1' : 'utf-8'
    return new TextDecoder(label).decode(buffer)
}

export const parseMoney = (value: string, decimalSeparator: '.' | ','): number | null => {
    const trimmed = value.trim()
    if (!trimmed) return null

    const normalized =
        decimalSeparator === ','
            ? trimmed.replace(/\s/g, '').replace(',', '.')
            : trimmed.replace(/\s/g, '').replace(/,(?=\d{3}\b)/g, '')

    const parsed = Number.parseFloat(normalized)
    return Number.isFinite(parsed) ? parsed : null
}

export interface ImportRowPayload {
    name?: string
    sku?: string
    description?: string
    purchasePrice?: number | null
    sellingPrice?: number | null
    status?: string
    category?: string
    subCategory?: string
    imageUrl?: string
    stock?: number | null
}

export const mapImportRow = (
    row: Record<string, string>,
    fieldMapping: Record<string, string>,
    decimalSeparator: '.' | ',',
): ImportRowPayload => {
    const resolveValue = (fieldId: string): string => {
        const mappedColumn = fieldMapping[fieldId]
        if (mappedColumn) {
            const mapped = row[mappedColumn]
            if (mapped !== undefined && mapped !== null && String(mapped).trim() !== '') {
                return String(mapped)
            }
        }

        const aliases = IMPORT_FIELD_ALIASES[fieldId] ?? []
        for (const [key, value] of Object.entries(row)) {
            if (value === undefined || value === null || String(value).trim() === '') {
                continue
            }

            const normalized = key.trim().toLowerCase()
            const matched = aliases.some(
                (alias) => normalized === alias || normalized.includes(alias) || alias.includes(normalized),
            )

            if (matched) {
                return String(value)
            }
        }

        return mappedColumn ? String(row[mappedColumn] ?? '') : ''
    }

    const stockRaw = resolveValue('stock').replace(/\s/g, '')

    return {
        name: resolveValue('name').trim(),
        sku: resolveValue('sku').trim(),
        description: resolveValue('description').trim() || undefined,
        purchasePrice: parseMoney(resolveValue('purchasePrice'), decimalSeparator),
        sellingPrice: parseMoney(resolveValue('sellingPrice'), decimalSeparator),
        status: resolveValue('status').trim() || undefined,
        category: resolveValue('category').trim() || undefined,
        subCategory: resolveValue('subCategory').trim() || undefined,
        imageUrl: resolveValue('imageUrl').trim() || undefined,
        stock: stockRaw ? Number.parseInt(stockRaw, 10) : undefined,
    }
}

const DELIMITER_CANDIDATES: { value: CsvDelimiterValue; char: string }[] = [
    { value: ';', char: ';' },
    { value: ',', char: ',' },
    { value: '\t', char: '\t' },
    { value: '|', char: '|' },
]

const getSampleCsvLines = (text: string, skipRows: number, skipEmptyLines: boolean, limit = 8) =>
    text
        .split(/\r?\n/)
        .filter((line, index) => {
            if (skipEmptyLines && !line.trim()) return false
            if (index < skipRows) return false
            return true
        })
        .slice(0, limit)

const scoreDelimiter = (lines: string[], delimiter: string, enclosure: string) => {
    if (!lines.length) return 0

    const fieldCounts = lines.map((line) => parseCsvLine(line, delimiter, enclosure).length)
    const maxCount = Math.max(...fieldCounts)

    if (maxCount <= 1) return 0

    const mode = fieldCounts.reduce(
        (best, count) => {
            const entries = best.map.get(count) ?? 0
            best.map.set(count, entries + 1)
            if (entries + 1 > best.maxFreq || (entries + 1 === best.maxFreq && count > best.value)) {
                return { map: best.map, maxFreq: entries + 1, value: count }
            }
            return best
        },
        { map: new Map<number, number>(), maxFreq: 0, value: 0 },
    ).value

    if (mode <= 1) return 0

    const matchingLines = fieldCounts.filter((count) => count === mode).length
    const consistencyRatio = matchingLines / fieldCounts.length

    return mode * 1000 + consistencyRatio * 100 - Math.abs(maxCount - mode) * 10
}

export const detectCsvDelimiter = (
    text: string,
    enclosure: CsvParserSettings['enclosure'],
    skipRows = 0,
    skipEmptyLines = true,
): CsvDelimiterValue => {
    const lines = getSampleCsvLines(text, skipRows, skipEmptyLines)
    if (!lines.length) return ';'

    let bestDelimiter: CsvDelimiterValue = ';'
    let bestScore = -1

    DELIMITER_CANDIDATES.forEach((candidate) => {
        const score = scoreDelimiter(lines, candidate.char, enclosure)
        if (score > bestScore) {
            bestScore = score
            bestDelimiter = candidate.value
        }
    })

    return bestDelimiter
}

export const getCsvDelimiterLabel = (delimiter: CsvParserSettings['delimiter'], customDelimiter = '') => {
    if (delimiter === 'auto') return 'Автоопределение'
    if (delimiter === 'custom') return customDelimiter ? `Свой (${customDelimiter})` : 'Свой'
    if (delimiter === '\t') return 'Табуляция'
    if (delimiter === ';') return 'Точка с запятой (;)'
    if (delimiter === '|') return 'Вертикальная черта (|)'
    return 'Запятая (,)'
}

const resolveDelimiter = (text: string, settings: CsvParserSettings) => {
    if (settings.delimiter === 'auto') {
        return detectCsvDelimiter(text, settings.enclosure, settings.skipRows, settings.skipEmptyLines)
    }
    if (settings.delimiter === 'custom') {
        return settings.customDelimiter || ','
    }
    if (settings.delimiter === '\t') return '\t'
    return settings.delimiter
}

const parseCsvLine = (line: string, delimiter: string, enclosure: string): string[] => {
    const values: string[] = []
    let current = ''
    let inQuotes = false

    for (let index = 0; index < line.length; index += 1) {
        const char = line[index]
        const next = line[index + 1]

        if (char === enclosure) {
            if (inQuotes && next === enclosure) {
                current += enclosure
                index += 1
            } else {
                inQuotes = !inQuotes
            }
            continue
        }

        if (char === delimiter && !inQuotes) {
            values.push(current)
            current = ''
            continue
        }

        current += char
    }

    values.push(current)
    return values
}

export const mapColumnsToRows = (columns: string[], dataLines: string[][]): Record<string, string>[] =>
    dataLines.map((line) => {
        const row: Record<string, string> = {}
        columns.forEach((column, index) => {
            row[column] = line[index] ?? ''
        })
        return row
    })

const parseCsvTable = (text: string, settings: CsvParserSettings) => {
    const delimiter = resolveDelimiter(text, settings)
    const lines = getSampleCsvLines(text, settings.skipRows, settings.skipEmptyLines, Number.POSITIVE_INFINITY)

    if (!lines.length) {
        return { columns: [] as string[], dataLines: [] as string[][] }
    }

    const parsedLines = lines.map((line) =>
        parseCsvLine(line, delimiter, settings.enclosure).map((value) =>
            settings.trimWhitespace ? value.trim() : value,
        ),
    )

    const headerRow = settings.firstRowHeader
        ? parsedLines[0]
        : parsedLines[0].map((_, index) => `column_${index + 1}`)
    const dataLines = settings.firstRowHeader ? parsedLines.slice(1) : parsedLines
    const columns = headerRow.map((header, index) => header || `column_${index + 1}`)

    return { columns, dataLines }
}

export const buildCsvPreview = (text: string, settings: CsvParserSettings): ImportPreview => {
    const { columns, dataLines } = parseCsvTable(text, settings)

    if (!columns.length) {
        return { columns: [], rows: [], totalRows: 0 }
    }

    const rows = mapColumnsToRows(columns, dataLines).slice(0, PREVIEW_LIMIT)

    return {
        columns,
        rows,
        totalRows: dataLines.length,
    }
}

const flattenObject = (value: Record<string, unknown>, prefix = ''): Record<string, string> => {
    const result: Record<string, string> = {}

    Object.entries(value).forEach(([key, nested]) => {
        const path = prefix ? `${prefix}.${key}` : key
        if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
            Object.assign(result, flattenObject(nested as Record<string, unknown>, path))
        } else if (Array.isArray(nested)) {
            result[path] = nested.map((item) => String(item)).join(', ')
        } else {
            result[path] = nested == null ? '' : String(nested)
        }
    })

    return result
}

const parseJsonTable = (text: string, settings: JsonParserSettings) => {
    const parsed = JSON.parse(text) as unknown
    const items = resolveJsonProductItems(parsed, settings)

    const rows = items.map((item) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
            return settings.flattenNested
                ? flattenObject(item as Record<string, unknown>)
                : Object.fromEntries(
                      Object.entries(item as Record<string, unknown>).map(([key, value]) => [key, String(value ?? '')]),
                  )
        }
        return { value: String(item ?? '') }
    })

    const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))))

    return { columns, rows }
}

export const buildJsonPreview = (text: string, settings: JsonParserSettings): ImportPreview => {
    try {
        const { columns, rows } = parseJsonTable(text, settings)

        return {
            columns,
            rows: rows.slice(0, PREVIEW_LIMIT),
            totalRows: rows.length,
        }
    } catch {
        return { columns: [], rows: [], totalRows: 0 }
    }
}

const parseXmlTable = (text: string, settings: XmlParserSettings) => {
    const parser = new DOMParser()
    const document = parser.parseFromString(text, 'text/xml')
    if (document.querySelector('parsererror')) {
        return { columns: [] as string[], rows: [] as Record<string, string>[] }
    }

    const pathParts = settings.itemNodePath.split('/').filter(Boolean)
    let nodes: Element[] = [document.documentElement]

    pathParts.forEach((part) => {
        nodes = nodes.flatMap((node) => Array.from(node.getElementsByTagName(part)))
    })

    const rows = nodes.map((node) => {
        const row: Record<string, string> = {}

        Array.from(node.children).forEach((child) => {
            const value = settings.trimValues ? child.textContent?.trim() ?? '' : child.textContent ?? ''
            row[child.tagName] = value
        })

        Array.from(node.attributes).forEach((attribute) => {
            row[`${settings.attributePrefix}${attribute.name}`] = attribute.value
        })

        if (!Object.keys(row).length) {
            row.value = settings.trimValues ? node.textContent?.trim() ?? '' : node.textContent ?? ''
        }

        return row
    })

    const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))))

    return { columns, rows }
}

export const buildXmlPreview = (text: string, settings: XmlParserSettings): ImportPreview => {
    try {
        const { columns, rows } = parseXmlTable(text, settings)

        return {
            columns,
            rows: rows.slice(0, PREVIEW_LIMIT),
            totalRows: rows.length,
        }
    } catch {
        return { columns: [], rows: [], totalRows: 0 }
    }
}

export const buildPreview = (
    format: ImportFileFormat,
    text: string,
    csv: CsvParserSettings,
    json: JsonParserSettings,
    xml: XmlParserSettings,
): ImportPreview => {
    if (format === 'csv') return buildCsvPreview(text, csv)
    if (format === 'json') return buildJsonPreview(text, json)
    return buildXmlPreview(text, xml)
}

export const buildFullImportRows = (
    format: ImportFileFormat,
    text: string,
    csv: CsvParserSettings,
    json: JsonParserSettings,
    xml: XmlParserSettings,
): ImportPreview => {
    if (format === 'csv') {
        const { columns, dataLines } = parseCsvTable(text, csv)
        return {
            columns,
            rows: mapColumnsToRows(columns, dataLines),
            totalRows: dataLines.length,
        }
    }

    if (format === 'json') {
        try {
            const { columns, rows } = parseJsonTable(text, json)
            return { columns, rows, totalRows: rows.length }
        } catch {
            return { columns: [], rows: [], totalRows: 0 }
        }
    }

    try {
        const { columns, rows } = parseXmlTable(text, xml)
        return { columns, rows, totalRows: rows.length }
    } catch {
        return { columns: [], rows: [], totalRows: 0 }
    }
}
