import React, { ChangeEvent } from 'react'
import { Button } from '@mui/material'
import { ProductItem } from '@/entities/sales/OrdersTable'
import type { OrderCatalogProduct } from '@/entities/sales/OrdersTable/lib/mapOrderProduct'
import { useExportCsvWorkOrderMutation } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'

interface CsvParserProps {
    goodsData: OrderCatalogProduct[]
    setEditedProducts: React.Dispatch<React.SetStateAction<ProductItem[] | null>>
}

export const CsvParser: React.FC<CsvParserProps> = ({ goodsData, setEditedProducts }) => {
    const [exportCsv, { isLoading }] = useExportCsvWorkOrderMutation()
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const form = new FormData()
        form.append('file', file)

        try {
            const response = await exportCsv(form).unwrap()
            const rows: { n: string; name: string; quantity: string }[] = response.data

            TOAST_SUCCESS(response.message)

            // мапим ответ в ProductItem[]
            const itemsToAdd: ProductItem[] = rows.map(({ name, quantity: qty }) => {
                const quantity = Number(qty) >= 0 ? Number(qty) : 0
                const found = goodsData.find((g) => g.title.trim().toLowerCase() === String(name).trim().toLowerCase())
                if (found) {
                    return { product: found, quantity }
                } else {
                    const placeholder: OrderCatalogProduct = {
                        id: 0,
                        title: String(name),
                        cash: 0,
                        image: '',
                    }
                    return { product: placeholder, quantity }
                }
            })

            // объединяем с предыдущими
            setEditedProducts((prev) => {
                const base = prev ?? []
                const updated = [...base]
                const newOnes: ProductItem[] = []

                itemsToAdd.forEach((item) => {
                    const id = item?.product?.id
                    const idx = updated.findIndex((bi) => bi?.product?.id === id)
                    if (idx !== -1) {
                        updated[idx] = {
                            product: updated[idx].product,
                            quantity: updated[idx].quantity + item.quantity,
                        }
                    } else {
                        newOnes.push(item)
                    }
                })

                return [...updated, ...newOnes]
            })
        } catch (err: any) {
            TOAST_ERROR('Ошибка при обработке CSV')
        } finally {
            e.target.value = ''
        }
    }

    return (
        <>
            <input
                id='csv-file-input'
                type='file'
                accept='.csv'
                style={{ display: 'none' }}
                onChange={handleFileUpload}
            />
            <label htmlFor='csv-file-input'>
                <Button
                    variant='contained'
                    component='span'
                    disabled={isLoading}
                    size='medium'
                >
                    {isLoading ? 'Загрузка...' : 'Импорт csv'}
                </Button>
            </label>
        </>
    )
}
