import React, { memo } from 'react'
import { useCreateGoodsMutation } from '@/shared/api'
import { CategoryGoodsSelect } from '@/features/categories/CategoryGoodsSelect'
import { useToast } from '@/shared/lib/hooks/toast'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import styles from '@/features/users-list/CreateUser/ui/Form/Form.module.css'
import { Box, Button, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { IGoodsCreate } from '@/shared/api/list/goodsApi/types.ts'
import { UploadFile } from '@/shared/ui/UploadFile'

interface IFormProps {
    onClose: () => void
}

export const Form: React.FC<IFormProps> = memo(({ onClose }: IFormProps) => {
    const [createOrder, { isLoading }] = useCreateGoodsMutation()
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const {
        handleSubmit,
        control,
        // formState: { errors },
    } = useForm<IGoodsCreate & { cash?: number; category_id?: number }>({
        defaultValues: {
            title: '',
            description: '',
        },
    })

    const onSubmit: SubmitHandler<IGoodsCreate> = (data) => {
        console.log(data)
        const formData = new FormData()

        formData.append('shop_status', 'draft')
        Object.keys(data).map((key) => {
            // @ts-ignore
            formData.append(key, data[key])
        })

        createOrder(formData)
            .unwrap()
            .then(() => {
                TOAST_SUCCESS('Успешное создание продукта')
                onClose()
            })
            .catch((err) => {
                console.log(err)
                TOAST_ERROR(err.data.message)
            })
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.Form}
        >
            <Box
                display={'flex'}
                flexDirection={'column'}
                gap={'0.5rem'}
            >
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            label={'Наименование'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'title'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            label={'Описание'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'description'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <CategoryGoodsSelect
                            value={field.value}
                            onChange={(id) => field.onChange(id)}
                        />
                    )}
                    name={'category_id'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            label={'Цена'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'cash'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <UploadFile
                            onChange={(e) => {
                                if (e?.target?.files?.[0]) {
                                    field.onChange(e.target.files[0])
                                }
                            }}
                            id={'1'}
                        />
                    )}
                    name={'image'}
                />
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    gap={'1rem'}
                    marginTop={'0.5rem'}
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
