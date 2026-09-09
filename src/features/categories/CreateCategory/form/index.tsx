import React, { memo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import styles from './styles.module.css'
import { Box, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Button } from '@mui/material'
import { useCreateCategoryMutation } from '@/shared/api'
import { ICategoryCreate } from '@/shared/api/types'
import { useToast } from '@/shared/lib/hooks/toast'
import { CategoryParentSelect } from '@/features/categories/CategoryParentSelect'

interface IFormProps {
    onClose: () => void
}

export const Form: React.FC<IFormProps> = memo(({ onClose }: IFormProps) => {
    const [createCategory, { isLoading }] = useCreateCategoryMutation()
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const [parentId, setParentId] = useState<number | null>(null)
    const {
        handleSubmit,
        control,
    } = useForm<ICategoryCreate>({
        defaultValues: {
            title: '',
            parent_id: null,
        },
    })

    const onSubmit: SubmitHandler<ICategoryCreate> = async (data) => {
        try {
            const response = await createCategory({
                title: data.title,
                parent_id: parentId,
            }).unwrap()

            TOAST_SUCCESS(response.message || 'Категория создана')
            onClose()
        } catch (err) {
            const message =
                typeof err === 'object' && err !== null && 'data' in err
                    ? (err as { data?: { message?: string } }).data?.message
                    : undefined
            TOAST_ERROR(message ?? 'Ошибка создания категории')
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
                            fullWidth
                            label={'Наименование'}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value)}
                        />
                    )}
                    name={'title'}
                />

                <CategoryParentSelect
                    value={parentId}
                    onChange={setParentId}
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
                        Создать
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
})
