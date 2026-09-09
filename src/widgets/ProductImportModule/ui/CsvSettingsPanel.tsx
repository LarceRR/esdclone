import styles from '../ProductImportModule.module.css'
import type { CsvParserSettings } from '../types'

interface CsvSettingsPanelProps {
    settings: CsvParserSettings
    detectedDelimiterLabel?: string | null
    onChange: (settings: CsvParserSettings) => void
}

export const CsvSettingsPanel = ({ settings, detectedDelimiterLabel, onChange }: CsvSettingsPanelProps) => {
    const patch = (partial: Partial<CsvParserSettings>) => onChange({ ...settings, ...partial })

    return (
        <div className={styles.settingsGroup}>
            <h4 className={styles.settingsGroupTitle}>Настройки CSV</h4>
            <div className={styles.fieldGrid}>
                <div className={styles.field}>
                    <label htmlFor='csv-delimiter'>Разделитель</label>
                    <select
                        id='csv-delimiter'
                        value={settings.delimiter}
                        onChange={(event) =>
                            patch({ delimiter: event.target.value as CsvParserSettings['delimiter'] })
                        }
                    >
                        <option value='auto'>Автоопределение</option>
                        <option value=';'>Точка с запятой (;)</option>
                        <option value=','>Запятая (,)</option>
                        <option value='\t'>Табуляция</option>
                        <option value='|'>Вертикальная черта (|)</option>
                        <option value='custom'>Свой</option>
                    </select>
                    {settings.delimiter === 'auto' && detectedDelimiterLabel ? (
                        <span className={styles.delimiterAutoHint}>
                            Определён: {detectedDelimiterLabel}
                        </span>
                    ) : null}
                </div>
                {settings.delimiter === 'custom' ? (
                    <div className={styles.field}>
                        <label htmlFor='csv-custom-delimiter'>Свой разделитель</label>
                        <input
                            id='csv-custom-delimiter'
                            type='text'
                            maxLength={3}
                            value={settings.customDelimiter}
                            onChange={(event) => patch({ customDelimiter: event.target.value })}
                        />
                    </div>
                ) : null}
                <div className={styles.field}>
                    <label htmlFor='csv-enclosure'>Ограничитель полей</label>
                    <select
                        id='csv-enclosure'
                        value={settings.enclosure}
                        onChange={(event) => patch({ enclosure: event.target.value as CsvParserSettings['enclosure'] })}
                    >
                        <option value='"'>" (двойные кавычки)</option>
                        <option value="'">' (одинарные кавычки)</option>
                    </select>
                </div>
                <div className={styles.field}>
                    <label htmlFor='csv-encoding'>Кодировка</label>
                    <select
                        id='csv-encoding'
                        value={settings.encoding}
                        onChange={(event) => patch({ encoding: event.target.value as CsvParserSettings['encoding'] })}
                    >
                        <option value='utf-8'>UTF-8</option>
                        <option value='windows-1251'>Windows-1251</option>
                        <option value='iso-8859-1'>ISO-8859-1</option>
                        <option value='auto'>Автоопределение</option>
                    </select>
                </div>
                <div className={styles.field}>
                    <label htmlFor='csv-skip'>Пропустить строк (сверху)</label>
                    <input
                        id='csv-skip'
                        type='number'
                        min={0}
                        value={settings.skipRows}
                        onChange={(event) => patch({ skipRows: Math.max(0, Number(event.target.value) || 0) })}
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor='csv-decimal'>Десятичный разделитель</label>
                    <select
                        id='csv-decimal'
                        value={settings.decimalSeparator}
                        onChange={(event) =>
                            patch({ decimalSeparator: event.target.value as CsvParserSettings['decimalSeparator'] })
                        }
                    >
                        <option value='.'>Точка (.)</option>
                        <option value=','>Запятая (,)</option>
                    </select>
                </div>
                <div className={`${styles.field} ${styles.fieldWide}`}>
                    <label htmlFor='csv-date-format'>Формат даты</label>
                    <input
                        id='csv-date-format'
                        type='text'
                        placeholder='YYYY-MM-DD'
                        value={settings.dateFormat}
                        onChange={(event) => patch({ dateFormat: event.target.value })}
                    />
                </div>
                <label className={styles.checkboxField}>
                    <input
                        type='checkbox'
                        checked={settings.firstRowHeader}
                        onChange={(event) => patch({ firstRowHeader: event.target.checked })}
                    />
                    Первая строка — заголовки
                </label>
                <label className={styles.checkboxField}>
                    <input
                        type='checkbox'
                        checked={settings.trimWhitespace}
                        onChange={(event) => patch({ trimWhitespace: event.target.checked })}
                    />
                    Обрезать пробелы
                </label>
                <label className={styles.checkboxField}>
                    <input
                        type='checkbox'
                        checked={settings.skipEmptyLines}
                        onChange={(event) => patch({ skipEmptyLines: event.target.checked })}
                    />
                    Пропускать пустые строки
                </label>
            </div>
        </div>
    )
}

