import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useMemo } from 'react'
import { useGetCategoriesListQuery } from '@/shared/api'
import { getParentSelectOptions } from '@/entities/Categories/lib/categoryTree'

interface CategoryParentSelectProps {
    value: number | null
    onChange: (parentId: number | null) => void
    excludeId?: number
    disabled?: boolean
}

export const CategoryParentSelect = ({
    value,
    onChange,
    excludeId,
    disabled,
}: CategoryParentSelectProps) => {
    const { data } = useGetCategoriesListQuery()

    const categories = useMemo(() => data?.data ?? [], [data?.data])

    const options = useMemo(() => getParentSelectOptions(categories, excludeId), [categories, excludeId])

    return (
        <FormControl
            fullWidth
            size='small'
        >
            <InputLabel id='category-parent-label'>Родительская категория</InputLabel>
            <Select
                labelId='category-parent-label'
                label='Родительская категория'
                value={value ?? ''}
                disabled={disabled}
                onChange={(event) => {
                    const next = event.target.value
                    onChange(next === '' ? null : Number(next))
                }}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option.id ?? 'root'}
                        value={option.id ?? ''}
                    >
                        <span style={{ paddingLeft: `${option.depth * 0.85}rem` }}>
                            {option.depth > 0 ? '↳ ' : ''}
                            {option.label}
                        </span>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
