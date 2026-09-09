import styles from '../ProductImportModule.module.css'
import type { JsonParserSettings } from '../types'

interface JsonSettingsPanelProps {
    settings: JsonParserSettings
    detectedArrayHint?: string | null
    onChange: (settings: JsonParserSettings) => void
}

export const JsonSettingsPanel = ({ settings, detectedArrayHint, onChange }: JsonSettingsPanelProps) => {
    const patch = (partial: Partial<JsonParserSettings>) => onChange({ ...settings, ...partial })
    const isAutoPath = !settings.rootPath.trim() || settings.rootPath.trim().toLowerCase() === 'auto'

    return (
        <div className={styles.settingsGroup}>
            <h4 className={styles.settingsGroupTitle}>Настройки JSON</h4>
            <div className={styles.fieldGrid}>
                <div className={`${styles.field} ${styles.fieldWide}`}>
                    <label htmlFor='json-array-path'>Ключ или путь к массиву товаров</label>
                    <input
                        id='json-array-path'
                        type='text'
                        placeholder='auto, products, data.items'
                        value={settings.rootPath}
                        onChange={(event) => patch({ rootPath: event.target.value })}
                    />
                    {isAutoPath && detectedArrayHint ? (
                        <span className={styles.delimiterAutoHint}>Найден: {detectedArrayHint}</span>
                    ) : null}
                    {!isAutoPath ? (
                        <span className={styles.fieldHelp}>
                            Укажите ключ (например, products) или путь через точку (data.catalog.items). Поиск
                            идёт по первому подходящему вхождению.
                        </span>
                    ) : (
                        <span className={styles.fieldHelp}>
                            Авто: ищем массив объектов с полями вроде title, sku, price, stock и т.п.
                        </span>
                    )}
                </div>
                <label className={styles.checkboxField}>
                    <input
                        type='checkbox'
                        checked={settings.flattenNested}
                        onChange={(event) => patch({ flattenNested: event.target.checked })}
                    />
                    Разворачивать вложенные объекты
                </label>
                <label className={styles.checkboxField}>
                    <input
                        type='checkbox'
                        checked={settings.strictSchema}
                        onChange={(event) => patch({ strictSchema: event.target.checked })}
                    />
                    Строгая схема (ошибка при несовпадении)
                </label>
                <label className={styles.checkboxField}>
                    <input
                        type='checkbox'
                        checked={settings.ignoreUnknownFields}
                        onChange={(event) => patch({ ignoreUnknownFields: event.target.checked })}
                    />
                    Игнорировать неизвестные поля
                </label>
                <label className={styles.checkboxField}>
                    <input
                        type='checkbox'
                        checked={settings.mergeArrays}
                        onChange={(event) => patch({ mergeArrays: event.target.checked })}
                    />
                    Объединять массивы в одну строку
                </label>
            </div>
        </div>
    )
}
