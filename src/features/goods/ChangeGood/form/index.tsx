import React, { memo, useEffect } from 'react'
import { useGetGoodsMutation, useUpdateGoodsMutation } from '@/shared/api'
import { CategoryGoodsSelect } from '@/features/categories/CategoryGoodsSelect'
import { useToast } from '@/shared/lib/hooks/toast'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import styles from '@/features/users-list/CreateUser/ui/Form/Form.module.css'
import { Box, Button, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { IGoods } from '@/shared/api/list/goodsApi/types.ts'
import { UploadFile } from '@/shared/ui/UploadFile'

interface IFormProps {
    onClose: () => void
    userId: number
}

export const Form: React.FC<IFormProps> = memo(({ onClose, userId }: IFormProps) => {
    const [getGoods] = useGetGoodsMutation()
    const [updateGoods, { isLoading }] = useUpdateGoodsMutation()
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()

    const { handleSubmit, control, reset } = useForm<IGoods>({
        defaultValues: {
            id: userId,
            title: '',
            description: '',
            category_id: undefined,
            cash: undefined,
        },
    })

    useEffect(() => {
        getGoods(userId)
            .unwrap()
            .then((res) => {
                const item = res.data
                reset({
                    id: item.id,
                    title: item.name,
                    description: '',
                    category_id: undefined,
                    cash: item.sellingPrice ?? undefined,
                })
            })
            .catch(() => TOAST_ERROR('Ошибка получения информации о товаре'))
    }, [getGoods, userId, reset, TOAST_ERROR])

    const onSubmit: SubmitHandler<IGoods> = (data) => {
        const formData = new FormData()
        formData.append('id', String(data.id))
        formData.append('title', data.title)
        if (data.description) formData.append('description', data.description)
        if (data.category_id) formData.append('category_id', String(data.category_id))
        if (data.cash !== undefined) formData.append('cash', String(Math.round(Number(data.cash) * 100)))
        if (data.image instanceof File) formData.append('image', data.image)

        updateGoods(formData)
            .unwrap()
            .then(() => {
                TOAST_SUCCESS('Успешное изменение продукта')
                onClose()
            })
            .catch((err) => TOAST_ERROR(err?.data?.message ?? 'Ошибка обновления'))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.Form}>
            <Box display='flex' flexDirection='column' gap='0.5rem'>
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField required size='small' fullWidth label='Наименование' value={field.value ?? ''} onChange={field.onChange} />
                    )}
                    name='title'
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField size='small' fullWidth label='Описание' value={field.value ?? ''} onChange={field.onChange} />
                    )}
                    name='description'
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <CategoryGoodsSelect value={field.value} onChange={(id) => field.onChange(id)} />
                    )}
                    name='category_id'
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            size='small'
                            fullWidth
                            label='Цена продажи ($)'
                            value={field.value ?? ''}
                            onChange={field.onChange}
                        />
                    )}
                    name='cash'
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <UploadFile
                            onChange={(e) => {
                                if (e?.target?.files?.[0]) field.onChange(e.target.files[0])
                            }}
                            id={`edit-good-${userId}`}
                        />
                    )}
                    name='image'
                />
                <Box display='flex' alignItems='center' gap='1rem' marginTop='0.5rem'>
                    <LoadingButton loading={isLoading} size='medium' type='submit' variant='contained'>
                        Сохранить
                    </LoadingButton>
                    <Button size='medium' onClick={onClose} color='error' variant='outlined'>
                        Отменить
                    </Button>
                </Box>
            </Box>
        </form>
    )
})
