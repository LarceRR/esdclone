import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useMemo } from 'react'
import { useGetCategoriesListQuery } from '@/shared/api'
import { getCategorySelectOptions } from '@/entities/Categories/lib/categoryTree'

interface CategoryGoodsSelectProps {
    value?: number
    onChange: (categoryId: number) => void
}

export const CategoryGoodsSelect = ({ value, onChange }: CategoryGoodsSelectProps) => {
    const { data: categoriesList } = useGetCategoriesListQuery()

    const options = useMemo(
        () => getCategorySelectOptions(categoriesList?.data ?? []),
        [categoriesList?.data],
    )

    return (
        <FormControl
            fullWidth
            size='small'
        >
            <InputLabel id='goods-category-label'>Категория</InputLabel>
            <Select
                labelId='goods-category-label'
                id='goods-category-select'
                label='Категория'
                value={value ?? ''}
                onChange={(e) => onChange(Number(e.target.value))}
            >
                {!options.length && (
                    <MenuItem
                        disabled
                        value=''
                    >
                        Категории отсутствуют
                    </MenuItem>
                )}
                {options.map((option) => (
                    <MenuItem
                        key={option.id}
                        value={option.id}
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
