import React, { ChangeEvent } from 'react'
import { Button } from '@mui/material'
import * as XLSX from 'xlsx'
import { ProductItem } from '@/entities/sales/OrdersTable'
import type { OrderCatalogProduct } from '@/entities/sales/OrdersTable/lib/mapOrderProduct'

interface XlsParserProps {
    goodsData: OrderCatalogProduct[]
    setEditedProducts: React.Dispatch<React.SetStateAction<ProductItem[] | null>>
}

export const XlsParser: React.FC<XlsParserProps> = ({ goodsData, setEditedProducts }) => {
    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (evt) => {
            const bstr = evt.target?.result
            if (!bstr) return

            const workbook = XLSX.read(bstr, { type: 'binary' })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]

            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

            const itemsToAdd: ProductItem[] = jsonData.map((row) => {
                // считаем возможные заголовки столбца с названием
                const titleRaw = row['Наименование'] ?? row['Name'] ?? row['Title'] ?? ''
                const qtyRaw = row['Количество'] ?? row['Quantity'] ?? 1
                const quantity = Number(qtyRaw) >= 0 ? Number(qtyRaw) : 0

                // ищем товар в goodsData по title
                const found = goodsData.find((g) => g.title.trim().toLowerCase() === String(titleRaw).trim().toLowerCase())
                // если нашли в базе — берем оригинальный объект
                if (found) {
                    return { quantity, product: found } as ProductItem
                } else {
                    // не нашли — создаем заглушку с id=0
                    const placeholder: OrderCatalogProduct = {
                        id: 0,
                        title: String(titleRaw),
                        cash: 0,
                        image: '',
                    }
                    return { quantity, product: placeholder }
                }
            })

            setEditedProducts((prev) => {
                const base = prev ?? []
                const updatedBase = [...base]
                const newItems: ProductItem[] = []

                itemsToAdd.forEach((item) => {
                    const id = item.product?.id ?? 0
                    const baseIndex = updatedBase.findIndex((bi) => bi.product?.id === id)

                    if (baseIndex !== -1) {
                        // существующий товар – суммируем количество
                        const existing = updatedBase[baseIndex]
                        updatedBase[baseIndex] = {
                            product: existing.product,
                            quantity: existing.quantity + item.quantity,
                        }
                    } else {
                        // новый товар – добавляем как есть
                        newItems.push(item)
                    }
                })

                return [...updatedBase, ...newItems]
            })
        }

        reader.readAsBinaryString(file)
        e.target.value = ''
    }

    return (
        <>
            <input
                id='xls-file-input'
                type='file'
                accept='.xls,.xlsx'
                style={{ display: 'none' }}
                onChange={handleFileUpload}
            />
            <label htmlFor='xls-file-input'>
                <Button
                    variant='contained'
                    component='span'
                    size='medium'
                >
                    Импорт продукции (xls/xlsx)
                </Button>
            </label>
        </>
    )
}
