import React, { memo } from 'react'
import { Controller } from 'react-hook-form'
import { Checkbox, FormControlLabel } from '@mui/material'
import { EControllers } from '@/features/groups-list/CreateGroup/model/types'
import { Control, FieldPath, ControllerRenderProps, ControllerFieldState } from 'react-hook-form'
import { IGroupUpdate } from '@/shared/api/types'

interface ICheckboxControllerProps {
    label: EControllers
    control: Control<IGroupUpdate>
    name: FieldPath<IGroupUpdate>
    checkReset?: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
}

export const CheckboxController: React.FC<ICheckboxControllerProps> = memo((props: ICheckboxControllerProps) => {
    const { label, control, name, checkReset, disabled } = props
    return (
        <Controller
            control={control}
            render={({ field }: { field: ControllerRenderProps<IGroupUpdate, typeof name>; fieldState: ControllerFieldState }) => (
                <FormControlLabel
                    control={
                        <Checkbox
                            sx={{
                                padding: '4px',
                            }}
                            disabled={disabled}
                            // @ts-ignore
                            checked={field.value || false}
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
