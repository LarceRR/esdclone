import React, { memo, useCallback, useState } from 'react'
import styles from './SettingField.module.css'
import { Button, IconButton, TextField } from '@mui/material'
import EditIcon from '@public/icons/edit-icon.svg'
import { LoadingButton } from '@mui/lab'

interface ISettingFieldProps {
    initialValue: string | number
    label: string
    textFieldType?: React.InputHTMLAttributes<unknown>['type']
    onChangeField: (value: string | number) => void
    isLoading?: boolean
}

export const SettingField: React.FC<ISettingFieldProps> = memo((props: ISettingFieldProps) => {
    const { initialValue, onChangeField, textFieldType = 'text', label, isLoading } = props
    const [disabled, setDisabled] = useState<boolean>(true)
    const [value, setValue] = useState<string | number>(initialValue)

    const onResetValue = useCallback(() => setValue(initialValue), [])

    const onEnabledChanges = useCallback(() => setDisabled(false), [])
    const onDisabledChanges = useCallback(() => {
        setDisabled(true)
        onResetValue()
    }, [])
    const onApproveChanges = useCallback(() => onChangeField(value), [value])

    return (
        <div className={styles.SettingField}>
            <TextField
                fullWidth
                value={value || ''}
                disabled={disabled}
                size={'small'}
                label={label}
                type={textFieldType}
                onChange={(e) => setValue(e.target.value)}
            />
            <div className={styles.actions}>
                {disabled && (
                    <IconButton
                        size={'large'}
                        onClick={onEnabledChanges}
                    >
                        <EditIcon />
                    </IconButton>
                )}
                {!disabled && (
                    <>
                        <LoadingButton
                            loading={isLoading || false}
                            size={'medium'}
                            variant={'contained'}
                            onClick={onApproveChanges}
                        >
                            Подтвердить
                        </LoadingButton>
                        <Button
                            onClick={onDisabledChanges}
                            size={'medium'}
                            variant={'outlined'}
                        >
                            Отменить
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
})
