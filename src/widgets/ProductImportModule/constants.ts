import type { CsvParserSettings, JsonParserSettings, XmlParserSettings } from './types'

export const ACCEPTED_EXTENSIONS = ['.csv', '.json', '.xml'] as const

export const STORE_PRODUCT_FIELDS = [
    { id: 'name', label: 'Название товара', required: true },
    { id: 'sku', label: 'Артикул (SKU)', required: true },
    { id: 'description', label: 'Описание', required: false },
    { id: 'purchasePrice', label: 'Закупочная цена', required: false },
    { id: 'sellingPrice', label: 'Цена продажи', required: false },
    { id: 'category', label: 'Категория', required: false },
    { id: 'subCategory', label: 'Подкатегория', required: false },
    { id: 'stock', label: 'Количество на складе', required: false },
    { id: 'imageUrl', label: 'URL изображения', required: false },
    { id: 'barcode', label: 'Штрихкод', required: false },
    { id: 'brand', label: 'Бренд', required: false },
    { id: 'weight', label: 'Вес', required: false },
    { id: 'status', label: 'Статус', required: false },
] as const

export const DEFAULT_CSV_SETTINGS: CsvParserSettings = {
    delimiter: 'auto',
    customDelimiter: '',
    enclosure: '"',
    encoding: 'utf-8',
    firstRowHeader: true,
    skipRows: 0,
    trimWhitespace: true,
    skipEmptyLines: true,
    decimalSeparator: '.',
    dateFormat: 'YYYY-MM-DD',
}

export const DEFAULT_JSON_SETTINGS: JsonParserSettings = {
    rootPath: 'auto',
    itemsPath: '',
    flattenNested: true,
    strictSchema: false,
    ignoreUnknownFields: true,
    mergeArrays: false,
}

export const DEFAULT_XML_SETTINGS: XmlParserSettings = {
    itemNodePath: 'catalog/product',
    encoding: 'utf-8',
    attributePrefix: '@',
    ignoreNamespaces: true,
    preserveCdata: true,
    trimValues: true,
}

const AUTO_MAP_ALIASES: Record<string, string[]> = {
    name: ['название', 'name', 'title', 'product_name', 'наименование', 'товар'],
    sku: ['sku', 'артикул', 'article', 'vendor_code', 'код'],
    description: ['description', 'описание', 'desc'],
    purchasePrice: ['purchase', 'закуп', 'cost', 'закупочная', 'purchase_price'],
    sellingPrice: ['price', 'цена', 'selling', 'retail', 'цена продажи'],
    category: ['category', 'категория', 'cat'],
    subCategory: ['subcategory', 'подкатегория', 'sub_category'],
    stock: ['stock', 'qty', 'quantity', 'количество', 'остаток'],
    imageUrl: ['image', 'img', 'picture', 'фото', 'image_url'],
    barcode: ['barcode', 'ean', 'штрихкод', 'upc'],
    brand: ['brand', 'бренд', 'manufacturer'],
    weight: ['weight', 'вес', 'mass'],
    status: ['status', 'статус', 'state'],
}

export const IMPORT_FIELD_ALIASES = AUTO_MAP_ALIASES

export const buildAutoMapping = (columns: string[]): Record<string, string> => {
    const mapping: Record<string, string> = {}

    STORE_PRODUCT_FIELDS.forEach((field) => {
        const aliases = AUTO_MAP_ALIASES[field.id] ?? []
        const match = columns.find((column) => {
            const normalized = column.trim().toLowerCase()
            return aliases.some((alias) => normalized.includes(alias) || alias.includes(normalized))
        })
        if (match) {
            mapping[field.id] = match
        }
    })

    return mapping
}
