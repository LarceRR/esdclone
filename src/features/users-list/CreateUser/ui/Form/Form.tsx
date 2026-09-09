import React, { memo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import styles from './Form.module.css'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useCreateUserMutation, useGetGroupsQuery } from '@/shared/api'
import { IUserCreate } from '@/shared/api/types'
import { useToast } from '@/shared/lib/hooks/toast'

interface IFormProps {
    onClose: () => void
}

export const Form: React.FC<IFormProps> = memo(({ onClose }: IFormProps) => {
    const [createUser, { isLoading }] = useCreateUserMutation()
    const { data: groupsList } = useGetGroupsQuery()
    const { TOAST_ERROR, TOAST_SUCCESS } = useToast()
    const {
        handleSubmit,
        control,
        // formState: { errors },
    } = useForm<IUserCreate>({
        defaultValues: {
            surname: '',
            name: '',
            email: '',
            phone: '',
            password: '',
            group_id: 0,
        },
    })

    const onSubmit: SubmitHandler<IUserCreate> = (data) => {
        createUser(data)
            .unwrap()
            .then(() => {
                TOAST_SUCCESS('Успешное создание пользователя')
            })
            .catch((err) => {
                console.log(err)
                TOAST_ERROR(err.data.message)
            })
            .finally(() => onClose())
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
                            label={'Имя'}
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
                            label={'Фамилия'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'surname'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            type={'email'}
                            label={'E-Mail'}
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
                            label={'Телефон'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'phone'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputLabel
                                size={'small'}
                                id='demo-simple-select-label'
                            >
                                Группа
                            </InputLabel>
                            <Select
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                label='Группа'
                                size={'small'}
                                onChange={(e) => field.onChange(e)}
                            >
                                {!groupsList?.data?.length && (
                                    <MenuItem
                                        disabled={true}
                                        value={'error'}
                                    >
                                        {'Группы отсутствуют'}
                                    </MenuItem>
                                )}
                                {groupsList?.data?.map((group) => (
                                    <MenuItem
                                        key={group.id}
                                        value={group.id}
                                    >
                                        {group.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    name={'group_id'}
                />
                <Controller
                    control={control}
                    render={({ field }) => (
                        <TextField
                            required
                            size={'small'}
                            fullWidth
                            type={'password'}
                            label={'Пароль'}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                    name={'password'}
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
