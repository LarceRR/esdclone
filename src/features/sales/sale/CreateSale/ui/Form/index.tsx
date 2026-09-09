import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useCreateOfferMutation } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import styles from './Form.module.css'
import { IOffer } from '@/shared/api/list/salesApi/types.ts'
import { UploadFile } from '@/shared/ui/UploadFile'
import React from 'react'

export const Form: React.FC<{ onClose: () => void }> = ({ onClose }: { onClose: () => void }) => {
    const [createOffer, { isLoading }] = useCreateOfferMutation()
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()
    const { control, handleSubmit, setValue } = useForm<IOffer>()

    const onSubmit: SubmitHandler<IOffer> = (data) => {
        // const dataForRequest = { ...data, sum: isNaN(Number(data.sum)) ? 0 : Number(data.sum) }
        const formData = new FormData()

        Object.keys(data).map((key) => {
            // @ts-ignore
            formData.append(key, data[key])
        })

        createOffer(formData)
            .unwrap()
            .then(() => {
                TOAST_SUCCESS('Заявка успешно добавлена')
                onClose()
            })
            .catch((err) => {
                console.log(err)
                TOAST_ERROR(`Ошибка при добавлении продажи! ${err?.data?.message}`)
            })
    }

    return (
        <form
            className={styles.Form}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Box
                display={'flex'}
                flexDirection={'column'}
                gap={'1rem'}
            >
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={'0.5rem'}
                >
                    <h5>Участник 1</h5>
                    <Box
                        display={'flex'}
                        alignItems={'center'}
                        gap={'0.5rem'}
                    >
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    required
                                    size={'small'}
                                    fullWidth
                                    label={'Имя'}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                            name={'name_1'}
                        />
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    required
                                    size={'small'}
                                    fullWidth
                                    label={'Фамилия'}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                            name={'surname_1'}
                        />
                    </Box>
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
                        name={'avatar_1'}
                    />
                </Box>

                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={'0.5rem'}
                >
                    <h5>Участник 2</h5>
                    <Box
                        display={'flex'}
                        alignItems={'center'}
                        gap={'0.5rem'}
                    >
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    required
                                    size={'small'}
                                    fullWidth
                                    label={'Имя'}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                            name={'name_2'}
                        />
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    required
                                    size={'small'}
                                    fullWidth
                                    label={'Фамилия'}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                            name={'surname_2'}
                        />
                    </Box>
                    <Controller
                        control={control}
                        render={({ field }) => (
                            <UploadFile
                                onChange={(e) => {
                                    if (e?.target?.files?.[0]) {
                                        field.onChange(e.target.files[0])
                                    }
                                }}
                                id={'2'}
                            />
                        )}
                        name={'avatar_2'}
                    />
                </Box>

                <Box
                    alignItems={'center'}
                    display={'flex'}
                    gap={'0.5rem'}
                >
                    <Controller
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        // @ts-ignore
                                        checked={!!field.value || false}
                                        onChange={() => {
                                            if (!field.value) {
                                                field.onChange(1)
                                            } else {
                                                field.onChange(0)
                                            }

                                            if (field.name === 'captain_1') {
                                                setValue('captain_2', 0)
                                            } else {
                                                setValue('captain_1', 0)
                                            }
                                        }}
                                    />
                                }
                                label={'Капитан первый'}
                            />
                        )}
                        name={'captain_1'}
                    />
                    <Controller
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        // @ts-ignore
                                        checked={!!field.value || false}
                                        onChange={() => {
                                            if (!field.value) {
                                                field.onChange(1)
                                            } else {
                                                field.onChange(0)
                                            }

                                            if (field.name === 'captain_2') {
                                                setValue('captain_1', 0)
                                            } else {
                                                setValue('captain_2', 0)
                                            }
                                        }}
                                    />
                                }
                                label={'Капитан второй'}
                            />
                        )}
                        name={'captain_2'}
                    />
                </Box>

                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={'0.5rem'}
                >
                    <h5>Название команды</h5>
                    <Controller
                        control={control}
                        render={({ field }) => (
                            <TextField
                                required
                                size={'small'}
                                fullWidth
                                label={'Название'}
                                value={field.value}
                                onChange={(e) => field.onChange(e)}
                            />
                        )}
                        name={'team_name'}
                    />
                </Box>

                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={'0.5rem'}
                >
                    <h5>Регион участников турнира</h5>
                    <Controller
                        control={control}
                        render={({ field }) => (
                            <TextField
                                required
                                size={'small'}
                                fullWidth
                                label={'Регион'}
                                value={field.value}
                                onChange={(e) => field.onChange(e)}
                            />
                        )}
                        name={'region'}
                    />
                </Box>

                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={'0.5rem'}
                >
                    <h5>Контактная информация</h5>
                    <Box
                        display={'flex'}
                        alignItems={'center'}
                        gap={'0.5rem'}
                    >
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    required
                                    size={'small'}
                                    type={'email'}
                                    fullWidth
                                    label={'Email'}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                            name={'email'}
                        />
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    required
                                    size={'small'}
                                    fullWidth
                                    label={'Номер телефона'}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                            name={'phone'}
                        />
                    </Box>
                </Box>

                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={'0.5rem'}
                >
                    <h5>Обородуование</h5>
                    <Controller
                        control={control}
                        render={({ field }) => (
                            <TextField
                                required
                                size={'small'}
                                fullWidth
                                label={'Модель'}
                                value={field.value}
                                onChange={(e) => field.onChange(e)}
                            />
                        )}
                        name={'ship_model'}
                    />
                    <Controller
                        control={control}
                        render={({ field }) => (
                            <TextField
                                required
                                size={'small'}
                                fullWidth
                                label={'Тип двигателя'}
                                value={field.value}
                                onChange={(e) => field.onChange(e)}
                            />
                        )}
                        name={'engine_type'}
                    />
                    <Controller
                        control={control}
                        render={({ field }) => (
                            <TextField
                                required
                                size={'small'}
                                fullWidth
                                label={'Свое средство видео фиксации'}
                                value={field.value}
                                onChange={(e) => field.onChange(e)}
                            />
                        )}
                        name={'camera'}
                    />
                    <Controller
                        control={control}
                        render={({ field }) => (
                            <TextField
                                required
                                size={'small'}
                                fullWidth
                                label={'Садок LIVEWELL'}
                                value={field.value}
                                onChange={(e) => field.onChange(e)}
                            />
                        )}
                        name={'net'}
                    />
                </Box>

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
}
