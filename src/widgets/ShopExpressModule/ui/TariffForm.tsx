import { ChangeEvent, useCallback, useEffect, useId, useState } from 'react'
import { Button } from '@mui/material'
import toast from 'react-hot-toast'
import type { ShopExpressTariff, ShopExpressTariffDraft } from '../types'
import styles from './CreateTariffModal.module.css'

type IconMode = 'file' | 'url'

const emptyForm = () => ({
    name: '',
    cost: '',
    durationDays: '30',
    iconUrl: '',
    iconMode: 'file' as IconMode,
})

interface TariffFormProps {
    initialTariff?: ShopExpressTariff
    submitLabel?: string
    onSubmit: (tariff: ShopExpressTariffDraft) => void
    onCancel: () => void
}

export const TariffForm = ({
    initialTariff,
    submitLabel = 'Сохранить',
    onSubmit,
    onCancel,
}: TariffFormProps) => {
    const fileInputId = useId()
    const [form, setForm] = useState(emptyForm)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [iconFile, setIconFile] = useState<File | null>(null)

    const resetForm = useCallback(() => {
        if (initialTariff) {
            const isUrl = initialTariff.iconUrl.startsWith('http') || initialTariff.iconUrl.startsWith('/')
            setForm({
                name: initialTariff.name,
                cost: String(initialTariff.cost),
                durationDays: String(initialTariff.durationDays),
                iconUrl: isUrl && initialTariff.iconUrl.startsWith('http') ? initialTariff.iconUrl : '',
                iconMode: isUrl && initialTariff.iconUrl.startsWith('http') ? 'url' : 'file',
            })
            setPreviewUrl(initialTariff.iconUrl)
            setIconFile(null)
            return
        }
        setForm(emptyForm())
        setPreviewUrl(null)
        setIconFile(null)
    }, [initialTariff])

    useEffect(() => {
        resetForm()
    }, [resetForm])

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith('image/')) {
            toast.error('Выберите файл изображения')
            return
        }
        setIconFile(file)
        setPreviewUrl(URL.createObjectURL(file))
        event.target.value = ''
    }

    const handleUrlChange = (value: string) => {
        setForm((prev) => ({ ...prev, iconUrl: value }))
        setIconFile(null)
        const trimmed = value.trim()
        setPreviewUrl(trimmed || null)
    }

    const handleSave = () => {
        const name = form.name.trim()
        const cost = Number(form.cost)
        const durationDays = Number(form.durationDays)

        if (!name) {
            toast.error('Укажите название тарифа')
            return
        }
        if (!Number.isFinite(cost) || cost < 0) {
            toast.error('Укажите корректную стоимость')
            return
        }
        if (!Number.isFinite(durationDays) || durationDays <= 0 || !Number.isInteger(durationDays)) {
            toast.error('Укажите длительность в целых днях')
            return
        }
        if (!previewUrl) {
            toast.error('Добавьте иконку тарифа')
            return
        }

        const draft: ShopExpressTariffDraft = {
            name,
            cost,
            durationDays,
        }

        if (iconFile) {
            draft.iconFile = iconFile
        } else if (form.iconMode === 'url') {
            draft.iconUrl = form.iconUrl.trim()
        } else if (initialTariff) {
            draft.iconUrl = initialTariff.iconUrl
        }

        onSubmit(draft)
    }

    return (
        <div className={styles.form}>
            <label className={styles.field}>
                <span className={styles.fieldLabel}>Название тарифа</span>
                <input
                    className={styles.input}
                    type='text'
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder='Например, Базовый'
                />
            </label>

            <label className={styles.field}>
                <span className={styles.fieldLabel}>Стоимость</span>
                <input
                    className={styles.input}
                    type='number'
                    min={0}
                    step={0.01}
                    value={form.cost}
                    onChange={(e) => setForm((prev) => ({ ...prev, cost: e.target.value }))}
                    placeholder='0.00'
                />
            </label>

            <label className={styles.field}>
                <span className={styles.fieldLabel}>Длительность (дней)</span>
                <input
                    className={styles.input}
                    type='number'
                    min={1}
                    step={1}
                    value={form.durationDays}
                    onChange={(e) => setForm((prev) => ({ ...prev, durationDays: e.target.value }))}
                    placeholder='30'
                />
            </label>

            <div className={styles.field}>
                <span className={styles.fieldLabel}>Иконка</span>
                <div className={styles.iconModeTabs}>
                    <button
                        type='button'
                        className={form.iconMode === 'file' ? styles.iconModeTabActive : styles.iconModeTab}
                        onClick={() => setForm((prev) => ({ ...prev, iconMode: 'file' }))}
                    >
                        Загрузить с компьютера
                    </button>
                    <button
                        type='button'
                        className={form.iconMode === 'url' ? styles.iconModeTabActive : styles.iconModeTab}
                        onClick={() => setForm((prev) => ({ ...prev, iconMode: 'url' }))}
                    >
                        Ссылка (URL)
                    </button>
                </div>

                <div className={styles.iconBlock}>
                    <div className={styles.iconPreview}>
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt='Превью иконки'
                                onError={() => {
                                    setPreviewUrl(null)
                                    toast.error('Не удалось загрузить изображение')
                                }}
                            />
                        ) : (
                            <span className={styles.iconPreviewEmpty}>Нет изображения</span>
                        )}
                    </div>

                    <div className={styles.iconControls}>
                        {form.iconMode === 'file' ? (
                            <label
                                className={styles.uploadLabel}
                                htmlFor={fileInputId}
                            >
                                Выбрать файл
                                <input
                                    id={fileInputId}
                                    type='file'
                                    accept='image/*'
                                    onChange={handleFileChange}
                                />
                            </label>
                        ) : (
                            <input
                                className={styles.input}
                                type='url'
                                value={form.iconUrl}
                                onChange={(e) => handleUrlChange(e.target.value)}
                                placeholder='https://example.com/icon.png'
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <Button
                    variant='contained'
                    onClick={handleSave}
                >
                    {submitLabel}
                </Button>
                <Button
                    variant='outlined'
                    onClick={onCancel}
                >
                    Отменить
                </Button>
            </div>
        </div>
    )
}
