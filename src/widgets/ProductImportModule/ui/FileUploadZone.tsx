import { DownloadRoundedIcon } from '@/shared/ui/icons/DownloadRoundedIcon'
import styles from '../ProductImportModule.module.css'
import { ACCEPTED_EXTENSIONS } from '../constants'
import { useRef, useState } from 'react'

interface FileUploadZoneProps {
    onFileSelect: (file: File) => void
}

export const FileUploadZone = ({ onFileSelect }: FileUploadZoneProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [isDragActive, setIsDragActive] = useState(false)

    const handleFiles = (files: FileList | null) => {
        const file = files?.[0]
        if (!file) return
        onFileSelect(file)
    }

    return (
        <label
            className={isDragActive ? `${styles.uploadZone} ${styles.uploadZoneActive}` : styles.uploadZone}
            onDragEnter={(event) => {
                event.preventDefault()
                setIsDragActive(true)
            }}
            onDragOver={(event) => {
                event.preventDefault()
                setIsDragActive(true)
            }}
            onDragLeave={(event) => {
                event.preventDefault()
                setIsDragActive(false)
            }}
            onDrop={(event) => {
                event.preventDefault()
                setIsDragActive(false)
                handleFiles(event.dataTransfer.files)
            }}
        >
            <input
                ref={inputRef}
                type='file'
                accept={ACCEPTED_EXTENSIONS.join(',')}
                onChange={(event) => handleFiles(event.target.files)}
            />
            <span className={styles.uploadIcon}>
                <DownloadRoundedIcon size={22} />
            </span>
            <p className={styles.uploadTitle}>Перетащите файл или нажмите для выбора</p>
            <p className={styles.uploadHint}>Поддерживаются форматы CSV, JSON и XML</p>
        </label>
    )
}
