import styles from '../ProductImportModule.module.css'
import type { XmlParserSettings } from '../types'

interface XmlSettingsPanelProps {
    settings: XmlParserSettings
    onChange: (settings: XmlParserSettings) => void
}

export const XmlSettingsPanel = ({ settings, onChange }: XmlSettingsPanelProps) => {
    const patch = (partial: Partial<XmlParserSettings>) => onChange({ ...settings, ...partial })

    return (
        <div className={styles.settingsGroup}>
            <h4 className={styles.settingsGroupTitle}>Настройки XML</h4>
            <div className={styles.fieldGrid}>
                <div className={`${styles.field} ${styles.fieldWide}`}>
                    <label htmlFor='xml-item-path'>Путь к узлу товара</label>
                    <input
                        id='xml-item-path'
                        type='text'
                        placeholder='catalog/product'
                        value={settings.itemNodePath}
                        onChange={(event) => patch({ itemNodePath: event.target.value })}
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor='xml-encoding'>Кодировка</label>
                    <select
                        id='xml-encoding'
                        value={settings.encoding}
                        onChange={(event) => patch({ encoding: event.target.value as XmlParserSettings['encoding'] })}
                    >
                        <option value='utf-8'>UTF-8</option>
                        <option value='windows-1251'>Windows-1251</option>
                        <option value='auto'>Автоопределение</option>
                    </select>
                </div>
                <div className={styles.field}>
                    <label htmlFor='xml-attr-prefix'>Префикс атрибутов</label>
                    <input
                        id='xml-attr-prefix'
                        type='text'
                        value={settings.attributePrefix}
                        onChange={(event) => patch({ attributePrefix: event.target.value })}
                    />
                </div>
                <label className={styles.checkboxField}>
                    <input
                        type='checkbox'
                        checked={settings.ignoreNamespaces}
                        onChange={(event) => patch({ ignoreNamespaces: event.target.checked })}
                    />
                    Игнорировать пространства имён
                </label>
                <label className={styles.checkboxField}>
                    <input
                        type='checkbox'
                        checked={settings.preserveCdata}
                        onChange={(event) => patch({ preserveCdata: event.target.checked })}
                    />
                    Сохранять CDATA
                </label>
                <label className={styles.checkboxField}>
                    <input
                        type='checkbox'
                        checked={settings.trimValues}
                        onChange={(event) => patch({ trimValues: event.target.checked })}
                    />
                    Обрезать пробелы в значениях
                </label>
            </div>
        </div>
    )
}
