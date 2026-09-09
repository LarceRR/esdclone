import styles from '../ProductImportModule.module.css'
import type { ImportPreview } from '../types'

interface DataPreviewTableProps {
    preview: ImportPreview
}

export const DataPreviewTable = ({ preview }: DataPreviewTableProps) => {
    if (!preview.columns.length) {
        return <div className={styles.emptyState}>Не удалось распознать данные. Проверьте настройки парсера.</div>
    }

    return (
        <>
            <div className={styles.previewMeta}>
                <span className={styles.metaChip}>Колонок: {preview.columns.length}</span>
                <span className={styles.metaChip}>Строк в файле: {preview.totalRows}</span>
                <span className={styles.metaChip}>Превью: {preview.rows.length}</span>
            </div>
            <div className={styles.previewWrap}>
                <table className={styles.previewTable}>
                    <thead>
                        <tr>
                            {preview.columns.map((column) => (
                                <th key={column}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {preview.rows.map((row, rowIndex) => (
                            <tr key={`preview-row-${rowIndex}`}>
                                {preview.columns.map((column) => (
                                    <td key={`${rowIndex}-${column}`}>{row[column] ?? '—'}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
