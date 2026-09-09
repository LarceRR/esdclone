import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import styles from './styles.module.css'
import { Box, Button, TextField } from '@mui/material'
import { useLazyGetCategoryQuery, useUpdateCategoryMutation } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { LoadingButton } from '@mui/lab'
import { ICategory } from '@/shared/api/types'
import { CategoryParentSelect } from '@/features/categories/CategoryParentSelect'

interface IForm {
    onClose: () => void
    userId: number
}

const initialData: ICategory = {
    id: 0,
    title: '',
    parent_id: null,
}

export const Form: React.FC<IForm> = ({ onClose, userId }) => {
    const [getCategory] = useLazyGetCategoryQuery()
    const [updateCategory, { isLoading }] = useUpdateCategoryMutation()
    const [parentId, setParentId] = useState<number | null>(null)

    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const { handleSubmit, control } = useForm<ICategory>({
        defaultValues: async () => {
            return await getCategory(userId)
                .unwrap()
                .then((res) => {
                    const category = res?.data ?? res
                    setParentId(category.parent_id ?? null)
                    return {
                        id: userId,
                        title: category.title,
                        parent_id: category.parent_id ?? null,
                    }
                })
                .catch((error) => {
                    console.error(error)
                    TOAST_ERROR('Ошибка получения информации о категории')
                    return initialData
                })
        },
    })

    const onSubmit: SubmitHandler<ICategory> = async (data) => {
        try {
            const response = await updateCategory({
                id: userId,
                title: data.title,
                parent_id: parentId,
            }).unwrap()

            TOAST_SUCCESS(response.message || 'Категория изменена')
            onClose()
        } catch (err) {
            const message =
                typeof err === 'object' && err !== null && 'data' in err
                    ? (err as { data?: { message?: string } }).data?.message
                    : undefined
            TOAST_ERROR(message ?? 'Ошибка изменения категории')
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.Form}
        >
            <Box
                display={'flex'}
                flexDirection={'column'}
                gap={'0.75rem'}
            >
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            value={field.value || ''}
                            fullWidth
                            label={'Наименование'}
                            onChange={(e) => field.onChange(e.target.value)}
                        />
                    )}
                    name={'title'}
                />

                <CategoryParentSelect
                    value={parentId}
                    onChange={setParentId}
                    excludeId={userId}
                />

                <Box
                    display={'flex'}
                    alignItems={'center'}
                    gap={'1rem'}
                    marginTop={'0.25rem'}
                >
                    <LoadingButton
                        loading={isLoading}
                        size={'medium'}
                        type={'submit'}
                        variant={'contained'}
                    >
                        Сохранить
                    </LoadingButton>
                    <Button
                        size={'medium'}
                        onClick={onClose}
                        color={'error'}
                        variant={'outlined'}
                    >
                        Отменить
                    </Button>
                </Box>
            </Box>
        </form>
    )
}
