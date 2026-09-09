import styles from '../ProductImportModule.module.css'
import { STORE_PRODUCT_FIELDS } from '../constants'
import type { ImportPreview } from '../types'

interface FieldMappingTableProps {
    preview: ImportPreview
    mapping: Record<string, string>
    onChange: (fieldId: string, column: string) => void
}

export const FieldMappingTable = ({ preview, mapping, onChange }: FieldMappingTableProps) => {
    const columnOptions = ['', ...preview.columns]

    return (
        <div className={styles.mappingTableWrap}>
            <table className={styles.mappingTable}>
                <thead>
                    <tr>
                        <th>Поле магазина</th>
                        <th>Поле из файла</th>
                        <th>Пример значения</th>
                    </tr>
                </thead>
                <tbody>
                    {STORE_PRODUCT_FIELDS.map((field) => {
                        const mappedColumn = mapping[field.id] ?? ''
                        const sampleRow = preview.rows[0]
                        const sampleValue = mappedColumn && sampleRow ? sampleRow[mappedColumn] : '—'

                        return (
                            <tr key={field.id}>
                                <td>
                                    {field.label}
                                    {field.required ? <span className={styles.requiredMark}> *</span> : null}
                                </td>
                                <td>
                                    <select
                                        className={styles.mappingSelect}
                                        value={mappedColumn}
                                        onChange={(event) => onChange(field.id, event.target.value)}
                                    >
                                        <option value=''>Не сопоставлять</option>
                                        {columnOptions
                                            .filter(Boolean)
                                            .map((column) => (
                                                <option
                                                    value={column}
                                                    key={column}
                                                >
                                                    {column}
                                                </option>
                                            ))}
                                    </select>
                                </td>
                                <td className={styles.sampleValue}>{sampleValue || '—'}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
