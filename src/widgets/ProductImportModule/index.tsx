import styles from './ProductImportModule.module.css'
import {
    buildAutoMapping,
    DEFAULT_CSV_SETTINGS,
    DEFAULT_JSON_SETTINGS,
    DEFAULT_XML_SETTINGS,
    STORE_PRODUCT_FIELDS,
} from './constants'
import { detectJsonArrayPath, formatJsonPathHint } from './jsonResolve'
import {
    buildFullImportRows,
    buildPreview,
    decodeFileText,
    detectCsvDelimiter,
    detectFormatFromName,
    getCsvDelimiterLabel,
    IMPORT_CHUNK_SIZE,
    mapImportRow,
    MAX_IMPORT_FILE_BYTES,
    MAX_IMPORT_ROWS,
} from './parsePreview'
import { CsvSettingsPanel } from './ui/CsvSettingsPanel'
import { DataPreviewTable } from './ui/DataPreviewTable'
import { FieldMappingTable } from './ui/FieldMappingTable'
import { FileUploadZone } from './ui/FileUploadZone'
import { JsonSettingsPanel } from './ui/JsonSettingsPanel'
import { XmlSettingsPanel } from './ui/XmlSettingsPanel'
import type { CsvParserSettings, ImportFileMeta, ImportPreview, JsonParserSettings, XmlParserSettings } from './types'
import {
    downloadImportErrors,
    dryRunImport,
    finishImport,
    getImportStatus,
    sendChunk,
    startImport,
} from '@/shared/api/list/productImportApi'
import { ELinks } from '@/shared/constants/appLinks.ts'
import { goodsApi } from '@/shared/api/list/goodsApi'
import { warehouseApi } from '@/shared/api/list/warehouseApi'
import { store } from '@/shared/store'
import { useToast } from '@/shared/lib/hooks/toast'
import { useSetPageTitle } from '@/shared/lib/pageTitle/PageTitleContext.tsx'
import { PageLoader } from '@/shared/ui/PageLoader'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const ProductImportModule = () => {
    useSetPageTitle('Импорт товаров')
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()
    const [fileMeta, setFileMeta] = useState<ImportFileMeta | null>(null)
    const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null)
    const [rawText, setRawText] = useState('')
    const [csvSettings, setCsvSettings] = useState<CsvParserSettings>(DEFAULT_CSV_SETTINGS)
    const [jsonSettings, setJsonSettings] = useState<JsonParserSettings>(DEFAULT_JSON_SETTINGS)
    const [xmlSettings, setXmlSettings] = useState<XmlParserSettings>(DEFAULT_XML_SETTINGS)
    const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({})
    const [updateKeyField, setUpdateKeyField] = useState<'sku' | 'name'>('sku')
    const [importMode, setImportMode] = useState<'create' | 'update' | 'upsert'>('upsert')
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [errorsImportId, setErrorsImportId] = useState<number | null>(null)
    const [isDownloadingErrors, setIsDownloadingErrors] = useState(false)
    const [isImporting, setIsImporting] = useState(false)
    const [importProgress, setImportProgress] = useState<{ processed: number; total: number } | null>(null)

    const fileEncoding = useMemo(() => {
        if (!fileMeta) return 'utf-8' as const
        if (fileMeta.format === 'csv') return csvSettings.encoding
        if (fileMeta.format === 'xml') return xmlSettings.encoding
        return 'utf-8' as const
    }, [fileMeta, csvSettings.encoding, xmlSettings.encoding])

    useEffect(() => {
        if (!fileMeta || !fileBuffer) return

        const encoding =
            fileMeta.format === 'csv' ? csvSettings.encoding : fileMeta.format === 'xml' ? xmlSettings.encoding : 'utf-8'

        setRawText(decodeFileText(fileBuffer, encoding))
    }, [fileMeta, fileBuffer, csvSettings.encoding, xmlSettings.encoding])

    const detectedJsonArrayHint = useMemo(() => {
        if (fileMeta?.format !== 'json' || !rawText) return null

        try {
            const parsed = JSON.parse(rawText) as unknown
            const detected = detectJsonArrayPath(parsed)
            return detected ? formatJsonPathHint(detected.path, detected.itemCount) : null
        } catch {
            return null
        }
    }, [fileMeta, rawText])

    const detectedCsvDelimiterLabel = useMemo(() => {
        if (fileMeta?.format !== 'csv' || !rawText) return null
        const detected = detectCsvDelimiter(
            rawText,
            csvSettings.enclosure,
            csvSettings.skipRows,
            csvSettings.skipEmptyLines,
        )
        return getCsvDelimiterLabel(detected)
    }, [fileMeta, rawText, csvSettings.enclosure, csvSettings.skipRows, csvSettings.skipEmptyLines])

    const preview = useMemo<ImportPreview>(() => {
        if (!fileMeta || !rawText) {
            return { columns: [], rows: [], totalRows: 0 }
        }
        return buildPreview(fileMeta.format, rawText, csvSettings, jsonSettings, xmlSettings)
    }, [fileMeta, rawText, csvSettings, jsonSettings, xmlSettings])

    useEffect(() => {
        if (!preview.columns.length) return
        setFieldMapping((prev) => {
            const hasMapped = Object.values(prev).some(Boolean)
            if (hasMapped) return prev
            return buildAutoMapping(preview.columns)
        })
    }, [preview.columns])

    const mappedRequiredCount = STORE_PRODUCT_FIELDS.filter(
        (field) => field.required && fieldMapping[field.id],
    ).length
    const requiredCount = STORE_PRODUCT_FIELDS.filter((field) => field.required).length
    const canImport = Boolean(fileMeta) && mappedRequiredCount === requiredCount && !isImporting

    const decimalSeparator = fileMeta?.format === 'csv' ? csvSettings.decimalSeparator : '.'

    const buildMappedRows = () => {
        if (!fileMeta || !rawText) return []

        const full = buildFullImportRows(fileMeta.format, rawText, csvSettings, jsonSettings, xmlSettings)
        return full.rows.map((row) => mapImportRow(row, fieldMapping, decimalSeparator))
    }

    const handleFileSelect = (file: File) => {
        const format = detectFormatFromName(file.name)
        if (!format) {
            TOAST_ERROR('Поддерживаются только CSV, JSON и XML')
            return
        }

        if (file.size > MAX_IMPORT_FILE_BYTES) {
            TOAST_ERROR('Файл больше 10 МБ. Разбейте файл на части.')
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            const buffer = reader.result
            if (!(buffer instanceof ArrayBuffer)) return

            const encoding =
                format === 'csv' ? csvSettings.encoding : format === 'xml' ? xmlSettings.encoding : 'utf-8'
            const text = decodeFileText(buffer, encoding)

            const quickPreview = buildPreview(
                format,
                text,
                format === 'csv' ? csvSettings : DEFAULT_CSV_SETTINGS,
                format === 'json' ? jsonSettings : DEFAULT_JSON_SETTINGS,
                format === 'xml' ? xmlSettings : DEFAULT_XML_SETTINGS,
            )

            if (quickPreview.totalRows > MAX_IMPORT_ROWS) {
                TOAST_ERROR('В файле больше 10 000 строк. Разбейте файл на части.')
                return
            }

            setRawText(text)
            setFileBuffer(buffer)
            setFileMeta({
                name: file.name,
                size: file.size,
                format,
            })

            if (format === 'csv') {
                setCsvSettings({ ...DEFAULT_CSV_SETTINGS })
            }
            if (format === 'json') {
                try {
                    const parsed = JSON.parse(text) as unknown
                    const detected = detectJsonArrayPath(parsed)
                    setJsonSettings({
                        ...DEFAULT_JSON_SETTINGS,
                        rootPath: detected?.path ?? 'auto',
                        itemsPath: '',
                    })
                } catch {
                    setJsonSettings({ ...DEFAULT_JSON_SETTINGS })
                }
            }
            setFieldMapping({})
            setStatusMessage(null)
            setErrorsImportId(null)
            setImportProgress(null)
        }
        reader.readAsArrayBuffer(file)
    }

    const clearFile = () => {
        setFileMeta(null)
        setFileBuffer(null)
        setRawText('')
        setFieldMapping({})
        setStatusMessage(null)
        setErrorsImportId(null)
        setImportProgress(null)
    }

    const handleMappingChange = (fieldId: string, column: string) => {
        setFieldMapping((prev) => ({ ...prev, [fieldId]: column }))
    }

    const handleDryRun = async () => {
        if (!fileMeta) return

        try {
            setIsImporting(true)
            const rows = buildMappedRows().slice(0, IMPORT_CHUNK_SIZE)
            const response = await dryRunImport({
                mode: importMode,
                update_key: updateKeyField,
                rows,
            })

            const { created, updated, skipped, to_catalog, to_shop, errors } = response.data
            setStatusMessage(
                `Пробный прогон (первые ${rows.length} строк): создать ${created}, обновить ${updated}, пропустить ${skipped}. На склад: ${to_catalog}, в магазин: ${to_shop}. Ошибок: ${errors.length}.`,
            )
        } catch (error) {
            TOAST_ERROR(error instanceof Error ? error.message : 'Ошибка пробного прогона')
        } finally {
            setIsImporting(false)
        }
    }

    const handleImport = async () => {
        if (!canImport || !fileMeta) return

        const rows = buildMappedRows()

        if (rows.length > MAX_IMPORT_ROWS) {
            TOAST_ERROR('В файле больше 10 000 строк')
            return
        }

        setIsImporting(true)
        setStatusMessage(null)
        setErrorsImportId(null)
        setImportProgress({ processed: 0, total: rows.length })

        try {
            const startResponse = await startImport({
                file_name: fileMeta.name,
                file_format: fileMeta.format,
                mode: importMode,
                update_key: updateKeyField,
                total_rows: rows.length,
            })

            const importId = startResponse.data.import_id
            const chunks: typeof rows[] = []

            for (let index = 0; index < rows.length; index += IMPORT_CHUNK_SIZE) {
                chunks.push(rows.slice(index, index + IMPORT_CHUNK_SIZE))
            }

            let needsPolling = rows.length > 500

            for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex += 1) {
                const chunkResponse = await sendChunk({
                    import_id: importId,
                    chunk_index: chunkIndex,
                    rows: chunks[chunkIndex],
                })

                if (chunkResponse.data.queued) {
                    needsPolling = true
                } else {
                    setImportProgress({
                        processed: chunkResponse.data.processed_rows,
                        total: rows.length,
                    })
                }
            }

            if (needsPolling) {
                while (true) {
                    const statusResponse = await getImportStatus(importId)
                    setImportProgress({
                        processed: statusResponse.data.processed_rows,
                        total: rows.length,
                    })

                    if (statusResponse.data.processed_rows >= rows.length) {
                        break
                    }

                    if (statusResponse.data.status === 'failed') {
                        throw new Error('Импорт завершился с ошибкой')
                    }

                    await sleep(2000)
                }
            }

            const finishResponse = await finishImport({ import_id: importId })
            const data = finishResponse.data
            const summary = `Создано ${data.created}, обновлено ${data.updated}, пропущено ${data.skipped}. На склад: ${data.to_catalog}, в магазин: ${data.to_shop}.`

            setStatusMessage(summary)
            setImportProgress({ processed: data.processed_rows, total: data.total_rows })

            if (data.errors_count > 0) {
                setErrorsImportId(importId)
            }

            store.dispatch(goodsApi.util.invalidateTags(['GoodsList']))
            store.dispatch(warehouseApi.util.invalidateTags(['Warehouse']))

            TOAST_SUCCESS(data.status === 'completed' ? 'Импорт завершён' : 'Импорт завершён с предупреждениями')
        } catch (error) {
            TOAST_ERROR(error instanceof Error ? error.message : 'Ошибка импорта')
        } finally {
            setIsImporting(false)
        }
    }

    const handleDownloadErrors = async () => {
        if (!errorsImportId) return

        try {
            setIsDownloadingErrors(true)
            await downloadImportErrors(errorsImportId)
        } catch (error) {
            TOAST_ERROR(error instanceof Error ? error.message : 'Не удалось скачать отчёт')
        } finally {
            setIsDownloadingErrors(false)
        }
    }

    const progressPercent =
        importProgress && importProgress.total > 0
            ? Math.min(100, Math.round((importProgress.processed / importProgress.total) * 100))
            : 0

    return (
        <div className={styles.ProductImportModule}>
            {isImporting ? <PageLoader active={isImporting} /> : null}

            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>Загрузка файла</h2>
                <p className={styles.panelHint}>
                    Загрузите CSV, JSON или XML с товарами (до 10 МБ, до 10 000 строк). После загрузки откроются
                    настройки парсера и сопоставление полей.
                </p>
                <FileUploadZone onFileSelect={handleFileSelect} />
            </section>

            {fileMeta ? (
                <>
                    <section className={styles.panel}>
                        <div className={styles.fileMeta}>
                            <span className={styles.formatBadge}>{fileMeta.format}</span>
                            <span className={styles.fileName}>{fileMeta.name}</span>
                            <span className={styles.fileSize}>{formatBytes(fileMeta.size)}</span>
                            <button
                                className={styles.clearFileButton}
                                type='button'
                                onClick={clearFile}
                                disabled={isImporting}
                            >
                                Удалить файл
                            </button>
                        </div>

                        <div className={styles.workspace}>
                            <div className={styles.settingsStack}>
                                {fileMeta.format === 'csv' ? (
                                    <CsvSettingsPanel
                                        settings={csvSettings}
                                        detectedDelimiterLabel={detectedCsvDelimiterLabel}
                                        onChange={setCsvSettings}
                                    />
                                ) : null}
                                {fileMeta.format === 'json' ? (
                                    <JsonSettingsPanel
                                        settings={jsonSettings}
                                        detectedArrayHint={detectedJsonArrayHint}
                                        onChange={setJsonSettings}
                                    />
                                ) : null}
                                {fileMeta.format === 'xml' ? (
                                    <XmlSettingsPanel
                                        settings={xmlSettings}
                                        onChange={setXmlSettings}
                                    />
                                ) : null}

                                <div className={styles.settingsGroup}>
                                    <h4 className={styles.settingsGroupTitle}>Общие параметры импорта</h4>
                                    <div className={styles.fieldGrid}>
                                        <div className={styles.field}>
                                            <label htmlFor='import-mode'>Режим импорта</label>
                                            <select
                                                id='import-mode'
                                                value={importMode}
                                                onChange={(event) =>
                                                    setImportMode(event.target.value as typeof importMode)
                                                }
                                                disabled={isImporting}
                                            >
                                                <option value='upsert'>Создавать и обновлять</option>
                                                <option value='create'>Только создавать</option>
                                                <option value='update'>Только обновлять</option>
                                            </select>
                                        </div>
                                        <div className={styles.field}>
                                            <label htmlFor='update-key'>Ключ обновления</label>
                                            <select
                                                id='update-key'
                                                value={updateKeyField}
                                                onChange={(event) =>
                                                    setUpdateKeyField(event.target.value as typeof updateKeyField)
                                                }
                                                disabled={isImporting}
                                            >
                                                <option value='sku'>Артикул (SKU)</option>
                                                <option value='name'>Название товара</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.workspaceBlock}>
                                <h3 className={styles.panelTitle}>Превью данных</h3>
                                <p className={styles.panelHint}>
                                    Первые {preview.rows.length} строк файла после применения настроек парсера. Всего
                                    строк: {preview.totalRows}. Кодировка: {fileEncoding}.
                                </p>
                                <DataPreviewTable preview={preview} />
                            </div>
                        </div>
                    </section>

                    <section className={styles.panel}>
                        <h3 className={styles.panelTitle}>Сопоставление полей</h3>
                        <p className={styles.panelHint}>
                            Укажите, какие колонки из файла соответствуют полям товара. Обязательные поля отмечены
                            звёздочкой.
                        </p>
                        <FieldMappingTable
                            preview={preview}
                            mapping={fieldMapping}
                            onChange={handleMappingChange}
                        />
                    </section>

                    <section className={styles.panel}>
                        {importProgress ? (
                            <div className={styles.progressBlock}>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                                <p className={styles.panelHint}>
                                    Обработано {importProgress.processed} из {importProgress.total} ({progressPercent}
                                    %)
                                </p>
                            </div>
                        ) : null}
                        {statusMessage ? <p className={styles.panelHint}>{statusMessage}</p> : null}
                        {errorsImportId ? (
                            <p className={styles.panelHint}>
                                <button
                                    className={styles.linkButton}
                                    type='button'
                                    disabled={isDownloadingErrors}
                                    onClick={handleDownloadErrors}
                                >
                                    {isDownloadingErrors ? 'Скачивание…' : 'Скачать отчёт об ошибках'}
                                </button>
                            </p>
                        ) : null}
                        {statusMessage && !isImporting ? (
                            <p className={styles.panelHint}>
                                Товары на складе: <Link to={ELinks.PRODUCT_WAREHOUSE}>/product/warehouse</Link>
                            </p>
                        ) : null}
                        <div className={styles.actionsRow}>
                            <button
                                className={styles.secondaryAction}
                                type='button'
                                disabled={!fileMeta || isImporting}
                                onClick={handleDryRun}
                            >
                                Пробный прогон
                            </button>
                            <button
                                className={styles.primaryAction}
                                type='button'
                                disabled={!canImport}
                                onClick={handleImport}
                            >
                                Импортировать товары
                            </button>
                        </div>
                    </section>
                </>
            ) : null}
        </div>
    )
}

export default ProductImportModule
