import React, { memo } from 'react'
import { Controller } from 'react-hook-form'
import { Checkbox, FormControlLabel } from '@mui/material'
import { EControllers } from '@/features/groups-list/CreateGroup/model/types'
import { Control, FieldPath } from 'react-hook-form'
import { IGroupCreate } from '@/shared/api/types'

interface ICheckboxControllerProps {
    label: EControllers
    control: Control<IGroupCreate>
    name: FieldPath<IGroupCreate>
    checkReset?: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
}

export const CheckboxController: React.FC<ICheckboxControllerProps> = memo((props: ICheckboxControllerProps) => {
    const { label, control, name, disabled, checkReset } = props
    return (
        <Controller
            control={control}
            render={({ field }) => (
                <FormControlLabel
                    sx={{
                        'marginLeft': 0,
                        'marginRight': 0,
                        'gap': 0.25,
                        '& .MuiFormControlLabel-label': {
                            fontSize: 'clamp(0.75rem, 0.68rem + 0.35vw, 0.8125rem)',
                            lineHeight: 1.2,
                        },
                    }}
                    control={
                        <Checkbox
                            sx={{
                                padding: '4px',
                            }}
                            size='small'
                            disabled={disabled}
                            onChange={(e) => {
                                field.onChange(e.target.checked)
                                if (checkReset) {
                                    checkReset(e)
                                }
                            }}
                        />
                    }
                    label={label}
                />
            )}
            name={name}
        />
    )
})
