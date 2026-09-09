import styles from './ChangeSale.module.css'
import { Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { useGetOfferMutation, useUpdateOfferMutation } from '@/shared/api'
import { useToast } from '@/shared/lib/hooks/toast'
import { IOffer, ISale } from '@/shared/api/list/salesApi/types.ts'
import { UploadFile } from '@/shared/ui/UploadFile'

export const Form = ({ id, onClose }: { id: number; onClose: () => void }) => {
    const [updateOffer, { isLoading }] = useUpdateOfferMutation()
    const [getOffer] = useGetOfferMutation()
    const { TOAST_SUCCESS, TOAST_ERROR } = useToast()
    const { control, handleSubmit, setValue } = useForm<IOffer>({
        // TODO: Переделать
        // @ts-ignore
        defaultValues: async () => {
            return await getOffer(id)
                .unwrap()
                .then(
                    (res) =>
                        ({
                            id,
                            name_1: res.data.name_1,
                            name_2: res.data.name_2,
                            surname_1: res.data.surname_1,
                            surname_2: res.data.surname_2,
                            avatar_1: res.data.avatar_1,
                            avatar_2: res.data.avatar_2,
                            captain_1: res.data.captain_1 || 0,
                            captain_2: res.data.captain_2 || 0,
                            team_name: res.data.team_name,
                            region: res.data.region,
                            email: res.data.email,
                            phone: res.data.phone,
                            ship_model: res.data.ship_model,
                            engine_type: res.data.engine_type,
                            camera: res.data.camera,
                            net: res.data.net,
                            created_at: res.data.created_at,
                        }) as ISale,
                )
                .catch((err) => {
                    console.log(err)
                    return {
                        id,
                        name_1: '',
                        name_2: '',
                        captain_1: 0,
                        captain_2: 0,
                        surname_1: '',
                        surname_2: '',
                        avatar_1: '',
                        avatar_2: '',
                        team_name: '',
                        region: '',
                        email: '',
                        phone: '',
                        ship_model: '',
                        engine_type: '',
                        camera: '',
                        net: '',
                        created_at: '',
                    }
                })
        },
    })

    const onSubmit: SubmitHandler<IOffer> = (data) => {
        // const dataForRequest = { ...data, sum: isNaN(Number(data.sum)) ? 0 : Number(data.sum) }
        const formData = new FormData()

        Object.keys(data).map((key) => {
            // @ts-ignore
            formData.append(key, data[key])
        })

        updateOffer(formData)
            .unwrap()
            .then(() => {
                TOAST_SUCCESS('Заявка успешно изменена')
                onClose()
            })
            .catch((err) => {
                console.log(err)
                TOAST_ERROR(`Ошибка при добавлении заявки! ${err?.data?.message}`)
            })
    }
    return (
        <form
            className={styles.Form}
            // @ts-ignore
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
                                    value={field.value || ''}
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
                                    value={field.value || ''}
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
                                imagePath={field.value}
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
                                    value={field.value || ''}
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
                                    value={field.value || ''}
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
                                imagePath={field.value}
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
                                        checked={!!Number(field.value) || false}
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
                                        checked={!!Number(field.value) || false}
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
                                value={field.value || ''}
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
                                value={field.value || ''}
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
                                    value={field.value || ''}
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
                                    value={field.value || ''}
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
                                value={field.value || ''}
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
                                value={field.value || ''}
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
                                value={field.value || ''}
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
                                label={'Свое средство видео фиксации'}
                                value={field.value || ''}
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
                        Изменить
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
