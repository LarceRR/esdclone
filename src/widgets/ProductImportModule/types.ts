export type ImportFileFormat = 'csv' | 'json' | 'xml'

export interface ImportPreview {
    columns: string[]
    rows: Record<string, string>[]
    totalRows: number
}

export type CsvDelimiterValue = ',' | ';' | '\t' | '|'

export interface CsvParserSettings {
    delimiter: CsvDelimiterValue | 'auto' | 'custom'
    customDelimiter: string
    enclosure: '"' | "'"
    encoding: 'utf-8' | 'windows-1251' | 'iso-8859-1' | 'auto'
    firstRowHeader: boolean
    skipRows: number
    trimWhitespace: boolean
    skipEmptyLines: boolean
    decimalSeparator: '.' | ','
    dateFormat: string
}

export interface JsonParserSettings {
    rootPath: string
    itemsPath: string
    flattenNested: boolean
    strictSchema: boolean
    ignoreUnknownFields: boolean
    mergeArrays: boolean
}

export interface XmlParserSettings {
    itemNodePath: string
    encoding: 'utf-8' | 'windows-1251' | 'auto'
    attributePrefix: string
    ignoreNamespaces: boolean
    preserveCdata: boolean
    trimValues: boolean
}

export interface ImportFileMeta {
    name: string
    size: number
    format: ImportFileFormat
}
