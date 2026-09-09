import React, { memo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { IBoxCreate } from '@/shared/api/types'
import { Box, Button, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useCreateBoxMutation } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'

export const Form: React.FC<{ onClose: () => void }> = memo(({ onClose }: { onClose: () => void }) => {
    const [createBox, { isLoading }] = useCreateBoxMutation()
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()
    const { control, handleSubmit } = useForm<IBoxCreate>({
        defaultValues: {
            name: '',
            position: 1,
        },
    })

    const onSubmit: SubmitHandler<IBoxCreate> = (data) => {
        createBox(data)
            .unwrap()
            .then(() => TOAST_SUCCESS('Бокс успешно добавлен'))
            .catch((err) => {
                console.log(err)
                TOAST_ERROR(`Ошибка при добавлении бокса! ${err?.data?.message}`)
            })
            .finally(() => onClose())
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'name'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            type={'number'}
                            label={'Позиция'}
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'position'}
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
                        Добавить
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
